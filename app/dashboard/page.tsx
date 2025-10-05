"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlusCircleIcon, Loader2, TrendingUpIcon, TrendingDownIcon, MinusIcon, AlertTriangle } from "lucide-react";
import { useMemo, memo } from 'react';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AgentSection } from '@/components/agent/agent-section';
import { ProtectedRoute } from '@/components/protected-route';
import AgentPerformanceChart from '@/components/charts/agent-performance-chat';

import { useAgents } from '@/contexts/agent-context';
import { useCurrentUser } from '@/hooks/use-current-user';
import AccessDenied from '@/components/dashboard/access-denied';

const LoadingSpinner = memo(() => (
    <div className="flex items-center justify-center h-48 bg-white rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A1E4E]" />
    </div>
));

const StatCard = memo(({ stat, index }: { stat: any; index: number }) => (
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
                        stat.trend === 'down' ? 'text-red-600' :
                            stat.trend === 'info' ? 'text-blue-600' :
                                stat.trend === 'warn' ? 'text-amber-600' :
                                    'text-gray-600'
                        }`}>
                        {stat.stat}
                        {stat.trend === 'up' && <TrendingUpIcon className="w-4 h-4" />}
                        {stat.trend === 'down' && <TrendingDownIcon className="w-4 h-4" />}
                        {stat.trend === 'warn' && <AlertTriangle className="w-4 h-4" />}
                        {stat.trend === 'info' && <PlusCircleIcon className="w-4 h-4" />}
                        {!stat.trend && <MinusIcon className="w-4 h-4" />}
                    </div>
                </div>
            </CardContent>
        </Card>
    </motion.div>
));

const AgentCreationCard = memo(() => (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                <div className="space-y-0">
                    <h2 className="text-xl font-bold text-[#0A1E4E]">Set up a new agent</h2>
                    <p className="text-[#0A1E4E] text-sm">Create and manage your AI agents</p>
                </div>
                <Link href="/agent/creation">
                    <Button variant="animated" className="group transition-colors duration-300 relative overflow-hidden px-6 py-6">
                        <span className="flex items-center transition-all duration-300">
                            <PlusCircleIcon className="w-4 h-4 mr-2" />
                            Add Agent
                        </span>
                        <span className="absolute flex items-center inset-0 justify-center translate-x-[225%] duration-300">
                            <PlusCircleIcon className="w-5 h-5 animate-[wiggle_1s_ease-in-out_infinite]" />
                        </span>
                    </Button>
                </Link>
            </div>
        </CardContent>
    </Card>
));

const DashboardLayout = () => {
    const { agents, loading } = useAgents();

    const { user, loading: isLoading } = useCurrentUser();

    const statsCards = useMemo(() => [
        { label: 'Total Calls', value: '14,894', stat: "40% increase", trend: "up" },
        { label: 'Completed Calls', value: '13,999', stat: "400 active calls", trend: "up" },
        { label: 'Resolution Rate', value: '94%', stat: "+2.5% increase", trend: "up" },
        { label: 'Total Bookings', value: '8,999', stat: "32.0% increase", trend: "up" },
        { label: 'Credit Balance', value: '$1,444', stat: "Can be recharged", trend: "info" },
    ], []);

    if (!user && !isLoading) {
        return <AccessDenied redirectPath='/auth' />;
    }

    if (isLoading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </ProtectedRoute>
        );
    }

    const isAdmin = user?.role === "admin";

    return (
        <ProtectedRoute>
            <div className="min-h-screen w-full bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                        {statsCards.map((stat, index) => (
                            <StatCard key={`stat-${index}`} stat={stat} index={index} />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="w-full"
                        >
                            <AgentPerformanceChart />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="w-full space-y-6"
                        >
                            {isAdmin && <AgentCreationCard />}

                            <div className="space-y-4">
                                <h1 className="text-2xl font-bold ml-3 inline-block bg-gradient-to-r from-[#162a47] via-[#3362A6] to-[#162a47] text-transparent bg-clip-text animate-gradient-xy pb-2">
                                    Your <span className="text-black">Agents</span>
                                </h1>

                                {loading ? (
                                    <LoadingSpinner />
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

export default memo(DashboardLayout);