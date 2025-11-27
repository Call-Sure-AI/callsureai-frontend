"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, X, Wand2, User2, Play, Pause, Sparkles, Bot, FileText, Settings, ChevronDown, Mic, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { toast } from '@/hooks/use-toast';
import { useCurrentUser } from '@/hooks/use-current-user';
import { AgentFormData } from '@/types';
import { createAgentAction } from '@/lib/actions/agent-actions';
import { useActivities } from '@/contexts/activity-context';
import { useAgents } from '@/contexts/agent-context';
import { useCompany } from '@/contexts/company-context';
import { availableVoiceFiles, languageOptions, toneOptions } from '@/constants';
import AccessDenied from '@/components/dashboard/access-denied';

interface AdvancedSettings {
  authUrl: string;
  clientId: string;
  clientSecret: string;
  apis: string[];
}

interface FormData {
  name: string;
  gender: string;
  tone: string;
  language: string;
  roleDescription: string;
  businessContext: string;
  advanced_settings: AdvancedSettings;
  files: string[];
}

const initialFormData: FormData = {
  name: '',
  gender: '',
  tone: '',
  language: '',
  roleDescription: '',
  businessContext: '',
  advanced_settings: {
    authUrl: '',
    clientId: '',
    clientSecret: '',
    apis: []
  },
  files: [] as string[],
};

// Section Header Component
const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </div>
  </div>
);

