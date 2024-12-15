"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircleIcon } from "lucide-react";
import Link from 'next/link';
import { UserProfileIcon } from '@/components/auth/user-profile-icon';
import { AgentSection } from '@/components/agent/agent-section';
import { useCurrentUser } from '@/hooks/use-current-user';

const DashboardLayout = () => {
    const { user } = useCurrentUser();

    const statsCards = [
        { label: 'Account Balance', value: '$1,234' },
        { label: 'Total Call Cost', value: '$567' },
        { label: 'Completed Calls', value: '89' },
        { label: 'Total Call Duration', value: '45h' },
    ];

    return (
        <div className="flex h-screen bg-white text-black">
            {/* Main Content */}
            <div className="ml-16 flex-1 p-6 md:p-8 bg-white">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex w-full justify-between items-center"
                >
                    <h1 className="text-lg md:text-2xl font-bold mb-4 text-[#0A1E4E] text-ellipsis">Good Afternoon, {user?.name}</h1>
                    <UserProfileIcon />
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cold-2 md:grid-cols-4 gap-4 mb-8">
                    {statsCards.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="bg-white transition-colors">
                                <CardContent className="p-4">
                                    <div className="text-sm font-bold text-[#0A1E4E]">{stat.label}</div>
                                    <div className="text-xl font-bold mt-1 text-black">{stat.value}</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Agent Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Card className="bg-white">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold mb-2 text-black">Set up a new agent - Start</h2>
                                    <p className="text-[#0A1E4E]">Manage your agents here</p>
                                </div>
                                <Link href="/agent/creation">
                                    <Button className="bg-[#0A1E4E] mt-4 text-white">
                                        <PlusCircleIcon className="w-4 h-4 mr-2" />
                                        Add Agent
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold mb-4 text-[#0A1E4E]"
                >
                    Agents
                </motion.h1>

                <AgentSection />
            </div>
        </div>
    );
};

export default DashboardLayout;