// components/agent/agent-creation/index.tsx
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
  SelectGroup,
  SelectLabel,
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

// Voice options
const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
  { value: 'calm', label: 'Calm' },
];

const languageOptions = [
  // American
  { value: 'american-en', label: 'American - English', accent: 'american', language: 'en' },
  // Indian
  { value: 'indian-en', label: 'Indian - English', accent: 'indian', language: 'en' },
  { value: 'indian-hn', label: 'Indian - Hindi', accent: 'indian', language: 'hn' },
  // British
  { value: 'british-en', label: 'British - English', accent: 'british', language: 'en' },
  // Spanish
  { value: 'spanish-es', label: 'Spanish - Spanish', accent: 'spanish', language: 'es' },
  // Arabic
  { value: 'arabic-ar', label: 'Arabic - Arabic', accent: 'arabic', language: 'ar' },
  // Chinese
  { value: 'chinese-cn', label: 'Chinese - Chinese', accent: 'chinese', language: 'cn' },
  // German
  { value: 'german-de', label: 'German - German', accent: 'german', language: 'de' },
  // French
  { value: 'french-fr', label: 'French - French', accent: 'french', language: 'fr' },
  // Italian
  { value: 'italian-it', label: 'Italian - Italian', accent: 'italian', language: 'it' },
  // Portuguese
  { value: 'portuguese-pt', label: 'Portuguese - Portuguese', accent: 'portuguese', language: 'pt' },
  // Russian
  { value: 'russian-ru', label: 'Russian - Russian', accent: 'russian', language: 'ru' },
  // Japanese
  { value: 'japanese-jp', label: 'Japanese - Japanese', accent: 'japanese', language: 'jp' },
  // Korean
  { value: 'korean-ko', label: 'Korean - Korean', accent: 'korean', language: 'ko' },
  // Dutch
  { value: 'dutch-nl', label: 'Dutch - Dutch', accent: 'dutch', language: 'nl' },
  // Turkish
  { value: 'turkish-tr', label: 'Turkish - Turkish', accent: 'turkish', language: 'tr' },
  // Polish
  { value: 'polish-pl', label: 'Polish - Polish', accent: 'polish', language: 'pl' },
];

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
  const [selectedLanguageOption, setSelectedLanguageOption] = useState<{accent: string, language: string} | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const availableVoiceFiles = [
    'female-american-en',
    'female-american-hn',
    'female-arabic-ar',
    'female-british-en',
    'female-chinese-cn',
    'female-dutch-nl',
    'female-french-fr',
    'female-german-de',
    'female-indian-en',
    'female-indian-hn',
    'female-italian-it',
    'female-japanese-jp',
    'female-korean-ko',
    'female-polish-pl',
    'female-portuguese-pt',
    'female-russian-ru',
    'female-spanish-es',
    'female-turkish-tr',
    'male-american-en',
    'male-arabic-ar',
    'male-british-en',
    'male-chinese-cn',
    'male-dutch-nl',
    'male-french-fr',
    'male-german-de',
    'male-indian-en',
    'male-indian-hn',
    'male-italian-it',
    'male-japanese-jp',
    'male-korean-ko',
    'male-polish-pl',
    'male-portuguese-pt',
    'male-russian-ru',
    'male-spanish-es',
    'male-turkish-tr',
  ];
  // Add this validation function
  const checkIfVoiceExists = (gender: string, accent: string, language: string) => {
    return availableVoiceFiles.includes(`${gender}-${accent}-${language}`);
  };
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

  // Update your getAudioPath function:
  const getAudioPath = useCallback((gender: string, accent: string, language: string) => {
    if (!gender || !accent || !language) return null;
    
    // Use absolute URL with explicit path to voices directory
    return `${window.location.origin}/voices/${gender}-${accent}-${language}.mp3`;
  }, []);

  const handleGenderChange = (value: string) => {
    setFormData(prev => {
      const newData = { ...prev, gender: value };

      if (newData.gender && selectedLanguageOption) {
        loadAudio(newData.gender, selectedLanguageOption.accent, selectedLanguageOption.language);
      }

      return newData;
    });
  };

  const handleToneChange = (value: string) => {
    setFormData(prev => ({ ...prev, tone: value }));
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
          // Check if this combination exists before attempting to load
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
  
    // Use absolute path for audio file
    const audioPath = `${window.location.origin}/voices/${gender}-${accent}-${language}.mp3`;
    console.log('Full audio URL:', audioPath);
    
    try {
      // Use the ref to access the audio element
      if (!audioRef.current) {
        console.error('Audio element reference not available');
        throw new Error('Audio element not available');
      }
  
      // Create a variable to track if we've canceled the operation
      let isCanceled = false;
      
      // Set up event listeners for tracking loading state
      const onCanPlay = () => {
        if (isCanceled) return;
        
        console.log('Audio can play now');
        setIsAudioLoading(false);
        setAudioError(false);
        setAudio(audioRef.current);
        
        // Remove event listeners
        audioRef.current?.removeEventListener('canplaythrough', onCanPlay);
        audioRef.current?.removeEventListener('error', onError);
      };
  
      const onError = (e: Event) => {
        if (isCanceled) return;
        
        console.error('Audio error details:', {
          src: audioRef.current?.src,
          error: e,
          networkState: audioRef.current?.networkState,
          readyState: audioRef.current?.readyState
        });
        
        setAudioError(true);
        setIsAudioLoading(false);
        
        // Remove event listeners
        audioRef.current?.removeEventListener('canplaythrough', onCanPlay);
        audioRef.current?.removeEventListener('error', onError);
        
        toast({
          title: "Audio Load Error",
          description: "Could not load the voice sample. Please try a different selection.",
          variant: "destructive",
        });
      };
  
      // Clear previous event listeners if any
      audioRef.current.removeEventListener('canplaythrough', onCanPlay);
      audioRef.current.removeEventListener('error', onError);
      
      // Add new event listeners
      audioRef.current.addEventListener('canplaythrough', onCanPlay);
      audioRef.current.addEventListener('error', onError);
      
      // Set source and load audio
      audioRef.current.src = audioPath;
      audioRef.current.load(); // Important!
      
      // Set a safety timeout
      const timeoutId = setTimeout(() => {
        if (isAudioLoading && !isCanceled) {
          isCanceled = true;
          setIsAudioLoading(false);
          setAudioError(true);
          
          // Remove event listeners
          audioRef.current?.removeEventListener('canplaythrough', onCanPlay);
          audioRef.current?.removeEventListener('error', onError);
          
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
        audioRef.current?.removeEventListener('canplaythrough', onCanPlay);
        audioRef.current?.removeEventListener('error', onError);
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
  }, [isAudioLoading, setIsAudioLoading, setAudioError, setAudio, checkIfVoiceExists, toast]);
  
  useEffect(() => {
    let cleanupFn: (() => void) | undefined;
    
    if (formData.gender && selectedLanguageOption) {
      const result = loadAudio(formData.gender, selectedLanguageOption.accent, selectedLanguageOption.language);
      // Only assign the cleanup if it's actually a function
      if (typeof result === 'function') {
        cleanupFn = result;
      }
    }
  
    return () => {
      // Only call the cleanup if it's a function
      if (typeof cleanupFn === 'function') {
        cleanupFn();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [formData.gender, selectedLanguageOption, loadAudio]);

  const handlePlayAudio = () => {
    if (!audioRef.current) return;
  
    if (audioRef.current.paused) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        toast({
          title: "Playback Error",
          description: "Could not play the voice sample. Please try again.",
          variant: "destructive",
        });
      });
    } else {
      audioRef.current.pause();
    }
  }

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

      // Get the selected language option to submit the proper accent and language code
      const selectedLang = languageOptions.find(opt => opt.value === formData.language);
      
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
          accent: selectedLang?.accent || '',
          languageCode: selectedLang?.language || '',
          roleDescription: formData.roleDescription,
          businessContext: formData.businessContext,
        },
        advanced_settings: formData.advanced_settings,
        files: fileUrls || [],
      };

      console.log("AGENT DATA", agentData);
      console.log("COMPANY ID", company);

      await Promise.all([
        createAdminAgent(agentData, company?.id as string, user.id),
      ]);

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
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      const onEnded = () => setIsPlaying(false);
      
      audioRef.current.addEventListener('play', onPlay);
      audioRef.current.addEventListener('pause', onPause);
      audioRef.current.addEventListener('ended', onEnded);
      
      return () => {
        audioRef.current?.removeEventListener('play', onPlay);
        audioRef.current?.removeEventListener('pause', onPause);
        audioRef.current?.removeEventListener('ended', onEnded);
      };
    }
  }, [audioRef.current]);
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
        
        // If we have saved language data, find the matching option
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
          {/* Hidden audio element */}
    <audio 
      ref={audioRef}
      style={{ display: "none" }}
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
                          className={`w-6 h-6 text-white`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        <Play className={`w-6 h-6 text-white`} />
                      )
                    )}
                  </button>

                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600 ml-1">
                        Gender*
                      </label>
                      <Select value={formData.gender} onValueChange={handleGenderChange}>
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {genderOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600 ml-1">
                        Tone*
                      </label>
                      <Select value={formData.tone} onValueChange={handleToneChange}>
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
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>American</SelectLabel>
                            {languageOptions.filter(opt => opt.accent === 'american').map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Indian</SelectLabel>
                            {languageOptions.filter(opt => opt.accent === 'indian').map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>British</SelectLabel>
                            {languageOptions.filter(opt => opt.accent === 'british').map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Other Languages</SelectLabel>
                            {languageOptions.filter(opt => 
                              !['american', 'indian', 'british'].includes(opt.accent)
                            ).map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {audioError && (
                  <div className="text-xs text-amber-600 mt-2">
                    This voice combination is not available. Please try a different selection.
                  </div>
                )}
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
                    accept='application/pdf'
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
                        <Input value={formData.advanced_settings.authUrl}
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