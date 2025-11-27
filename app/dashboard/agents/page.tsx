"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bot, 
    Plus, 
    Search, 
    Grid3X3, 
    List, 
    Sparkles,
    Users,
    Activity,
    CheckCircle,
    Clock,
    ArrowLeft,
    RefreshCw
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AgentCard } from '@/components/agent/agent-card';
import { ProtectedRoute } from '@/components/protected-route';
import { useAgents } from '@/contexts/agent-context';
import { useCurrentUser } from '@/hooks/use-current-user';
import AccessDenied from '@/components/dashboard/access-denied';

const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
        <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-cyan-500" />
        </div>
    </div>
);

const EmptyState = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16"
    >
        <div className="relative mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Bot className="w-10 h-10 text-cyan-500" />
            </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No agents found</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
            Create your first AI voice agent to start automating your customer interactions
        </p>
        <Link href="/agent/creation">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Your First Agent
            </Button>
        </Link>
    </motion.div>
);

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
    <div className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-slate-700/50 p-4 flex items-center gap-3`}>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

export default function AgentsPage() {
    const { agents, loading } = useAgents();
    const { user, loading: userLoading } = useCurrentUser();
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Debug log to see what's happening
    useEffect(() => {
        console.log('Agents page - agents:', agents);
        console.log('Agents page - loading:', loading);
    }, [agents, loading]);

    // Get the agents to display
    const displayAgents = useMemo(() => {
        // Safety check
        if (!agents || !Array.isArray(agents) || agents.length === 0) {
            return [];
        }
        
        // If no filters applied, return all agents
        if (searchQuery.trim() === '' && filterStatus === 'all') {
            return agents;
        }
        
        return agents.filter(agent => {
            // Search filter
            const searchLower = searchQuery.toLowerCase().trim();
            const matchesSearch = searchLower === '' || 
                (agent.agent_name && agent.agent_name.toLowerCase().includes(searchLower)) ||
                (agent.persona && agent.persona.toLowerCase().includes(searchLower));
            
            // Status filter
            let matchesFilter = true;
            if (filterStatus === 'online') {
                matchesFilter = agent.is_active === true;
            } else if (filterStatus === 'offline') {
                matchesFilter = agent.is_active === false || !agent.is_active;
            }
            
            return matchesSearch && matchesFilter;
        });
    }, [agents, searchQuery, filterStatus]);

    const stats = useMemo(() => {
        if (!agents || !Array.isArray(agents)) {
            return { total: 0, online: 0, offline: 0 };
        }
        return {
            total: agents.length,
            online: agents.filter(a => a.is_active).length,
            offline: agents.filter(a => !a.is_active).length,
        };
    }, [agents]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Just trigger a re-render, the context should handle fetching
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    if (!user && !userLoading) {
        return <AccessDenied redirectPath='/auth' />;
    }

    if (userLoading) {
        return (
            <ProtectedRoute>
                <LoadingSpinner />
            </ProtectedRoute>
        );
    }

    const isAdmin = user?.role === "admin";

    return (
        <ProtectedRoute>
            <div className="w-full max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold">
                                <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                                    Your
                                </span>
                                <span className="text-gray-900 dark:text-white ml-2">Agents</span>
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Manage and monitor all your AI voice agents
                            </p>
                        </div>
                    </div>

                    {isAdmin && (
                        <Link href="/agent/creation">
                            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                <span>New Agent</span>
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard 
                        icon={Users} 
                        label="Total Agents" 
                        value={stats.total} 
                        color="from-cyan-500 to-blue-600"
                    />
                    <StatCard 
                        icon={Activity} 
                        label="Online" 
                        value={stats.online} 
                        color="from-emerald-500 to-green-600"
                    />
                    <StatCard 
                        icon={Clock} 
                        label="Offline" 
                        value={stats.offline} 
                        color="from-gray-500 to-slate-600"
                    />
                    <StatCard 
                        icon={CheckCircle} 
                        label="Success Rate" 
                        value="94%" 
                        color="from-purple-500 to-indigo-600"
                    />
                </div>

                {/* Search and Filters Bar */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 p-4 shadow-lg">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search agents by name or persona..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                                <button
                                    onClick={() => setFilterStatus('all')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                        filterStatus === 'all' 
                                            ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilterStatus('online')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                        filterStatus === 'online' 
                                            ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                                >
                                    Online
                                </button>
                                <button
                                    onClick={() => setFilterStatus('offline')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                        filterStatus === 'offline' 
                                            ? 'bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 shadow-sm' 
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                                >
                                    Offline
                                </button>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-all ${
                                        viewMode === 'list' 
                                            ? 'bg-white dark:bg-slate-700 text-cyan-600 shadow-sm' 
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-md transition-all ${
                                        viewMode === 'grid' 
                                            ? 'bg-white dark:bg-slate-700 text-cyan-600 shadow-sm' 
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Refresh Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="border-gray-200 dark:border-slate-700"
                            >
                                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Agents List/Grid */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 p-4 lg:p-6 shadow-lg min-h-[300px]">
                    {loading ? (
                        <LoadingSpinner />
                    ) : displayAgents.length > 0 ? (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={viewMode}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className={
                                    viewMode === 'grid' 
                                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' 
                                        : 'space-y-3'
                                }
                            >
                                {displayAgents.map((agent, index) => (
                                    <motion.div
                                        key={agent.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: Math.min(index * 0.03, 0.3) }}
                                    >
                                        <AgentCard agent={agent} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    ) : agents.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="text-center py-12">
                            <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No agents match your filters</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Try adjusting your search or filter criteria
                            </p>
                            <Button 
                                variant="ghost" 
                                onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
                                className="mt-4 text-cyan-600 dark:text-cyan-400"
                            >
                                Clear filters
                            </Button>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                {!loading && agents && agents.length > 0 && (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Showing {displayAgents.length} of {agents.length} agents
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}