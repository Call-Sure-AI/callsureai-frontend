"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Play, User2, Wand2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FormData {
    name: string;
    gender: string;
    tone: string;
    language: string;
}

const initialFormData: FormData = {
    name: '',
    gender: '',
    tone: '',
    language: ''
};

const AgentSetup = () => {
    const router = useRouter();
    const [formData, setFormData] = useState(initialFormData);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [audioError, setAudioError] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleNameChange = (value: string) => {
        setFormData(prev => ({ ...prev, name: value }));
    };

    const getAudioPath = (gender: string, tone: string, language: string) => {
        if (!gender || !tone || !language) return null;
        return `/voices/${gender}-${tone}-${language}.mp3`;
    };

    const handleSelectionChange = (type: 'gender' | 'tone' | 'language', value: string) => {
        setFormData(prev => {
            const newData = { ...prev, [type]: value };

            if (newData.gender && newData.tone && newData.language) {
                loadAudio(newData.gender, newData.tone, newData.language);
            }

            return newData;
        });
    };

    const loadAudio = async (gender: string, tone: string, language: string) => {
        setIsAudioLoading(true);
        setAudioError(false);

        const audioPath = getAudioPath(gender, tone, language);
        if (!audioPath) return;

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
            toast({
                title: "Audio Load Error",
                description: e && e.message ? e.message : "Could not load the voice sample. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsAudioLoading(false);
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

    const handleNext = () => {
        if (!formData.name || !formData.gender || !formData.tone || !formData.language) {
            toast({
                title: "Missing Information",
                description: "Please fill in all fields before proceeding.",
                variant: "destructive",
            });
            return;
        }

        window.sessionStorage.setItem('agentSetupData', JSON.stringify(formData));
        router.push('/agent/training');
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            try {
                const savedData = window.sessionStorage.getItem('agentSetupData');
                if (savedData) {
                    const data = JSON.parse(savedData);
                    setFormData({
                        name: data.name || '',
                        gender: data.gender || '',
                        tone: data.tone || '',
                        language: data.language || ''
                    });
                    if (data.gender && data.tone && data.language) {
                        loadAudio(data.gender, data.tone, data.language);
                    }
                }
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }, [isMounted, loadAudio]);

    useEffect(() => {
        return () => {
            if (audio) {
                audio.pause();
                audio.src = '';
            }
        };
    }, [audio]);

    if (!isMounted) {
        // TODO: Add loading state
        return null;
    }

    return (
        <div className="w-full p-6 flex items-center justify-center">
            <Card className="w-full max-w-2xl bg-white shadow-xl rounded-xl">
                <CardHeader className="border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Wand2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Set up your agent
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Customize your AI assistant&apos;s profile and preferences
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-8 p-6">
                    {/* Agent Profile Section */}
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
                                    Agent Name
                                </label>
                                <Input
                                    placeholder="Enter your agent's name"
                                    className="w-full border-gray-200 focus:border-blue-500 h-12 text-lg"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Customization Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-5 h-5 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                                Customize your Agent
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
                                            Gender
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
                                            Tone
                                        </label>
                                        <Select value={formData.tone} onValueChange={(value) => handleSelectionChange('tone', value)}>
                                            <SelectTrigger className="w-36">
                                                <SelectValue placeholder="Select tone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="american">American</SelectItem>
                                                <SelectItem value="indian">Indian</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-600 ml-1">
                                            Language
                                        </label>
                                        <Select value={formData.language} onValueChange={(value) => handleSelectionChange('language', value)}>
                                            <SelectTrigger className="w-36">
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="hn">Hindi</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleNext}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 h-auto text-lg font-medium rounded-xl">
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AgentSetup;