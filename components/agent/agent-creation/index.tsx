"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, X, Wand2, User2, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';
import { AgentFormData } from '@/types';
import { createAdminAgent } from '@/services/agent-service';
import { useActivities } from '@/contexts/activity-context';
import { useAgents } from '@/contexts/agent-context';
import { useCompany } from '@/contexts/company-context';
import { availableVoiceFiles, languageOptions, toneOptions } from '@/constants';

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

const AgentCreationForm = () => {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { token } = useIsAuthenticated();
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

  // const getAudioPath = useCallback((gender: string, tone: string, language: string) => {
  //   if (!gender || !tone || !language) return null;
  //   return `/voices/${gender}-${tone}-${language}.mp3`;
  // }, []);

  const handleSelectionChange = (type: 'gender' | 'tone' | 'language', value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [type]: value };

      if (newData.gender && newData.tone && newData.language) {
        loadAudio(newData.gender, newData.tone, newData.language);
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
          if (checkIfVoiceExists(newData.gender, langOption.accent, langOption.language)) {
            loadAudio(newData.gender, langOption.accent, langOption.language);
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

  const checkIfVoiceExists = useCallback((gender: string, accent: string, language: string) => {
    return availableVoiceFiles.includes(`${gender}-${accent}-${language}`);
  }, [availableVoiceFiles]);

  const loadAudio = useCallback(async (gender: string, accent: string, language: string): Promise<(() => void) | undefined> => {
    setIsAudioLoading(true);
    setAudioError(false);

    console.log(`Attempting to load voice: ${gender}-${accent}-${language}`);

    if (!checkIfVoiceExists(gender, accent, language)) {
      console.log(`Voice not found: ${gender}-${accent}-${language}`);
      setAudioError(true);
      setIsAudioLoading(false);
      toast({
        title: "Voice Unavailable",
        description: "This voice combination is not available. Please try a different selection.",
        variant: "destructive",
      });
      return;
    }

    const audioPath = `${window.location.origin}/voices/${gender}-${accent}-${language}.mp3`;
    console.log('Full audio URL:', audioPath);

    try {
      if (!audioRef.current) {
        console.error('Audio element reference not available');
        throw new Error('Audio element not available');
      }

      let isCanceled = false;

      const currentAudioRef = audioRef.current;

      // Set up event listeners for tracking loading state
      const onCanPlay = () => {
        if (isCanceled) return;

        console.log('Audio can play now');
        setIsAudioLoading(false);
        setAudioError(false);
        setAudio(currentAudioRef);

        // Remove event listeners
        currentAudioRef.removeEventListener('canplaythrough', onCanPlay);
        currentAudioRef.removeEventListener('error', onError);
      };

      const onError = (e: Event) => {
        if (isCanceled) return;

        console.error('Audio error details:', {
          src: currentAudioRef.src,
          error: e,
          networkState: currentAudioRef.networkState,
          readyState: currentAudioRef.readyState
        });

        setAudioError(true);
        setIsAudioLoading(false);

        // Remove event listeners
        currentAudioRef.removeEventListener('canplaythrough', onCanPlay);
        currentAudioRef.removeEventListener('error', onError);

        toast({
          title: "Audio Load Error",
          description: "Could not load the voice sample. Please try a different selection.",
          variant: "destructive",
        });
      };

      // Clear previous event listeners if any
      currentAudioRef.removeEventListener('canplaythrough', onCanPlay);
      currentAudioRef.removeEventListener('error', onError);

      // Add new event listeners
      currentAudioRef.addEventListener('canplaythrough', onCanPlay);
      currentAudioRef.addEventListener('error', onError);

      // Set source and load audio
      currentAudioRef.src = audioPath;
      currentAudioRef.load(); // Important!

      // Set a safety timeout
      const timeoutId = setTimeout(() => {
        if (isAudioLoading && !isCanceled) {
          isCanceled = true;
          setIsAudioLoading(false);
          setAudioError(true);

          // Remove event listeners
          currentAudioRef.removeEventListener('canplaythrough', onCanPlay);
          currentAudioRef.removeEventListener('error', onError);

          toast({
            title: "Loading Error",
            description: "Audio is taking too long to load. Please try again.",
            variant: "destructive",
          });
        }
      }, 7000);

      // Return a cleanup function to handle component unmount or re-renders
      return () => {
        isCanceled = true;
        clearTimeout(timeoutId);
        currentAudioRef.removeEventListener('canplaythrough', onCanPlay);
        currentAudioRef.removeEventListener('error', onError);
      };

    } catch (e: any) {
      console.error('Error loading audio:', e);
      setAudioError(true);
      setIsAudioLoading(false);
      toast({
        title: "Audio Load Error",
        description: e?.message || "Could not load the voice sample. Please try again.",
        variant: "destructive",
      });
    }
  }, [checkIfVoiceExists]);

  const handlePlayAudio = () => {
    if (!audio || !audioRef.current) return;
  
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Error playing audio:', error);
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

  const uploadFiles = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/upload-multiple`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to upload files');
      }

      const newFiles = result.files.map((file: any) => file.url) as string[];

      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));

      return newFiles;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
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

      let fileUrls: string[] = [];

      if (files && files.length > 0) {
        fileUrls = await uploadFiles(files);
      }

      if (!user?.id) {
        throw new Error("User ID is required");
      }

      if (!company || !company.id) {
        throw new Error("Company ID is required");
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
        files: fileUrls || [],
      };

      await createAdminAgent(agentData, company?.id as string, user.id);

      await Promise.all([refreshAgents(), refreshActivities()]);

      toast({
        title: "Success",
        description: "Agent created successfully!",
      });

      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error && error.message ? error.message : "Failed to create agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      const audioElement = audioRef.current;
      
      // Define event handlers
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      const onEnded = () => {
        console.log('Audio playback ended');
        setIsPlaying(false);
      };
      
      // Important: Add timeupdate event to check for end of playback
      const onTimeUpdate = () => {
        if (audioElement.currentTime >= audioElement.duration - 0.1) {
          console.log('Audio reached end via timeupdate');
          setIsPlaying(false);
        }
      };
      
      // Add all event listeners
      audioElement.addEventListener('play', onPlay);
      audioElement.addEventListener('pause', onPause);
      audioElement.addEventListener('ended', onEnded);
      audioElement.addEventListener('timeupdate', onTimeUpdate);
      
      // Cleanup function
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
            loadAudio(data.gender, langOption.accent, langOption.language);
          }
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, [loadAudio]);

  useEffect(() => {
    if (formData.gender && selectedLanguageOption) {
      loadAudio(formData.gender, selectedLanguageOption.accent, selectedLanguageOption.language);
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [formData.gender, selectedLanguageOption, loadAudio, audio]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full p-6 flex items-center justify-center">
      <audio
        ref={audioRef}
        style={{ display: "none" }}
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />
      <Card className="w-full max-w-2xl bg-white shadow-xl rounded-xl">
        <CardHeader className="border-b border-gray-100 pb-6 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Wand2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Create your agent
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Set up and train your AI assistant
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 max-h-[70vh] overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* ==== SETUP SECTION ==== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Agent Profile
                </h3>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Name*
                  </label>
                  <Input
                    placeholder="Enter your agent's name"
                    className="w-full border-gray-200 focus:border-blue-500 h-12 text-lg"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* ==== VOICE CUSTOMIZATION ==== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Voice Customization
                </h3>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl space-y-6">
                <div className="flex items-center gap-4">
                <button
  onClick={handlePlayAudio}
  className={`w-12 h-12 rounded-full bg-gradient-to-b ${audioError ? "bg-red-500" : "from-[#162a47] via-[#3362A6]/90 to-[#162a47]"} shadow-sm flex items-center justify-center transition-colors 
              ${isAudioLoading ? 'cursor-wait' : ''} 
              ${!audio || isAudioLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}`
  }
  disabled={!audio || isAudioLoading}
>
  {isAudioLoading ? (
    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
  ) : (
    isPlaying ? (
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
      </svg>
    ) : (
      <Play className="w-6 h-6 text-white" />
    )
  )}
</button>

                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600 ml-1">
                        Gender*
                      </label>
                      <Select value={formData.gender} onValueChange={(value) => handleSelectionChange('gender', value)}>
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600 ml-1">
                        Tone*
                      </label>
                      <Select value={formData.tone} onValueChange={(value) => handleSelectionChange('tone', value)}>
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {toneOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600 ml-1">
                        Language*
                      </label>
                      <Select value={formData.language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
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
              </div>
            </div>

            {/* ==== ROLE DESCRIPTION ==== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Agent Training
                </h3>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Job Role Description*
                  </label>
                  <Textarea
                    value={formData.roleDescription}
                    onChange={(e) => handleInputChange('roleDescription', e.target.value)}
                    placeholder="Describe the agent's role and responsibilities..."
                    className="min-h-[100px] resize-none border-gray-200 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Business Context*
                  </label>
                  <Textarea
                    value={formData.businessContext}
                    onChange={(e) => handleInputChange('businessContext', e.target.value)}
                    placeholder="Tell us about your business context..."
                    className="min-h-[100px] resize-none border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* ==== DOCUMENT UPLOAD ==== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Training Documents
                </h3>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <p className="text-sm text-gray-700">
                  To make your agent adhere to your business terms and compliance, upload here:
                </p>

                <div className="flex flex-wrap gap-4">
                  {files.length > 0 && (
                    <div className="mt-4 w-full">
                      <p className="text-sm font-medium text-gray-700 mb-2">Uploaded files:</p>
                      <ul className="space-y-1">
                        {files.map((file, index) => (
                          <div key={`${file.name}-${index}`} className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              className="flex-1 flex items-center gap-2 h-auto py-2 px-4 border-dashed border-2"
                            >
                              <Upload className="w-4 h-4" />
                              {file.name}
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handleDeleteFile(index)}
                              className="p-2 hover:bg-red-100 hover:text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 bg-gray-50 cursor-pointer"
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
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Upload Documents
                    </h3>
                    <p className="text-sm text-gray-500">
                      Drag & drop your files here or click to browse
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ==== ADVANCED SETTINGS ==== */}
            <div className="space-y-4">
              <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 w-full text-left">
                  <div className="w-5 h-5 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Advanced Settings
                  </h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 ml-2 transition-transform"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-gray-50 p-6 rounded-xl mt-4">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-700 mb-4">
                      To enable seamless integration, provide the following details:
                    </p>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Authentication URL
                        </label>
                        <Input
                          value={formData.advanced_settings.authUrl}
                          onChange={(e) => handleAdvancedSettingsChange({ ...formData.advanced_settings, authUrl: e.target.value })}
                          placeholder="Enter your authentication URL"
                          className="w-full border-gray-200 focus:border-blue-500 h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Client ID
                        </label>
                        <Input
                          value={formData.advanced_settings.clientId}
                          onChange={(e) => handleAdvancedSettingsChange({ ...formData.advanced_settings, clientId: e.target.value })}
                          placeholder="Enter your client ID"
                          className="w-full border-gray-200 focus:border-blue-500 h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Client Secret
                        </label>
                        <Input
                          value={formData.advanced_settings.clientSecret}
                          onChange={(e) => handleAdvancedSettingsChange({ ...formData.advanced_settings, clientSecret: e.target.value })}
                          placeholder="Enter your client secret"
                          className="w-full border-gray-200 focus:border-blue-500 h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          API Endpoints
                        </label>
                        <Textarea
                          value={formData.advanced_settings.apis.join(',')}
                          onChange={(e) => handleApiUrlChange(e.target.value)}
                          placeholder="Enter list of APIs separated by comma"
                          className="w-full border-gray-200 focus:border-blue-500 h-24"
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </CardContent>

        {/* Fixed submit button at bottom */}
        <div className="border-t border-gray-100 p-6 sticky bottom-0 bg-white flex justify-between">
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-2 h-auto text-lg font-medium rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 h-auto text-lg font-medium rounded-xl"
          >
            Create Agent
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AgentCreationForm;