// Form Section Wrapper
const FormSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-6 ${className}`}
  >
    {children}
  </motion.div>
);

const AgentCreationForm = () => {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { company } = useCompany();
  const { refreshActivities } = useActivities();
  const { refreshAgents, totalAgents } = useAgents();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [files, setFiles] = useState<File[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLanguageOption, setSelectedLanguageOption] = useState<{ accent: string, language: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleDeleteFile = (indexToDelete: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToDelete));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdvancedSettingsChange = (value: AdvancedSettings) => {
    setFormData(prev => ({ ...prev, advanced_settings: value }));
  };

  const handleApiUrlChange = (value: string) => {
    value = value.trim();
    setFormData(prev => ({ ...prev, advanced_settings: { ...prev.advanced_settings, apis: value.split(',') } }));
  };

  const handleSelectionChange = (type: 'gender' | 'tone' | 'language', value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [type]: value };

      if (newData.gender && newData.language && selectedLanguageOption) {
        const languageCode = `${selectedLanguageOption.accent}-${selectedLanguageOption.language}`;
        loadAudio(newData.gender, languageCode);
      }

      return newData;
    });
  };

  const handleLanguageChange = (value: string) => {
    const langOption = languageOptions.find(opt => opt.value === value);

    if (langOption) {
      setSelectedLanguageOption({
        accent: langOption.accent,
        language: langOption.language
      });

      setFormData(prev => {
        const newData = { ...prev, language: value };

        if (newData.gender && langOption) {
          const languageCode = `${langOption.accent}-${langOption.language}`;
          if (checkIfVoiceExists(newData.gender, languageCode)) {
            loadAudio(newData.gender, languageCode);
          } else {
            setAudioError(true);
            toast({
              title: "Voice Unavailable",
              description: "This voice combination is not available. Please try a different selection.",
              variant: "destructive",
            });
          }
        }

        return newData;
      });
    }
  };

  const checkIfVoiceExists = useCallback((gender: string, language: string) => {
    const fileName = `${gender}-${language}`;
    return availableVoiceFiles.includes(fileName);
  }, []);

  const loadAudio = useCallback(async (gender: string, language: string): Promise<(() => void) | undefined> => {
    setIsAudioLoading(true);
    setAudioError(false);

    if (!checkIfVoiceExists(gender, language)) {
      setAudioError(true);
      setIsAudioLoading(false);
      toast({
        title: "Voice Unavailable",
        description: "This voice combination is not available. Please try a different selection.",
        variant: "destructive",
      });
      return;
    }

    const audioPath = `${window.location.origin}/voices/${gender}-${language}.mp3`;

    try {
      if (!audioRef.current) {
        throw new Error('Audio element not available');
      }

      let isCanceled = false;
      const currentAudioRef = audioRef.current;

      const onCanPlay = () => {
        if (isCanceled) return;
        setIsAudioLoading(false);
        setAudioError(false);
        setAudio(currentAudioRef);
        currentAudioRef.removeEventListener('canplaythrough', onCanPlay);
        currentAudioRef.removeEventListener('error', onError);
      };

      const onError = () => {
        if (isCanceled) return;
        setAudioError(true);
        setIsAudioLoading(false);
        currentAudioRef.removeEventListener('canplaythrough', onCanPlay);
        currentAudioRef.removeEventListener('error', onError);
        toast({
          title: "Audio Load Error",
          description: "Could not load the voice sample. Please try a different selection.",
          variant: "destructive",
        });
      };

      currentAudioRef.removeEventListener('canplaythrough', onCanPlay);
      currentAudioRef.removeEventListener('error', onError);
      currentAudioRef.addEventListener('canplaythrough', onCanPlay);
      currentAudioRef.addEventListener('error', onError);
      currentAudioRef.src = audioPath;
      currentAudioRef.load();

      const timeoutId = setTimeout(() => {
        if (isAudioLoading && !isCanceled) {
          isCanceled = true;
          setIsAudioLoading(false);
          setAudioError(true);
          currentAudioRef.removeEventListener('canplaythrough', onCanPlay);
          currentAudioRef.removeEventListener('error', onError);
        }
      }, 7000);

      return () => {
        isCanceled = true;
        clearTimeout(timeoutId);
        currentAudioRef.removeEventListener('canplaythrough', onCanPlay);
        currentAudioRef.removeEventListener('error', onError);
      };

    } catch (e: any) {
      setAudioError(true);
      setIsAudioLoading(false);
      toast({
        title: "Audio Load Error",
        description: e?.message || "Could not load the voice sample. Please try again.",
        variant: "destructive",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIfVoiceExists]);

  const handlePlayAudio = () => {
    if (!audio || !audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
        toast({
          title: "Playback Error",
          description: "Could not play the voice sample. Please try again.",
          variant: "destructive",
        });
      });
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const uploadFiles = async (files: File[], companyId: string, agentId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('company_id', companyId);
      formData.append('agent_id', agentId);
      formData.append('document_type', 'custom');

      const response = await fetch(
        `https://processor.callsure.ai/api/v1/documents/upload-pdfs`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to upload documents`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Upload failed');
      }

      const uploadedUrls = result.results
        .filter((r: any) => r.success)
        .map((r: any) => r.s3_url);

      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...uploadedUrls]
      }));

      return uploadedUrls;
      
    } catch (error: any) {
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      const token = localStorage.getItem('token');

      const validationChecks = [
        { condition: !user, message: "You must be logged in to create an agent." },
        { condition: !token, message: "Please login to create an agent." },
        { condition: !formData.name || !formData.gender || !formData.tone || !formData.language, message: "Please complete the agent setup fields." },
        { condition: !formData.roleDescription || !formData.businessContext, message: "Please complete the agent training fields." }
      ];

      for (const check of validationChecks) {
        if (check.condition) {
          toast({
            title: "Error",
            description: check.message,
            variant: "destructive"
          });
          return;
        }
      }

      if (!user?.id) {
        throw new Error("User ID is required");
      }

      if (!company || !company.id) {
        throw new Error("Company ID is required");
      }

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const agentData: AgentFormData = {
        user_id: user.id,
        name: formData.name,
        type: totalAgents === 0 ? 'base' : 'custom',
        prompt: formData.roleDescription,
        is_active: true,
        additional_context: {
          gender: formData.gender,
          tone: formData.tone,
          language: formData.language,
          roleDescription: formData.roleDescription,
          businessContext: formData.businessContext,
        },
        advanced_settings: formData.advanced_settings,
        files: [],
      };

      const result = await createAgentAction(
        agentData,
        company.id as string,
        user.id,
        token
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to create agent');
      }

      if (files && files.length > 0) {
        try {
          const agentId = result.data?.id;
          if (!agentId) {
            throw new Error('Agent ID not returned from creation');
          }

          await uploadFiles(files, company.id, agentId);
          
          toast({
            title: "Success",
            description: `Agent created with ${files.length} document(s) uploaded successfully!`,
          });
        } catch (uploadError: any) {
          toast({
            title: "Partial Success",
            description: `Agent created but some documents failed to upload: ${uploadError.message}`,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Agent created successfully!",
        });
      }

      await Promise.all([refreshAgents(), refreshActivities()]);
      router.push('/dashboard');

    } catch (error: any) {
      toast({
        title: "Error",
        description: error && error.message ? error.message : "Failed to create agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      const audioElement = audioRef.current;

      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      const onEnded = () => setIsPlaying(false);
      const onTimeUpdate = () => {
        if (audioElement.currentTime >= audioElement.duration - 0.1) {
          setIsPlaying(false);
        }
      };

      audioElement.addEventListener('play', onPlay);
      audioElement.addEventListener('pause', onPause);
      audioElement.addEventListener('ended', onEnded);
      audioElement.addEventListener('timeupdate', onTimeUpdate);

      return () => {
        audioElement.removeEventListener('play', onPlay);
        audioElement.removeEventListener('pause', onPause);
        audioElement.removeEventListener('ended', onEnded);
        audioElement.removeEventListener('timeupdate', onTimeUpdate);
      };
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);

    try {
      const savedData = window.sessionStorage.getItem('agentSetupData');
      if (savedData) {
        const data = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          name: data.name || '',
          gender: data.gender || '',
          tone: data.tone || '',
          language: data.language || ''
        }));

        if (data.language) {
          const langOption = languageOptions.find(opt => opt.value === data.language);
          if (langOption && data.gender) {
            setSelectedLanguageOption({
              accent: langOption.accent,
              language: langOption.language
            });
            const languageCode = `${langOption.accent}-${langOption.language}`;
            loadAudio(data.gender, languageCode);
          }
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formData.gender && selectedLanguageOption) {
      const languageCode = `${selectedLanguageOption.accent}-${selectedLanguageOption.language}`;
      loadAudio(formData.gender, languageCode);
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.gender, selectedLanguageOption]);

  if (!isMounted) {
    return null;
  }

  if (user?.role !== "admin") {
    return <AccessDenied />;
  }

  return (
    <div className="w-full min-h-screen py-8 px-4">
      <audio
        ref={audioRef}
        style={{ display: "none" }}
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header Card */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 shadow-xl rounded-2xl overflow-hidden">
          {/* Gradient top border */}
          <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
          
          <CardHeader className="border-b border-gray-200/50 dark:border-slate-800/50 pb-6 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 dark:from-cyan-500/5 dark:to-blue-500/5">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur-lg opacity-40" />
                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Bot className="w-7 h-7 text-white" />
                </div>
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create Your AI Agent
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Set up and train your intelligent voice assistant
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <div className="p-6 space-y-6">
              
              {/* Agent Profile Section */}
              <FormSection>
                <SectionHeader icon={User2} title="Agent Profile" subtitle="Give your agent a unique identity" />
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Agent Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter your agent's name"
                      className="w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20 h-12 text-lg rounded-xl"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                </div>
              </FormSection>

              {/* Voice Customization Section */}
              <FormSection>
                <SectionHeader icon={Mic} title="Voice Customization" subtitle="Choose how your agent sounds" />
                
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  {/* Play Button */}
                  <motion.button
                    onClick={handlePlayAudio}
                    disabled={!audio || isAudioLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                      audioError 
                        ? "bg-red-500 shadow-red-500/30" 
                        : "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30"
                    } ${!audio || isAudioLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}`}
                  >
                    {isAudioLoading ? (
                      <Loader2 className="w-7 h-7 text-white animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="w-7 h-7 text-white" />
                    ) : (
                      <Play className="w-7 h-7 text-white ml-1" />
                    )}
                  </motion.button>

                  {/* Voice Options */}
                  <div className="flex flex-wrap gap-4 flex-1">
                    <div className="space-y-2 min-w-[140px]">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <Select value={formData.gender} onValueChange={(value) => handleSelectionChange('gender', value)}>
                        <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:border-cyan-500 rounded-xl">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 min-w-[140px]">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Tone <span className="text-red-500">*</span>
                      </label>
                      <Select value={formData.tone} onValueChange={(value) => handleSelectionChange('tone', value)}>
                        <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:border-cyan-500 rounded-xl">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                          {toneOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 min-w-[140px]">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Language <span className="text-red-500">*</span>
                      </label>
                      <Select value={formData.language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:border-cyan-500 rounded-xl">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                          {languageOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </FormSection>

              {/* Agent Training Section */}
              <FormSection>
                <SectionHeader icon={Wand2} title="Agent Training" subtitle="Define your agent's knowledge and behavior" />
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Job Role Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={formData.roleDescription}
                      onChange={(e) => handleInputChange('roleDescription', e.target.value)}
                      placeholder="Describe the agent's role and responsibilities..."
                      className="min-h-[120px] resize-none bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Context <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={formData.businessContext}
                      onChange={(e) => handleInputChange('businessContext', e.target.value)}
                      placeholder="Tell us about your business context..."
                      className="min-h-[120px] resize-none bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl"
                    />
                  </div>
                </div>
              </FormSection>

              {/* Document Upload Section */}
              <FormSection>
                <SectionHeader icon={FileText} title="Training Documents" subtitle="Upload files to enhance agent knowledge" />
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Upload documents to help your agent understand your business terms and compliance requirements.
                </p>

                {/* Uploaded Files */}
                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 space-y-2"
                    >
                      {files.map((file, index) => (
                        <motion.div
                          key={`${file.name}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-3 p-3 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 rounded-xl"
                        >
                          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() => handleDeleteFile(index)}
                            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Upload Area */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 rounded-2xl p-8 cursor-pointer transition-all bg-gray-50/50 dark:bg-slate-800/50 hover:bg-cyan-50/50 dark:hover:bg-cyan-500/5"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    className="hidden"
                    accept='application/pdf , .docx, .doc, .png , .jpg , .jpeg'
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                      <Upload className="w-7 h-7 text-cyan-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Upload Documents
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Drag & drop files here or click to browse
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Supports PDF, DOCX, PNG, JPG
                    </p>
                  </div>
                </motion.div>
              </FormSection>

              {/* Advanced Settings */}
              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-700/50 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Settings</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">API integrations and authentication</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: advancedOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-700/50 space-y-5"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Authentication URL
                      </label>
                      <Input
                        value={formData.advanced_settings.authUrl}
                        onChange={(e) => handleAdvancedSettingsChange({ ...formData.advanced_settings, authUrl: e.target.value })}
                        placeholder="Enter your authentication URL"
                        className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:border-cyan-500 rounded-xl h-12"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Client ID
                      </label>
                      <Input
                        value={formData.advanced_settings.clientId}
                        onChange={(e) => handleAdvancedSettingsChange({ ...formData.advanced_settings, clientId: e.target.value })}
                        placeholder="Enter your client ID"
                        className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:border-cyan-500 rounded-xl h-12"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Client Secret
                      </label>
                      <Input
                        value={formData.advanced_settings.clientSecret}
                        onChange={(e) => handleAdvancedSettingsChange({ ...formData.advanced_settings, clientSecret: e.target.value })}
                        placeholder="Enter your client secret"
                        type="password"
                        className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:border-cyan-500 rounded-xl h-12"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        API Endpoints
                      </label>
                      <Textarea
                        value={formData.advanced_settings.apis.join(',')}
                        onChange={(e) => handleApiUrlChange(e.target.value)}
                        placeholder="Enter list of APIs separated by comma"
                        className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:border-cyan-500 rounded-xl min-h-[100px]"
                      />
                    </div>
                  </motion.div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>

          {/* Footer Actions */}
          <div className="border-t border-gray-200/50 dark:border-slate-800/50 p-6 bg-gray-50/50 dark:bg-slate-900/50 flex justify-between gap-4">
            <Button
              onClick={() => router.push('/dashboard')}
              disabled={isSubmitting}
              variant="outline"
              className="px-8 py-3 h-auto text-base font-medium rounded-xl border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3 h-auto text-base font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all disabled:opacity-50"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Agent...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Create Agent</span>
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AgentCreationForm;