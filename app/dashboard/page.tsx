"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlusCircleIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AgentSection } from '@/components/agent/agent-section';
import { ProtectedRoute } from '@/components/protected-route';
import AgentPerformanceChart from '@/components/charts/agent-performance-chat';

import { useCurrentUser } from '@/hooks/use-current-user';
import { AgentFormData } from '@/types';
import { getAllAgents } from '@/services/agent-service';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const DashboardLayout = () => {
    const { user } = useCurrentUser();
    const { token } = useIsAuthenticated();
    const router = useRouter();
    const [agents, setAgents] = useState<AgentFormData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                if (!token) {
                    toast({
                        title: "Error",
                        description: "Please login to view your agents.",
                        variant: "destructive",
                    });
                    return;
                }
                const response = await getAllAgents(token);
                setAgents(response);
                setLoading(false);
            } catch (error: any) {
                console.error('Error fetching agents:', error);
                if (error.message === "Invalid token") {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    router.push('/');
                }
                setLoading(false);
            }
        };
        if (user && user.id) {
            fetchAgents();
        }
    }, [user, token]);

    const statsCards = [
        { label: 'Total Calls', value: '5,672', stat: "40% increase", trend: "up" },
        { label: 'Completed Calls', value: '4,987', stat: "400 active calls", trend: "up" },
        { label: 'Resolution Rate', value: '89%', stat: "+2.5% increase", trend: "up" },
        { label: 'Total Bookings', value: '4,510', stat: "32.0% increase", trend: "up" },
        { label: 'Credit Balance', value: '$1,234', stat: "Can be increased by $500", trend: "neutral" },
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen w-full bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Cards Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                        {statsCards.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col space-y-2">
                                            <div className="text-sm font-medium text-[#0A1E4E]/80">{stat.label}</div>
                                            <div className="text-2xl font-bold text-[#0A1E4E]">{stat.value}</div>
                                            <div className={`text-sm ${stat.trend === 'up' ? 'text-green-600' :
                                                stat.trend === 'down' ? 'text-red-600' :
                                                    'text-gray-600'
                                                }`}>
                                                {stat.stat}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Content Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Performance Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="w-full"
                        >
                            <AgentPerformanceChart />
                        </motion.div>

                        {/* Right Column - Agent Management */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="w-full space-y-6"
                        >
                            {/* Add Agent Card */}
                            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                                        <div className="space-y-2">
                                            <h2 className="text-xl font-semibold text-[#0A1E4E]">Set up a new agent</h2>
                                            <p className="text-[#0A1E4E]/70">Create and manage your AI agents</p>
                                        </div>
                                        <Link href="/agent/creation">
                                            <Button className="bg-[#0A1E4E] hover:bg-[#0A1E4E]/90 text-white shadow-sm">
                                                <PlusCircleIcon className="w-4 h-4 mr-2" />
                                                Add Agent
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Agents List Section */}
                            <div className="space-y-4">
                                <h1 className="text-2xl font-bold text-[#0A1E4E]">
                                    Your Agents
                                </h1>

                                {loading ? (
                                    <div className="flex items-center justify-center h-48 bg-white rounded-lg">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#0A1E4E]" />
                                    </div>
                                ) : (
                                    <AgentSection agents={agents} />
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default DashboardLayout;