"use client";

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';

const AgentTraining = () => {
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
                                placeholder="Describe the agent's role and responsibilities..."
                                className="min-h-[100px] resize-none border-gray-200 focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                2. Give a brief about your Business for which this agent is being created*
                            </label>
                            <Textarea
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
                    <div className="flex justify-end pt-4">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 h-auto text-lg font-medium rounded-xl">
                            Submit
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AgentTraining;