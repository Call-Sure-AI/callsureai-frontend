// components\agent\agent-edit.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, X, User2, Play, CircleX, Settings } from "lucide-react";

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

interface EditAgentData {
    name: string;
    gender: string;
    tone: string;
    language: string;
    roleDescription: string;
    businessContext: string;
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

export const AgentEdit = React.memo(({ name, additional_context, is_active, id, files, advanced_settings }: AgentFormData) => {
    const [formData, setFormData] = useState<EditAgentData>({
        name: name ?? '',
        gender: additional_context?.gender ?? '',
        tone: additional_context?.tone ?? '',
        language: additional_context?.language ?? '',
        roleDescription: additional_context?.roleDescription ?? '',
        businessContext: additional_context?.businessContext ?? '',
        is_active: is_active ?? false,
        confidence_threshold: 0.7, // Add this line with a default value
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

    // Fixed loadAudio function - without tone in path
    const loadAudio = useCallback(async (gender: string, languageCode: string) => {
        setIsAudioLoading(true);
        setAudioError(false);

        // Build path without tone (e.g., /voices/male-american-en.mp3)
        const audioPath = `/voices/${gender}-${languageCode}.mp3`;
        console.log(`Loading audio: ${audioPath}`);

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
        } catch (e: any) {
            setAudioError(true);
            console.error('Error loading audio:', e);
            toast({
                title: "Audio Load Error",
                description: "Could not load the voice sample. Please check if the file exists.",
                variant: "destructive",
            });
        } finally {
            setIsAudioLoading(false);
        }
    }, []);

    const handleSelectionChange = (type: 'gender' | 'tone' | 'language', value: string) => {
        setFormData(prev => {
            const newData = { ...prev, [type]: value };

            // Load audio when we have both gender and language
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
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
                toast({
                    title: "Playback Error",
                    description: "Could not play the voice sample. Please try again.",
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

            toast({
                title: "Success",
                description: "Files uploaded successfully!",
            });

            return uploadedUrls;
        } catch (error) {
            throw error;
        }
    };

    const handleSave = async () => {
        try {
            if (!id) {
                toast({
                    title: "Error",
                    description: "Not a valid agent ID. Please try again.",
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

        } catch (error) {
            console.error('Error saving agent:', error);
            toast({
                title: "Error",
                description: "Failed to save the agent. Please try again.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        setIsMounted(true);

        // Initialize language option from existing data
        if (formData.language) {
            const langOption = languageOptions.find(opt => opt.value === formData.language);
            if (langOption) {
                setSelectedLanguageOption({
                    accent: langOption.accent,
                    language: langOption.language
                });

                // Load audio with the correct format
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
    }, []); // Run only once on mount

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

    // Safely get API values for textarea
    const getApiTextValue = () => {
        return Array.isArray(formData.advanced_settings.apis)
            ? formData.advanced_settings.apis.join(',')
            : '';
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" ref={buttonRef} variant="primary" className="text-[#0A1E4E] flex justify-center items-center bg-[#0A1E4E]/10 hover:bg-[#0A1E4E]/20 transition-colors duration-200">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Agent Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-scroll p-0 
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-[#0A1E4E]/10
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-[#0A1E4E]/20
            transition-colors
            duration-200
            ease-in-out">
                <DialogHeader className="sticky top-0 z-10 bg-white p-6 border-b border-gray-100">
                    <DialogTitle className="text-2xl font-semibold">Edit Agent</DialogTitle>
                    <CircleX className="absolute top-3 right-3 cursor-pointer" onClick={() => buttonRef.current?.click()} />
                </DialogHeader>
                <div className="overflow-y-auto max-h-[calc(90vh-130px)] p-0 
                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-[#0A1E4E]/10
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    hover:[&::-webkit-scrollbar-thumb]:bg-[#0A1E4E]/20
                    transition-colors
                    duration-200
                    ease-in-out"
                >
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
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="Enter your agent's name"
                                        className="w-full border-gray-200 focus:border-blue-500 h-12 text-lg"
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm mt-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <Switch
                                        checked={formData.is_active}
                                        onCheckedChange={(value) => handleChange('is_active', value)}
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
                                        className={`w-12 h-12 rounded-full ${audioError ? "bg-red-500" : "bg-black"} shadow-sm flex items-center justify-center transition-colors 
                                    ${isAudioLoading ? 'cursor-wait' : ''} 
                                    ${!audio || isAudioLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/80'}`
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
                                        onChange={(e) => handleChange('roleDescription', e.target.value)}
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
                                        onChange={(e) => handleChange('businessContext', e.target.value)}
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
                                    {/* Existing Files */}
                                    {existingFiles.length > 0 && (
                                        <div className="mt-4 w-full">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Current files:</p>
                                            <ul className="space-y-1">
                                                {existingFiles.map((fileUrl, index) => {
                                                    const fileName = fileUrl.split('/').pop() || `File ${index + 1}`;
                                                    return (
                                                        <div key={`existing-${fileUrl}`} className="flex items-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                className="flex-1 flex items-center gap-2 h-auto py-2 px-4 border-dashed border-2"
                                                            >
                                                                <Upload className="w-4 h-4" />
                                                                {fileName}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => handleDeleteExistingFile(fileUrl)}
                                                                className="p-2 hover:bg-red-100 hover:text-red-600"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}

                                    {/* New Files */}
                                    {uploadedFiles.length > 0 && (
                                        <div className="mt-4 w-full">
                                            <p className="text-sm font-medium text-gray-700 mb-2">New files to upload:</p>
                                            <ul className="space-y-1">
                                                {uploadedFiles.map((file, index) => (
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
                                                    onChange={(e) => handleAdvancedSettingsChange({
                                                        ...formData.advanced_settings,
                                                        authUrl: e.target.value
                                                    })}
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
                                                    onChange={(e) => handleAdvancedSettingsChange({
                                                        ...formData.advanced_settings,
                                                        clientId: e.target.value
                                                    })}
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
                                                    onChange={(e) => handleAdvancedSettingsChange({
                                                        ...formData.advanced_settings,
                                                        clientSecret: e.target.value
                                                    })}
                                                    placeholder="Enter your client secret"
                                                    className="w-full border-gray-200 focus:border-blue-500 h-12"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    API Endpoints
                                                </label>
                                                <Textarea
                                                    value={getApiTextValue()}
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
                </div>

                {/* Fixed submit button at bottom */}
                <div className="border-t border-gray-100 p-6 sticky bottom-0 bg-white flex justify-end">
                    <Button
                        onClick={handleSave}
                        className="bg-[#0A1E4E] hover:bg-[#0A1E4E]/90 text-white px-8 py-2 h-auto text-lg font-medium rounded-xl"
                    >
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
});

AgentEdit.displayName = "AgentEdit";