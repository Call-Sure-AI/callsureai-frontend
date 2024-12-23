"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { AgentFormData } from '@/types';
import { createAgent } from '@/services/agent-service';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';

const AgentTraining = () => {
    const router = useRouter();
    const { user } = useCurrentUser();
    const { token } = useIsAuthenticated();
    const [formData, setFormData] = useState({
        roleDescription: '',
        businessContext: '',
        files: [] as string[],
    });
    const [setupData, setSetupData] = useState<any>(null);

    const handleRoleDescriptionChange = (value: string) => {
        setFormData(prev => ({ ...prev, roleDescription: value }));
    };

    const handleBusinessContextChange = (value: string) => {
        setFormData(prev => ({ ...prev, businessContext: value }));
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

            const agentData: AgentFormData = {
                user_id: user.id,
                name: setupData.name,
                type: 'custom',
                prompt: formData.roleDescription,
                additional_context: {
                    gender: setupData.gender,
                    tone: setupData.tone,
                    language: setupData.language,
                    roleDescription: formData.roleDescription,
                    businessContext: formData.businessContext,
                },
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
        <div className="min-h-screen p-6 flex items-center justify-center">
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
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 h-auto py-2 px-4 border-dashed border-2"
                            >
                                <Upload className="w-4 h-4" />
                                Upload File 1
                            </Button>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 h-auto py-2 px-4 border-dashed border-2"
                            >
                                <Upload className="w-4 h-4" />
                                Upload File 2
                            </Button>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 h-auto py-2 px-4 border-dashed border-2"
                            >
                                <Upload className="w-4 h-4" />
                                Upload File 3
                            </Button>
                        </div>

                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 bg-gray-50">
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