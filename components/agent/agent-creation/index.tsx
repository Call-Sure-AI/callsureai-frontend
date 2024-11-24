"use client";

import React from 'react';
import Link from 'next/link';

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

const AgentSetup = () => {
    return (
        <div className="min-h-screen  p-6 flex items-center justify-center">
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
                                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-blue-50 transition-colors cursor-pointer">
                                    <PlayCircle className="w-8 h-8 text-blue-600" />
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-600 ml-1">
                                            Gender
                                        </label>
                                        <Select>
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
                                        <Select>
                                            <SelectTrigger className="w-36">
                                                <SelectValue placeholder="Select tone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="professional">Professional</SelectItem>
                                                <SelectItem value="friendly">Friendly</SelectItem>
                                                <SelectItem value="casual">Casual</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-600 ml-1">
                                            Language
                                        </label>
                                        <Select>
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
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 h-auto text-lg font-medium rounded-xl">
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