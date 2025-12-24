// app/dashboard/page.tsx - Updated with WebSocket integration
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    PlusCircleIcon, 
    TrendingUpIcon, 
    TrendingDownIcon, 
    MinusIcon, 
    AlertTriangle, 
    Phone, 
    CheckCircle, 
    Percent, 
    Calendar, 
    Wallet, 
    ArrowRight, 
    Sparkles,
    RefreshCw,
    Wifi,
    WifiOff
} from "lucide-react";
import { useMemo, memo, useCallback } from 'react';

import { Button } from "@/components/ui/button";
import { AgentSection } from '@/components/agent/agent-section';
import { ProtectedRoute } from '@/components/protected-route';
import AgentPerformanceChart from '@/components/charts/agent-performance-chat';

import { useAgents } from '@/contexts/agent-context';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useDashboardMetrics, defaults } from '@/contexts/dashboard-metrics-context';
import AccessDenied from '@/components/dashboard/access-denied';

// ============== Loading Component ==============

const LoadingSpinner = memo(() => (
    <div className="flex items-center justify-center h-32 lg:h-48">
        <div className="relative">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-4 h-4 lg:w-5 lg:h-5 text-cyan-500" />
        </div>
    </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// ============== Connection Status Indicator ==============

const ConnectionStatus = memo(({ status, lastUpdate }: { status: string; lastUpdate: Date | null }) => {
    const isConnected = status === 'connected';
    
    return (
        <div className="flex items-center gap-2 text-xs">
            {isConnected ? (
                <>
                    <Wifi className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Live</span>
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
                <span className="text-gray-400 dark:text-gray-500">
                    • Updated {formatTimeAgo(lastUpdate)}
                </span>
            )}
        </div>
    );
});

ConnectionStatus.displayName = 'ConnectionStatus';

// ============== Helper Functions ==============

function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
}

// ============== Stat Icons & Colors ==============

const statIcons: Record<string, React.ReactNode> = {
    'Total Calls': <Phone className="w-4 h-4 lg:w-5 lg:h-5" />,
    'Completed Calls': <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />,
    'Resolution Rate': <Percent className="w-4 h-4 lg:w-5 lg:h-5" />,
    'Total Bookings': <Calendar className="w-4 h-4 lg:w-5 lg:h-5" />,
    'Credit Balance': <Wallet className="w-4 h-4 lg:w-5 lg:h-5" />,
};

const statColors: Record<string, { gradient: string; icon: string; glow: string }> = {
    'Total Calls': { gradient: 'from-cyan-500 to-blue-600', icon: 'text-cyan-500', glow: 'shadow-cyan-500/20' },
    'Completed Calls': { gradient: 'from-emerald-500 to-green-600', icon: 'text-emerald-500', glow: 'shadow-emerald-500/20' },
    'Resolution Rate': { gradient: 'from-purple-500 to-indigo-600', icon: 'text-purple-500', glow: 'shadow-purple-500/20' },
    'Total Bookings': { gradient: 'from-orange-500 to-amber-600', icon: 'text-orange-500', glow: 'shadow-orange-500/20' },
    'Credit Balance': { gradient: 'from-pink-500 to-rose-600', icon: 'text-pink-500', glow: 'shadow-pink-500/20' },
};

// ============== Stat Card Component ==============

const StatCard = memo(({ stat, index }: { stat: any; index: number }) => {
    const colors = statColors[stat.label] || statColors['Total Calls'];
    const icon = statIcons[stat.label] || <Phone className="w-4 h-4" />;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="group"
        >
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 p-3 lg:p-4 xl:p-5 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Glow effect */}
                <div className={`absolute -top-8 -right-8 w-20 h-20 lg:w-28 lg:h-28 bg-gradient-to-br ${colors.gradient} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />

                <div className="relative">
                    {/* Icon and label */}
                    <div className="flex items-center justify-between mb-2 lg:mb-3">
                        <span className="text-[10px] lg:text-xs font-medium text-gray-600 dark:text-gray-400 truncate pr-2">{stat.label}</span>
                        <div className={`w-7 h-7 lg:w-9 lg:h-9 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-md ${colors.glow} flex-shrink-0`}>
                            <span className="text-white">{icon}</span>
                        </div>
                    </div>

                    {/* Value */}
                    <div className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {stat.value}
                    </div>

                    {/* Trend */}
                    <div className={`text-[10px] lg:text-xs flex items-center gap-1 ${
                        stat.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' :
                        stat.trend === 'down' ? 'text-red-600 dark:text-red-400' :
                        stat.trend === 'info' ? 'text-cyan-600 dark:text-cyan-400' :
                        stat.trend === 'warn' ? 'text-amber-600 dark:text-amber-400' :
                        'text-gray-600 dark:text-gray-400'
                    }`}>
                        {stat.trend === 'up' && <TrendingUpIcon className="w-3 h-3" />}
                        {stat.trend === 'down' && <TrendingDownIcon className="w-3 h-3" />}
                        {stat.trend === 'warn' && <AlertTriangle className="w-3 h-3" />}
                        {stat.trend === 'info' && <Sparkles className="w-3 h-3" />}
                        {!stat.trend && <MinusIcon className="w-3 h-3" />}
                        <span className="font-medium truncate">{stat.stat}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

StatCard.displayName = 'StatCard';

// ============== Agent Creation Card ==============

const AgentCreationCard = memo(() => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="group"
    >
        <div className="relative bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 dark:from-cyan-500/5 dark:via-blue-500/5 dark:to-purple-500/5 backdrop-blur-xl rounded-xl border border-cyan-500/20 dark:border-cyan-500/10 p-3 lg:p-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            
            <div className="absolute top-2 right-2 lg:top-3 lg:right-3 opacity-50">
                <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-500 animate-pulse" />
            </div>

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 lg:gap-3">
                <div>
                    <h2 className="text-sm lg:text-base font-bold text-gray-900 dark:text-white">
                        Create New Agent
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-[10px] lg:text-xs">
                        Build and deploy AI voice agents in minutes
                    </p>
                </div>
                <Link href="/agent/creation">
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm rounded-lg shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 group/btn">
                        <PlusCircleIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                        <span>Add Agent</span>
                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        </div>
    </motion.div>
));

AgentCreationCard.displayName = 'AgentCreationCard';

// ============== Main Dashboard Page ==============

const DashboardPage = () => {
    const { agents, loading: agentsLoading } = useAgents();
    const { user, loading: userLoading } = useCurrentUser();
    
    // 🔥 NEW: Get real-time metrics from WebSocket
    const { 
        companyMetrics, 
        companyMetricsStatus, 
        lastUpdate,
        refreshAll,
        isLoading: metricsLoading 
    } = useDashboardMetrics();

    // Use real data or fallback to defaults
    const metrics = companyMetrics || defaults.companyMetrics;

    // Build stats cards from real-time data
    const statsCards = useMemo(() => [
        { 
            label: 'Total Calls', 
            value: formatNumber(metrics.totalCalls), 
            stat: `${metrics.trends.calls >= 0 ? '+' : ''}${metrics.trends.calls}% this week`, 
            trend: metrics.trends.calls >= 0 ? 'up' : 'down' 
        },
        { 
            label: 'Completed Calls', 
            value: formatNumber(metrics.completedCalls), 
            stat: `${metrics.activeCalls} active now`, 
            trend: 'up' 
        },
        { 
            label: 'Resolution Rate', 
            value: `${metrics.resolutionRate}%`, 
            stat: `${metrics.trends.resolution >= 0 ? '+' : ''}${metrics.trends.resolution}% change`, 
            trend: metrics.trends.resolution >= 0 ? 'up' : 'down' 
        },
        { 
            label: 'Total Bookings', 
            value: formatNumber(metrics.totalBookings), 
            stat: `${metrics.trends.bookings >= 0 ? '+' : ''}${metrics.trends.bookings}% increase`, 
            trend: metrics.trends.bookings >= 0 ? 'up' : 'down' 
        },
        { 
            label: 'Credit Balance', 
            value: `$${formatNumber(metrics.creditBalance)}`, 
            stat: 'Can be recharged', 
            trend: 'info' 
        },
    ], [metrics]);

    // Refresh handler
    const handleRefresh = useCallback(() => {
        refreshAll();
    }, [refreshAll]);

    // Loading states
    const isLoading = userLoading || metricsLoading;

    if (!user && !userLoading) {
        return <AccessDenied redirectPath='/auth' />;
    }

    if (isLoading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </ProtectedRoute>
        );
    }

    const isAdmin = user?.role === "admin";

    return (
        <ProtectedRoute>
            <div className="w-full">
                <div className="max-w-7xl mx-auto">
                    {/* Header with Connection Status */}
                    <div className="flex items-center justify-between mb-4">
                        <ConnectionStatus status={companyMetricsStatus} lastUpdate={lastUpdate} />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRefresh}
                            className="text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400"
                        >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Refresh
                        </Button>
                    </div>

                    {/* Stats Grid - 2 cols on mobile, 3 on tablet, 5 on desktop */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-3 xl:gap-4 mb-4 lg:mb-6">
                        {statsCards.map((stat, index) => (
                            <StatCard key={`stat-${index}`} stat={stat} index={index} />
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                        {/* Left Column - Chart + Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="w-full space-y-3 lg:space-y-4"
                        >
                            {/* Chart */}
                            <AgentPerformanceChart />

                            {/* Quick Actions Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 p-3 lg:p-4 shadow-lg"
                            >
                                <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white mb-2 lg:mb-3">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                                    <Link href="/dashboard/call-reports">
                                        <motion.div 
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            className="p-2.5 lg:p-3 rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-200/50 dark:border-cyan-500/20 cursor-pointer group"
                                        >
                                            <Phone className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                                            <p className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">Call Reports</p>
                                            <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400">View call history</p>
                                        </motion.div>
                                    </Link>
                                    <Link href="/dashboard/analytics-dashboard">
                                        <motion.div 
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            className="p-2.5 lg:p-3 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-500/10 dark:to-indigo-500/10 border border-purple-200/50 dark:border-purple-500/20 cursor-pointer group"
                                        >
                                            <TrendingUpIcon className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                                            <p className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">Analytics</p>
                                            <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400">Performance data</p>
                                        </motion.div>
                                    </Link>
                                    <Link href="/bookings">
                                        <motion.div 
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            className="p-2.5 lg:p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 border border-emerald-200/50 dark:border-emerald-500/20 cursor-pointer group"
                                        >
                                            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                                            <p className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">Bookings</p>
                                            <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400">Manage schedules</p>
                                        </motion.div>
                                    </Link>
                                    <Link href="/payments-section">
                                        <motion.div 
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            className="p-2.5 lg:p-3 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 border border-orange-200/50 dark:border-orange-500/20 cursor-pointer group"
                                        >
                                            <Wallet className="w-4 h-4 text-orange-600 dark:text-orange-400 mb-1 group-hover:scale-110 transition-transform" />
                                            <p className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">Payments</p>
                                            <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400">Billing & credits</p>
                                        </motion.div>
                                    </Link>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right Column */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="w-full space-y-3 lg:space-y-4"
                        >
                            {/* Agent Creation Card - Admin Only */}
                            {isAdmin && <AgentCreationCard />}

                            {/* Agents Section */}
                            <div className="space-y-2 lg:space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base lg:text-lg xl:text-xl font-bold">
                                        <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                                            Your
                                        </span>
                                        <span className="text-gray-900 dark:text-white ml-1.5">Agents</span>
                                    </h2>
                                    {agents.length > 0 && (
                                        <Link href="/dashboard/agents">
                                            <Button variant="ghost" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-xs font-medium flex items-center gap-1 px-2 h-7">
                                                View All
                                                <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        </Link>
                                    )}
                                </div>

                                <div 
                                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 p-3 lg:p-4 shadow-lg overflow-y-auto max-h-[537px]"
                                >
                                    <div 
                                        className="h-full overflow-y-auto"
                                        style={{
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: 'rgba(100, 116, 139, 0.3) transparent'
                                        }}
                                    >
                                        {agentsLoading ? (
                                            <LoadingSpinner />
                                        ) : (
                                            <AgentSection agents={agents} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default memo(DashboardPage);