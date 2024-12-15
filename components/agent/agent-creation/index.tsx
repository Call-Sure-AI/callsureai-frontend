"use client";

import React, { useState, useEffect } from 'react';
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
import { PlayCircle, User2, Wand2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

const AgentSetup = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        tone: '',
        language: '',
    });
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [audioError, setAudioError] = useState(false);

    const handleNameChange = (value: string) => {
        setFormData(prev => ({ ...prev, name: value }));
    };

    const getAudioPath = (gender: string, tone: string, language: string) => {
        if (!gender || !tone || !language) return null;
        return `/voices/${gender}-${tone}-${language}.mp3`;
    };

    // Single function to update audio based on selection changes
    const handleSelectionChange = (type: 'gender' | 'tone' | 'language', value: string) => {
        setFormData(prev => {
            const newData = { ...prev, [type]: value };

            // Only attempt to load audio if all three fields are filled
            if (newData.gender && newData.tone && newData.language) {
                loadAudio(newData.gender, newData.tone, newData.language);
            }

            return newData;
        });
    };

    // Function to load audio
    const loadAudio = async (gender: string, tone: string, language: string) => {
        setIsAudioLoading(true);
        setAudioError(false);

        const audioPath = getAudioPath(gender, tone, language);
        if (!audioPath) return;

        const newAudio = new Audio(audioPath);

        try {
            // Wait for audio to be loaded
            await new Promise((resolve, reject) => {
                newAudio.addEventListener('canplaythrough', resolve, { once: true });
                newAudio.addEventListener('error', reject, { once: true });
                // Timeout after 5 seconds
                setTimeout(() => reject(new Error('Audio load timeout')), 5000);
            });

            setAudio(newAudio);
            setAudioError(false);
        } catch (error) {
            setAudioError(true);
            toast({
                title: "Audio Load Error",
                description: "Could not load the voice sample. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsAudioLoading(false);
        }
    };

    const handlePlayAudio = () => {
        if (!audio) return;

        audio.currentTime = 0;
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
            toast({
                title: "Playback Error",
                description: "Could not play the voice sample. Please try again.",
                variant: "destructive",
            });
        });
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

        sessionStorage.setItem('agentSetupData', JSON.stringify(formData));
        router.push('/agent/training');
    };

    return (
        <div className="min-h-screen p-6 flex items-center justify-center">
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
                                    className={`w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center transition-colors 
                                        ${isAudioLoading ? 'cursor-wait' : ''} 
                                        ${!audio || isAudioLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}`
                                    }
                                    disabled={!audio || isAudioLoading}
                                >
                                    {isAudioLoading ? (
                                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <PlayCircle className={`w-8 h-8 ${audioError ? 'text-red-600' : 'text-blue-600'}`} />
                                    )}
                                </button>

                                <div className="flex flex-wrap gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-600 ml-1">
                                            Gender
                                        </label>
                                        <Select onValueChange={(value) => handleSelectionChange('gender', value)}>
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
                                        <Select onValueChange={(value) => handleSelectionChange('tone', value)}>
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
                                        <Select onValueChange={(value) => handleSelectionChange('language', value)}>
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
                        <Link href="/agent/training">
                            <Button
                                onClick={handleNext}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 h-auto text-lg font-medium rounded-xl">
                                Next
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AgentSetup;