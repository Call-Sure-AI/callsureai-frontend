// app/dashboard/analytics-dashboard/page.tsx - Updated with WebSocket
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    PhoneCall,
    Clock,
    UserCheck,
    BarChart2,
    Users,
    Phone,
    CheckCircle,
    AlertTriangle,
    RefreshCw,
    Wifi,
    WifiOff,
    TrendingUp,
    TrendingDown
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { useDashboardMetrics, defaults } from '@/contexts/dashboard-metrics-context';

// Connection Status Component
const ConnectionStatus = ({ status, lastUpdate }: { status: string; lastUpdate: Date | null }) => {
    const isConnected = status === 'connected';
    
    return (
        <div className="flex items-center gap-2 text-xs">
            {isConnected ? (
                <>
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-medium">Live</span>
                </>
            ) : status === 'connecting' || status === 'reconnecting' ? (
                <>
                    <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" />
                    <span className="text-amber-600 dark:text-amber-400">Connecting...</span>
                </>
            ) : (
                <>
                    <WifiOff className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400">Offline</span>
                </>
            )}
            {lastUpdate && (
                <span className="text-gray-400 dark:text-gray-500 ml-2">
                    Updated {formatTimeAgo(lastUpdate)}
                </span>
            )}
        </div>
    );
};

function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

const AnalyticsDashboard = () => {
    // 🔥 Get real-time data from WebSocket
    const { 
        analytics, 
        analyticsStatus, 
        companyMetrics,
        companyMetricsStatus,
        lastUpdate,
        refreshAll,
        period,
        setPeriod
    } = useDashboardMetrics();

    // Use real data or fallback to defaults
    const data = analytics || defaults.analytics;
    const metrics = companyMetrics || defaults.companyMetrics;

    // Transform call volume data for chart
    const chartData = data.callVolume.length > 0 
        ? data.callVolume 
        : [
            { name: 'Mon', calls: 0 },
            { name: 'Tue', calls: 0 },
            { name: 'Wed', calls: 0 },
            { name: 'Thu', calls: 0 },
            { name: 'Fri', calls: 0 },
            { name: 'Sat', calls: 0 },
            { name: 'Sun', calls: 0 }
        ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <motion.div
            className="w-full p-4 md:p-8 bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Call Center Analytics</h1>
                    <p className="text-gray-600 dark:text-gray-400">Real-time monitoring and performance metrics</p>
                </div>
                <div className="flex items-center gap-4">
                    <ConnectionStatus status={analyticsStatus} lastUpdate={lastUpdate} />
                    <div className="flex items-center gap-2">
                        {['day', 'week', 'month', 'year'].map((p) => (
                            <Button
                                key={p}
                                variant={period === p ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPeriod(p)}
                                className={period === p ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refreshAll}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div variants={itemVariants}>
                    <Card className="bg-white dark:bg-slate-900/80 shadow-lg border-0 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-bl-full" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Calls</CardTitle>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                <PhoneCall className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {metrics.totalCalls.toLocaleString()}
                            </div>
                            <div className="flex items-center mt-1">
                                {metrics.trends.calls >= 0 ? (
                                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                )}
                                <p className={`text-xs ${metrics.trends.calls >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {metrics.trends.calls >= 0 ? '+' : ''}{metrics.trends.calls}% from last {period}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="bg-white dark:bg-slate-900/80 shadow-lg border-0 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-bl-full" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Wait Time</CardTitle>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{data.avgWaitTime}</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Target: 2m 00s</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="bg-white dark:bg-slate-900/80 shadow-lg border-0 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-bl-full" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolution Rate</CardTitle>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.resolutionRate}%</div>
                            <div className="flex items-center mt-1">
                                {metrics.trends.resolution >= 0 ? (
                                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                )}
                                <p className={`text-xs ${metrics.trends.resolution >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {metrics.trends.resolution >= 0 ? '+' : ''}{metrics.trends.resolution}% from last {period}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div variants={itemVariants}>
                    <Card className="bg-white dark:bg-slate-900/80 shadow-lg border-0">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-cyan-500" />
                                Call Volume Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="callsGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" stroke="#9ca3af" />
                                        <YAxis stroke="#9ca3af" />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#1f2937', 
                                                border: 'none', 
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }} 
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="calls"
                                            stroke="#06b6d4"
                                            strokeWidth={2}
                                            fill="url(#callsGradient)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="bg-white dark:bg-slate-900/80 shadow-lg border-0">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-500" />
                                Real-Time Monitoring
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <motion.div 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="flex justify-between items-center p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-500/10 dark:to-blue-500/10 rounded-xl border border-cyan-100 dark:border-cyan-500/20"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-gray-900 dark:text-white font-medium">Active Calls</span>
                                    </div>
                                    <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                                        {metrics.activeCalls}
                                    </span>
                                </motion.div>

                                <motion.div 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 rounded-xl border border-green-100 dark:border-green-500/20"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                            <UserCheck className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-gray-900 dark:text-white font-medium">Available Agents</span>
                                    </div>
                                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {data.availableAgents}
                                    </span>
                                </motion.div>

                                <motion.div 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-500/10 dark:to-rose-500/10 rounded-xl border border-red-100 dark:border-red-500/20"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                                            <AlertTriangle className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-gray-900 dark:text-white font-medium">Alerts</span>
                                    </div>
                                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        {data.alerts}
                                    </span>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Agent Performance Section */}
            <motion.div variants={itemVariants}>
                <Card className="bg-white dark:bg-slate-900/80 shadow-lg border-0">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                            <BarChart2 className="w-5 h-5 text-orange-500" />
                            Agent Performance Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className="p-5 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-500/10 dark:to-blue-500/10 rounded-xl border border-cyan-100 dark:border-cyan-500/20"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Agents</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {data.activeAgents}/{data.activeAgents + data.availableAgents}
                                </div>
                            </motion.div>

                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 rounded-xl border border-purple-100 dark:border-purple-500/20"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {data.avgResponseTime}
                                </div>
                            </motion.div>

                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 rounded-xl border border-green-100 dark:border-green-500/20"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <BarChart2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolution Rate</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {metrics.resolutionRate}%
                                </div>
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default AnalyticsDashboard;