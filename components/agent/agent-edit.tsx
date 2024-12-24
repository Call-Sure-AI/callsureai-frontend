"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlayCircle, PlusCircleIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@/components/ui/select";
import { getAgentById } from "@/services/agent-service";
import { useIsAuthenticated } from "@/hooks/use-is-authenticated";
interface EditAgentData {
    name: string;
    gender: string;
    tone: string;
    language: string;
}

export const AgentEdit = ({ agentId }: { agentId: string }) => {
    const { token } = useIsAuthenticated();
    const [formData, setFormData] = useState<EditAgentData>({
        name: '',
        gender: '',
        tone: '',
        language: ''
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

    if (!token) {
        return <div>Loading...</div>;
    }

    const fetchAgentData = async () => {
        try {
            const response = await getAgentById(agentId, token);
            console.log(response);
            setFormData({
                name: response.name,
                gender: response.additional_context.gender,
                tone: response.additional_context.tone,
                language: response.additional_context.language,
            });
        } catch (error) {
            console.error('Error fetching agent data:', error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button onClick={fetchAgentData} className="text-white flex justify-center items-center bg-[#0A1E4E] hover:bg-[#0A1E4E] text-sm font-medium rounded-md px-2 py-1.5 text-center">
                    <PlusCircleIcon className="w-4 h-4 mr-2" />
                    Edit
                </button>
            </DialogTrigger>
            <DialogContent className="p-6">
                <DialogHeader>
                    <DialogTitle>Edit Agent</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Agent Name
                            </label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="Enter your agent's name"
                                className="w-full border-gray-200 focus:border-blue-500 h-12 text-lg"
                            />
                        </div>
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
                            <div className="flex justify-center items-center gap-4">
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
                        <button className="bg-[#0A1E4E] text-white px-8 py-2 h-auto text-lg font-medium rounded-xl">
                            Save
                        </button>
                    </div>
                </div>
            </DialogContent>

        </Dialog>
    )
};