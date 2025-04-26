"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlusCircleIcon, Loader2, TrendingUpIcon, TrendingDownIcon, MinusIcon, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AgentSection } from '@/components/agent/agent-section';
import { ProtectedRoute } from '@/components/protected-route';
import AgentPerformanceChart from '@/components/charts/agent-performance-chat';

import { useAgents } from '@/contexts/agent-context';

const DashboardLayout = () => {
    const { agents, loading } = useAgents();

    const statsCards = [
        { label: 'Total Calls', value: '5,672', stat: "40% increase", trend: "up" },
        { label: 'Completed Calls', value: '4,987', stat: "400 active calls", trend: "up" },
        { label: 'Resolution Rate', value: '89%', stat: "+2.5% increase", trend: "up" },
        { label: 'Total Bookings', value: '4,510', stat: "32.0% increase", trend: "up" },
        { label: 'Credit Balance', value: '$1,234', stat: "Can be recharged", trend: "warn" },
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
                                            <div className={`text-sm flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' :
                                                stat.trend === 'down' || stat.trend === 'warn' ? 'text-red-600' :
                                                    'text-gray-600'
                                                }`}>
                                                {stat.stat}
                                                {stat.trend === 'up' && <TrendingUpIcon className="w-4 h-4" />}
                                                {stat.trend === 'down' && <TrendingDownIcon className="w-4 h-4" />}
                                                {stat.trend === 'warn' && <AlertTriangle className="w-4 h-4" />}
                                                {!stat.trend && <MinusIcon className="w-4 h-4" />}
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
                                            <p className="text-[#0A1E4E]/70 text-xs">Create and manage your AI agents</p>
                                        </div>
                                        <Link href="/agent/creation">
                                        <Button variant="animated" className="group relative overflow-hidden">
                                            <span className="flex items-center transition-all duration-300 group-hover:-translate-x-[250%]">
                                                <PlusCircleIcon className="w-4 h-4 mr-2" />
                                                Add Agent
                                            </span>
                                            <span className="absolute flex items-center inset-0 justify-center translate-x-[250%] group-hover:translate-x-0 transition-all duration-300">
                                                <PlusCircleIcon className="w-5 h-5 animate-[wiggle_1s_ease-in-out_infinite]" />
                                            </span>
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