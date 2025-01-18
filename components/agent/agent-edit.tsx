"use client";

import { memo, useRef, useState } from "react";
import { PlayCircle, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@/components/ui/select";

import { AgentFormData } from "@/types";

import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";

import { updateAgent } from "@/services/agent-service";

import { toast } from "@/hooks/use-toast";
import { useIsAuthenticated } from "@/hooks/use-is-authenticated";
interface EditAgentData {
    name: string;
    gender: string;
    tone: string;
    language: string;
    roleDescription: string;
    businessContext: string;
    is_active: boolean;
}

export const AgentEdit = memo(({ name, additional_context, is_active, id }: AgentFormData) => {
    const [formData, setFormData] = useState<EditAgentData>({
        name: name ?? '',
        gender: additional_context?.gender ?? '',
        tone: additional_context?.tone ?? '',
        language: additional_context?.language ?? '',
        roleDescription: additional_context?.roleDescription ?? '',
        businessContext: additional_context?.businessContext ?? '',
        is_active: is_active ?? false
    });
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [audioError, setAudioError] = useState(false);
    const { token } = useIsAuthenticated();

    const buttonRef = useRef<HTMLButtonElement>(null);

    const router = useRouter();

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getAudioPath = (gender: string, tone: string, language: string) => {
        if (!gender || !tone || !language) return null;
        return `/voices/${gender}-${tone}-${language}.mp3`;
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

    const handleSelectionChange = (type: 'gender' | 'tone' | 'language', value: string) => {
        setFormData(prev => {
            const newData = { ...prev, [type]: value };

            if (newData.gender && newData.tone && newData.language) {
                loadAudio(newData.gender, newData.tone, newData.language);
            }

            return newData;
        });
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

            const data = {
                name: formData.name,
                additional_context: {
                    gender: formData.gender,
                    tone: formData.tone,
                    language: formData.language,
                    roleDescription: formData.roleDescription,
                    businessContext: formData.businessContext,
                },
                is_active: formData.is_active
            }

            await updateAgent(id, data, token);

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

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button ref={buttonRef} className="text-white flex justify-center items-center bg-[#0A1E4E] hover:bg-[#0A1E4E] text-sm font-medium rounded-md px-2 py-1.5 text-center">
                    <PlusCircleIcon className="w-4 h-4 mr-2" />
                    Edit
                </button>
            </DialogTrigger>
            <DialogContent className="p-6">
                <DialogHeader>
                    <DialogTitle>Edit Agent</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Agent Name
                        </label>
                        <Input
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Enter your agent's name"
                            className="w-full border-gray-200 focus:border-blue-500 h-12 text-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            1. Give me a brief about the job Role of your Agent*
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
                            2. Give a brief about your Business for which this agent is being created*
                        </label>
                        <Textarea
                            value={formData.businessContext}
                            onChange={(e) => handleChange('businessContext', e.target.value)}
                            placeholder="Tell us about your business context..."
                            className="min-h-[100px] resize-none border-gray-200 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <Switch className="" checked={formData.is_active} onCheckedChange={(value) => handleChange('is_active', value)} />
                    </div>

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
                            <div className="flex justify-between items-center gap-4">
                                <button
                                    onClick={handlePlayAudio}
                                    className={`w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center transition-colors 
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

                                <div className="flex justify-between flex-wrap gap-2">
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
                        <button onClick={handleSave} className="bg-[#0A1E4E] text-white px-8 py-2 h-auto text-lg font-medium rounded-xl">
                            Save
                        </button>
                    </div>
                </div>
            </DialogContent>

        </Dialog>
    )
});

AgentEdit.displayName = "AgentEdit";