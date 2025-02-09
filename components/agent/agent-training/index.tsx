"use client";

import React, { useEffect, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { toast } from '@/hooks/use-toast';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';
import { AgentFormData } from '@/types';
import { createAgent } from '@/services/agent-service';
import { Input } from '@/components/ui/input';

interface AdvancedSettings {
    authUrl: string;
    clientId: string;
    clientSecret: string;
    apis: string[];
}

interface FormData {
    roleDescription: string;
    businessContext: string;
    advanced_settings: AdvancedSettings;
    files: string[];
}

const AgentTraining = () => {
    const router = useRouter();
    const { user } = useCurrentUser();
    const { token } = useIsAuthenticated();
    const [formData, setFormData] = useState<FormData>({
        roleDescription: '',
        businessContext: '',
        advanced_settings: {
            authUrl: '',
            clientId: '',
            clientSecret: '',
            apis: []
        },
        files: [] as string[],
    });
    const [setupData, setSetupData] = useState<any>(null);
    const [files, setFiles] = useState<File[]>([]);

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

    const handleRoleDescriptionChange = (value: string) => {
        setFormData(prev => ({ ...prev, roleDescription: value }));
    };

    const handleBusinessContextChange = (value: string) => {
        setFormData(prev => ({ ...prev, businessContext: value }));
    };

    const handleAdvancedSettingsChange = (value: AdvancedSettings) => {
        setFormData(prev => ({ ...prev, advanced_settings: value }));
    };

    const handleApiUrlChange = (value: string) => {
        value = value.trim();
        setFormData(prev => ({ ...prev, advanced_settings: { ...prev.advanced_settings, apis: value.split(',') } }));
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

            toast({
                title: "Success",
                description: "Files uploaded successfully!",
            });
        } catch (error) {
            throw error;
        }
    };


    useEffect(() => {
        const savedData = sessionStorage.getItem('agentSetupData');
        if (savedData) {
            setSetupData(JSON.parse(savedData));
        } else {
            router.push('/agent/creation');
        }
    }, [router]);

    const handleSubmit = async () => {
        try {
            if (!user) {
                toast({
                    title: "Error",
                    description: "You must be logged in to create an agent.",
                    variant: "destructive",
                });
                return;
            }

            if (!setupData) {
                toast({
                    title: "Error",
                    description: "Missing setup data. Please complete the setup first.",
                    variant: "destructive",
                });
                return;
            }

            if (!token) {
                toast({
                    title: "Error",
                    description: "Please login to create an agent.",
                    variant: "destructive",
                });
                return;
            }

            if (!formData.roleDescription || !formData.businessContext) {
                toast({
                    title: "Error",
                    description: "Please fill in all the required fields.",
                    variant: "destructive",
                });
                return;
            }

            if (files && files.length > 0) {
                await uploadFiles(files);
            }

            if (!formData.files || formData.files.length === 0) {
                toast({
                    title: "Error",
                    description: "Please upload at least one file.",
                    variant: "destructive",
                });
                return;
            }

            const agentData: AgentFormData = {
                user_id: user.id,
                name: setupData.name,
                type: 'custom',
                prompt: formData.roleDescription,
                is_active: true,
                additional_context: {
                    gender: setupData.gender,
                    tone: setupData.tone,
                    language: setupData.language,
                    roleDescription: formData.roleDescription,
                    businessContext: formData.businessContext,
                },
                advanced_settings: formData.advanced_settings,
                files: formData.files,
            };

            await createAgent(agentData, token);

            toast({
                title: "Success",
                description: "Agent created successfully!",
            });

            sessionStorage.removeItem('agentSetupData');

            router.push('/dashboard');
        } catch (error: any) {
            toast({
                title: "Error",
                description: error && error.message ? error.message : "Failed to create agent. Please try again.",
                variant: "destructive",
            });
        }
    };
    return (
        <div className="w-full p-6 flex items-center justify-center">
            <Card className="w-full max-w-2xl bg-white shadow-xl rounded-xl">
                <CardHeader className="border-b border-gray-100 pb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Let&apos;s train your agent
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Provide information about your business and upload relevant documents
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-8 p-6">
                    {/* Text Input Sections */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                1. Give me a brief about the job Role of your Agent*
                            </label>
                            <Textarea
                                onChange={(e) => handleRoleDescriptionChange(e.target.value)}
                                placeholder="Describe the agent's role and responsibilities..."
                                className="min-h-[100px] resize-none border-gray-200 focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                2. Give a brief about your Business for which this agent is being created*
                            </label>
                            <Textarea
                                onChange={(e) => handleBusinessContextChange(e.target.value)}
                                placeholder="Tell us about your business context..."
                                className="min-h-[100px] resize-none border-gray-200 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Document Upload Section */}
                    <div className="space-y-4">
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

                        {/* Upload Area */}
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

                    <Collapsible>
                        <CollapsibleTrigger className="text-sm flex items-center font-medium text-gray-700 mb-2">
                            Advanced Settings
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
                        <CollapsibleContent className="bg-gray-50 p-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-5 h-5 text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        To enable seamless integration, Provide the following details:
                                    </h3>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-xl space-y-6" id="api-settings">
                                    <Input
                                        onChange={(e) => handleAdvancedSettingsChange({ ...formData.advanced_settings, authUrl: e.target.value })}
                                        placeholder="Enter your authentication URL"
                                        className="w-full border-gray-200 focus:border-blue-500 h-12 text-lg"
                                    />

                                    <Input
                                        onChange={(e) => handleAdvancedSettingsChange({ ...formData.advanced_settings, clientId: e.target.value })}
                                        placeholder="Enter your client ID"
                                        className="w-full border-gray-200 focus:border-blue-500 h-12 text-lg"
                                    />

                                    <Input
                                        onChange={(e) => handleAdvancedSettingsChange({ ...formData.advanced_settings, clientSecret: e.target.value })}
                                        placeholder="Enter your client secret"
                                        className="w-full border-gray-200 focus:border-blue-500 h-12 text-lg"
                                    />

                                    <Textarea
                                        onChange={(e) => handleApiUrlChange(e.target.value)}
                                        placeholder="Enter list of APIs separated by comma"
                                        className="w-full border-gray-200 focus:border-blue-500 h-12 text-lg"
                                    />
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Submit Button */}
                    <div className="flex justify-between pt-4">
                        <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 h-auto text-lg font-medium rounded-xl">
                            Back
                        </Button>
                        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 h-auto text-lg font-medium rounded-xl">
                            Submit
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AgentTraining;