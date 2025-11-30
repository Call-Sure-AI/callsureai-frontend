"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, X, User2, Play, Pause, CircleX, Settings, Mic, FileText, Loader2, ChevronDown, Headphones, TrendingUp, BookOpen, CalendarDays, Users, Phone, CalendarCheck, ClipboardList, Heart, Shield, Bell, PhoneCall, HelpCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '../ui/switch';
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
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';
import { updateAgent } from '@/services/agent-service';
import { useAgents } from '@/contexts/agent-context';
import { useActivities } from '@/contexts/activity-context';
import { AgentFormData } from "@/types";
import { languageOptions, toneOptions } from '@/constants';

// Use Case Options (same as in agent-creation)
const useCaseOptions = [
    { id: 'customer_support', label: 'Customer Support', icon: Headphones },
    { id: 'outbound_sales', label: 'Outbound Sales', icon: TrendingUp },
    { id: 'learning_development', label: 'Learning & Development', icon: BookOpen },
    { id: 'scheduling', label: 'Scheduling', icon: CalendarDays },
    { id: 'lead_qualification', label: 'Lead Qualification', icon: Users },
    { id: 'answering_service', label: 'Answering Service', icon: Phone },
    { id: 'appointment_scheduling', label: 'Appointment Scheduling', icon: CalendarCheck },
    { id: 'patient_intake', label: 'Patient Intake', icon: ClipboardList },
    { id: 'symptom_guidance', label: 'Symptom Guidance', icon: Heart },
    { id: 'insurance_verification', label: 'Insurance Verification', icon: Shield },
    { id: 'prescription_reminders', label: 'Prescription Reminders', icon: Bell },
    { id: 'telehealth_support', label: 'Telehealth Support', icon: PhoneCall },
    { id: 'other', label: 'Other', icon: HelpCircle },
];

interface EditAgentData {
    name: string;
    gender: string;
    tone: string;
    language: string;
    roleDescription: string;
    businessContext: string;
    useCase: string;
    is_active: boolean;
    confidence_threshold: number;
    advanced_settings: {
        authUrl: string;
        clientId: string;
        clientSecret: string;
        apis: string[];
    };
    files: string[];
}

// Section Header Component
const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    </div>
);

// Use Case Mini Card for Edit Modal
const UseCaseMiniCard = ({ 
    useCase, 
    isSelected, 
    onClick 
}: { 
    useCase: typeof useCaseOptions[0]; 
    isSelected: boolean; 
    onClick: () => void;
}) => {
    const Icon = useCase.icon;
    
    return (
        <button
            type="button"
            onClick={onClick}
            className={`p-3 rounded-xl border-2 transition-all text-left ${
                isSelected
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10'
                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cyan-300 dark:hover:border-cyan-500/50'
            }`}
        >
            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-cyan-500' : 'bg-gray-100 dark:bg-slate-700'
                }`}>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                </div>
                <span className={`text-xs font-medium ${
                    isSelected ? 'text-cyan-700 dark:text-cyan-400' : 'text-gray-700 dark:text-gray-300'
                }`}>
                    {useCase.label}
                </span>
            </div>
        </button>
    );
};

export const AgentEdit = React.memo(({ name, additional_context, is_active, id, files, advanced_settings }: AgentFormData) => {
    const [formData, setFormData] = useState<EditAgentData>({
        name: name ?? '',
        gender: additional_context?.gender ?? '',
        tone: additional_context?.tone ?? '',
        language: additional_context?.language ?? '',
        roleDescription: additional_context?.roleDescription ?? '',
        businessContext: additional_context?.businessContext ?? '',
        useCase: additional_context?.useCase ?? '',
        is_active: is_active ?? false,
        confidence_threshold: 0.7,
        advanced_settings: {
            authUrl: advanced_settings?.authUrl || '',
            clientId: advanced_settings?.clientId || '',
            clientSecret: advanced_settings?.clientSecret || '',
            apis: Array.isArray(advanced_settings?.apis) ? advanced_settings.apis : []
        },
        files: files ?? []
    });

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [existingFiles, setExistingFiles] = useState<string[]>(files ?? []);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [audioError, setAudioError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [selectedLanguageOption, setSelectedLanguageOption] = useState<{ accent: string, language: string } | null>(null);
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [useCaseOpen, setUseCaseOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { token } = useIsAuthenticated();
    const { refreshAgents } = useAgents();
    const { refreshActivities } = useActivities();

    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleChange = (field: keyof EditAgentData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAdvancedSettingsChange = (value: any) => {
        setFormData(prev => ({ ...prev, advanced_settings: value }));
    };

    const handleApiUrlChange = (value: string) => {
        value = value.trim();
        setFormData(prev => ({
            ...prev,
            advanced_settings: {
                ...prev.advanced_settings,
                apis: value ? value.split(',') : []
            }
        }));
    };

    const handleDeleteFile = (indexToDelete: number) => {
        setUploadedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToDelete));
    };

    const handleDeleteExistingFile = (fileUrl: string) => {
        setExistingFiles(prev => prev.filter(url => url !== fileUrl));
        setFormData(prev => ({
            ...prev,
            files: prev.files.filter(url => url !== fileUrl)
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            const newFiles = Array.from(e.dataTransfer.files);
            setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };

    const loadAudio = useCallback(async (gender: string, languageCode: string) => {
        setIsAudioLoading(true);
        setAudioError(false);

        const audioPath = `/voices/${gender}-${languageCode}.mp3`;
        const newAudio = new Audio(audioPath);

        try {
            await new Promise((resolve, reject) => {
                newAudio.addEventListener('canplaythrough', resolve, { once: true });
                newAudio.addEventListener('error', reject, { once: true });
                setTimeout(() => reject(new Error('Audio load timeout')), 5000);
            });

            newAudio.addEventListener('play', () => setIsPlaying(true));
            newAudio.addEventListener('pause', () => setIsPlaying(false));
            newAudio.addEventListener('ended', () => setIsPlaying(false));

            setAudio(newAudio);
            setAudioError(false);
        } catch {
            setAudioError(true);
            toast({
                title: "Audio Load Error",
                description: "Could not load the voice sample.",
                variant: "destructive",
            });
        } finally {
            setIsAudioLoading(false);
        }
    }, []);

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
                    loadAudio(newData.gender, languageCode);
                }

                return newData;
            });
        }
    };

    const handlePlayAudio = () => {
        if (!audio) return;

        if (audio.paused) {
            audio.play().catch(() => {
                toast({
                    title: "Playback Error",
                    description: "Could not play the voice sample.",
                    variant: "destructive",
                });
            });
        } else {
            audio.pause();
        }
    };

    const uploadFiles = async (files: File[]) => {
        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('enable_public_read_access', 'true');
                formData.append('custom_key', `agent-files/${Date.now()}-${file.name}`);

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/s3/upload`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to upload ${file.name}`);
                }

                const result = await response.json();
                return result.url || result.file_url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);

            setFormData(prev => ({
                ...prev,
                files: [...prev.files, ...uploadedUrls]
            }));

            return uploadedUrls;
        } catch (err) {
            throw err;
        }
    };

    const handleSave = async () => {
        if (isSaving) return;
        
        try {
            setIsSaving(true);
            
            if (!id) {
                toast({
                    title: "Error",
                    description: "Not a valid agent ID.",
                    variant: "destructive",
                });
                return;
            }

            if (!token) {
                toast({
                    title: "Error",
                    description: "Please login to save the agent.",
                    variant: "destructive",
                });
                return;
            }

            let updatedFiles = [...existingFiles];

            if (uploadedFiles.length > 0) {
                const newFiles = await uploadFiles(uploadedFiles);
                updatedFiles = [...updatedFiles, ...newFiles];
            }

            const data = {
                name: formData.name,
                prompt: formData.roleDescription,
                additional_context: {
                    gender: formData.gender,
                    tone: formData.tone,
                    language: formData.language,
                    roleDescription: formData.roleDescription,
                    businessContext: formData.businessContext,
                    useCase: formData.useCase,
                },
                advanced_settings: formData.advanced_settings,
                is_active: formData.is_active,
                files: updatedFiles,
                confidence_threshold: 0.7
            };

            await updateAgent(id, data, token);
            await Promise.all([refreshAgents(), refreshActivities()]);

            toast({
                title: "Success",
                description: "Agent updated successfully!",
            });

            buttonRef.current?.click();

        } catch {
            toast({
                title: "Error",
                description: "Failed to save the agent.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        setIsMounted(true);

        if (formData.language) {
            const langOption = languageOptions.find(opt => opt.value === formData.language);
            if (langOption) {
                setSelectedLanguageOption({
                    accent: langOption.accent,
                    language: langOption.language
                });

                if (formData.gender) {
                    const languageCode = `${langOption.accent}-${langOption.language}`;
                    loadAudio(formData.gender, languageCode);
                }
            }
        }

        return () => {
            if (audio) {
                audio.pause();
                audio.src = '';
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (formData.gender && selectedLanguageOption) {
            const languageCode = `${selectedLanguageOption.accent}-${selectedLanguageOption.language}`;
            loadAudio(formData.gender, languageCode);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.gender, selectedLanguageOption, loadAudio]);

    if (!isMounted) {
        return null;
    }

    const getApiTextValue = () => {
        return Array.isArray(formData.advanced_settings.apis)
            ? formData.advanced_settings.apis.join(',')
            : '';
    };

    const selectedUseCase = useCaseOptions.find(u => u.id === formData.useCase);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    size="sm" 
                    ref={buttonRef} 
                    variant="outline"
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-200 rounded-xl"
                >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Settings
                </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden p-0 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 rounded-2xl flex flex-col">
                {/* Header */}
                <DialogHeader className="flex-shrink-0 sticky top-0 z-10 bg-white dark:bg-slate-900 p-6 border-b border-gray-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            Edit Agent
                        </DialogTitle>
                        <button 
                            onClick={() => buttonRef.current?.click()}
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <CircleX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    
                    {/* Agent Profile Section */}
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/50">
                        <SectionHeader icon={User2} title="Agent Profile" />
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Agent Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="Enter agent name"
                                    className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:border-cyan-500 rounded-xl h-12"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Agent Status
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {formData.is_active ? 'Agent is currently online' : 'Agent is currently offline'}
                                    </p>
                                </div>
                                <Switch
                                    checked={formData.is_active}
                                    onCheckedChange={(value) => handleChange('is_active', value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Use Case Section */}
                    <Collapsible open={useCaseOpen} onOpenChange={setUseCaseOpen}>
                        <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50 hover:border-cyan-500/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Use Case</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {selectedUseCase ? selectedUseCase.label : 'Not selected'}
                                        </p>
                                    </div>
                                </div>
                                <motion.div animate={{ rotate: useCaseOpen ? 180 : 0 }}>
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                </motion.div>
                            </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50"
                            >
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {useCaseOptions.map((useCase) => (
                                        <UseCaseMiniCard
                                            key={useCase.id}
                                            useCase={useCase}
                                            isSelected={formData.useCase === useCase.id}
                                            onClick={() => handleChange('useCase', useCase.id)}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Voice Customization Section */}
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/50">
                        <SectionHeader icon={Mic} title="Voice Customization" />
                        
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                            {/* Play Button */}
                            <motion.button
                                onClick={handlePlayAudio}
                                disabled={!audio || isAudioLoading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all shadow-lg ${
                                    audioError 
                                        ? "bg-red-500 shadow-red-500/30" 
                                        : "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30"
                                } ${!audio || isAudioLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isAudioLoading ? (
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                ) : isPlaying ? (
                                    <Pause className="w-6 h-6 text-white" />
                                ) : (
                                    <Play className="w-6 h-6 text-white ml-1" />
                                )}
                            </motion.button>

                            <div className="flex flex-wrap gap-3 flex-1">
                                <div className="space-y-1.5 min-w-[130px]">
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Gender</label>
                                    <Select value={formData.gender} onValueChange={(value) => handleSelectionChange('gender', value)}>
                                        <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5 min-w-[130px]">
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Tone</label>
                                    <Select value={formData.tone} onValueChange={(value) => handleSelectionChange('tone', value)}>
                                        <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl">
                                            <SelectValue placeholder="Select" />
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

                                <div className="space-y-1.5 min-w-[130px]">
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Language</label>
                                    <Select value={formData.language} onValueChange={handleLanguageChange}>
                                        <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl">
                                            <SelectValue placeholder="Select" />
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
                    </div>

                    {/* Agent Training Section */}
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/50">
                        <SectionHeader icon={FileText} title="Agent Training" />
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Job Role Description
                                </label>
                                <Textarea
                                    value={formData.roleDescription}
                                    onChange={(e) => handleChange('roleDescription', e.target.value)}
                                    placeholder="Describe the agent's role..."
                                    className="min-h-[100px] bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Business Context
                                </label>
                                <Textarea
                                    value={formData.businessContext}
                                    onChange={(e) => handleChange('businessContext', e.target.value)}
                                    placeholder="Describe your business context..."
                                    className="min-h-[100px] bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Document Upload Section */}
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/50">
                        <SectionHeader icon={Upload} title="Training Documents" />
                        
                        {/* Existing Files */}
                        <AnimatePresence>
                            {existingFiles.length > 0 && (
                                <div className="mb-4 space-y-2">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current files:</p>
                                    {existingFiles.map((fileUrl, index) => {
                                        const fileName = fileUrl.split('/').pop() || `File ${index + 1}`;
                                        return (
                                            <motion.div
                                                key={`existing-${fileUrl}`}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl"
                                            >
                                                <FileText className="w-4 h-4 text-cyan-500" />
                                                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">{fileName}</span>
                                                <button
                                                    onClick={() => handleDeleteExistingFile(fileUrl)}
                                                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 text-gray-400 hover:text-red-500"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </AnimatePresence>

                        {/* New Files */}
                        <AnimatePresence>
                            {uploadedFiles.length > 0 && (
                                <div className="mb-4 space-y-2">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New files:</p>
                                    {uploadedFiles.map((file, index) => (
                                        <motion.div
                                            key={`${file.name}-${index}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex items-center gap-3 p-3 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 rounded-xl"
                                        >
                                            <FileText className="w-4 h-4 text-cyan-500" />
                                            <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                                            <button
                                                onClick={() => handleDeleteFile(index)}
                                                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 text-gray-400 hover:text-red-500"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Upload Area */}
                        <div
                            className="border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-cyan-500/50 rounded-xl p-6 cursor-pointer transition-all bg-white/50 dark:bg-slate-800/50"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('editFileInput')?.click()}
                        >
                            <input
                                id="editFileInput"
                                type="file"
                                multiple
                                className="hidden"
                                accept='application/pdf,.docx,.doc,.png,.jpg,.jpeg'
                                onChange={handleFileChange}
                            />
                            <div className="flex flex-col items-center text-center">
                                <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drop files or click to upload</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, DOCX, PNG, JPG</p>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Settings */}
                    <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                        <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50 hover:border-cyan-500/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                                        <Settings className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Settings</h3>
                                </div>
                                <motion.div animate={{ rotate: advancedOpen ? 180 : 0 }}>
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                </motion.div>
                            </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50 space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Authentication URL
                                    </label>
                                    <Input
                                        value={formData.advanced_settings.authUrl}
                                        onChange={(e) => handleAdvancedSettingsChange({ ...formData.advanced_settings, authUrl: e.target.value })}
                                        placeholder="Enter auth URL"
                                        className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl h-11"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Client ID
                                    </label>
                                    <Input
                                        value={formData.advanced_settings.clientId}
                                        onChange={(e) => handleAdvancedSettingsChange({ ...formData.advanced_settings, clientId: e.target.value })}
                                        placeholder="Enter client ID"
                                        className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl h-11"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Client Secret
                                    </label>
                                    <Input
                                        value={formData.advanced_settings.clientSecret}
                                        onChange={(e) => handleAdvancedSettingsChange({ ...formData.advanced_settings, clientSecret: e.target.value })}
                                        placeholder="Enter client secret"
                                        type="password"
                                        className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl h-11"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        API Endpoints
                                    </label>
                                    <Textarea
                                        value={getApiTextValue()}
                                        onChange={(e) => handleApiUrlChange(e.target.value)}
                                        placeholder="Enter APIs separated by comma"
                                        className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl min-h-[80px]"
                                    />
                                </div>
                            </motion.div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>

                {/* Footer - Fixed at bottom */}
                <div className="flex-shrink-0 border-t border-gray-200 dark:border-slate-800 p-5 bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex justify-end gap-3">
                    <Button
                        onClick={() => buttonRef.current?.click()}
                        variant="outline"
                        className="px-6 rounded-xl border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 rounded-xl shadow-lg shadow-cyan-500/25"
                    >
                        {isSaving ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Saving...</span>
                            </div>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
});

AgentEdit.displayName = "AgentEdit";