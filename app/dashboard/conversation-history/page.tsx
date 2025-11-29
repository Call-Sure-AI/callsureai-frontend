"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAgents } from "@/contexts/agent-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    Bot, 
    Search, 
    ChevronRight, 
    MessageCircle,
    Clock,
    TrendingUp,
    Phone,
    Activity,
    Calendar,
    PhoneIncoming,
    PhoneOutgoing,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
    RefreshCw
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Simulated live data - in production this would come from WebSocket/API
const useLiveStats = () => {
    const [stats, setStats] = useState({
        liveNow: 3,
        todayTotal: 47,
        todayInbound: 32,
        todayOutbound: 15,
        avgDuration: "4.2m",
        avgWaitTime: "12s",
        satisfaction: 94,
        trending: "+12%"
    });

    useEffect(() => {
        // Simulate live updates
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                liveNow: Math.max(0, prev.liveNow + (Math.random() > 0.5 ? 1 : -1)),
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return stats;
};

// Date breakdown data
const dateBreakdown = [
    { date: "Today", count: 47, change: "+12%", positive: true },
    { date: "Yesterday", count: 52, change: "+8%", positive: true },
    { date: "Apr 28", count: 41, change: "-5%", positive: false },
    { date: "Apr 27", count: 38, change: "+3%", positive: true },
    { date: "Apr 26", count: 45, change: "+15%", positive: true },
];

export default function ConversationHistoryPage() {
    const router = useRouter();
    const { agents, loading } = useAgents();
    const [visible, setVisible] = useState(12);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("conversations");
    const [statusFilter, setStatusFilter] = useState("all");
    const liveStats = useLiveStats();

    const filtered = agents
        .filter(a => a.name?.toLowerCase().includes(search.toLowerCase()))
        .filter(a => statusFilter === "all" || (statusFilter === "active" ? a.is_active : !a.is_active));

    // Sort agents
    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
        if (sortBy === "active") return (b.is_active ? 1 : 0) - (a.is_active ? 1 : 0);
        // Default: by conversations (simulated)
        return 0;
    });

    const displayed = sorted.slice(0, visible);

    const totalAgents = agents.length;
    const activeAgents = agents.filter(a => a.is_active).length;
    const liveAgents = agents.filter(a => a.is_active).slice(0, liveStats.liveNow).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Header Section */}
            <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                                <span className="text-cyan-600">Conversation</span> History
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Browse and analyze agent conversations
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="rounded-xl h-10">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Analytics
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10" onClick={() => window.location.reload()}>
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Live Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {/* Live Now - Highlighted */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="col-span-2 md:col-span-1 bg-gradient-to-br from-emerald-500/70 to-emerald-600/80 rounded-2xl p-4 text-white relative overflow-hidden"
                        >
                            <div className="absolute top-2 right-2">
                                <span className="flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                </span>
                            </div>
                            <Phone className="w-5 h-5 mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{liveStats.liveNow}</p>
                            <p className="text-sm text-white/80">Live Now</p>
                        </motion.div>

                        {/* Today's Calls */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <MessageCircle className="w-5 h-5 text-cyan-500" />
                                <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />{liveStats.trending}
                                </Badge>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{liveStats.todayTotal}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Today&apos;s Calls</p>
                        </motion.div>

                        {/* Inbound */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4"
                        >
                            <PhoneIncoming className="w-5 h-5 text-emerald-500 mb-2" />
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{liveStats.todayInbound}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Inbound</p>
                        </motion.div>

                        {/* Outbound */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4"
                        >
                            <PhoneOutgoing className="w-5 h-5 text-blue-500 mb-2" />
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{liveStats.todayOutbound}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Outbound</p>
                        </motion.div>

                        {/* Avg Duration */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4"
                        >
                            <Clock className="w-5 h-5 text-amber-500 mb-2" />
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{liveStats.avgDuration}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Avg Duration</p>
                        </motion.div>

                        {/* Satisfaction */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4"
                        >
                            <Sparkles className="w-5 h-5 text-purple-500 mb-2" />
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{liveStats.satisfaction}%</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Satisfaction</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Sidebar - Date Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-5 sticky top-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="w-5 h-5 text-cyan-500" />
                                <h3 className="font-semibold text-gray-900 dark:text-white">Date Breakdown</h3>
                            </div>
                            <div className="space-y-3">
                                {dateBreakdown.map((day, i) => (
                                    <div 
                                        key={i} 
                                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                                            i === 0 
                                                ? 'bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30' 
                                                : 'hover:bg-gray-50 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <div>
                                            <p className={`font-medium ${i === 0 ? 'text-cyan-700 dark:text-cyan-400' : 'text-gray-900 dark:text-white'}`}>
                                                {day.date}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{day.count} calls</p>
                                        </div>
                                        <Badge className={`text-xs ${
                                            day.positive 
                                                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                                                : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                                        }`}>
                                            {day.positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                            {day.change}
                                        </Badge>
                                    </div>
                                ))}
                            </div>

                            {/* Mini Chart Placeholder */}
                            <div className="mt-5 pt-5 border-t border-gray-200 dark:border-slate-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Last 7 Days</p>
                                <div className="flex items-end gap-1 h-16">
                                    {[35, 42, 38, 51, 47, 52, 47].map((val, i) => (
                                        <div 
                                            key={i} 
                                            className={`flex-1 rounded-t transition-all ${
                                                i === 6 
                                                    ? 'bg-cyan-500' 
                                                    : 'bg-gray-200 dark:bg-slate-700 hover:bg-cyan-300 dark:hover:bg-cyan-700'
                                            }`}
                                            style={{ height: `${(val / 55) * 100}%` }}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                                    <span>Mon</span>
                                    <span>Today</span>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="mt-5 pt-5 border-t border-gray-200 dark:border-slate-700 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">This Week</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">312 calls</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">This Month</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">1,247 calls</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Avg Wait Time</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{liveStats.avgWaitTime}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content - Agents Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800">
                            {/* Header */}
                            <div className="p-5 border-b border-gray-200 dark:border-slate-800">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="font-semibold text-gray-900 dark:text-white">Select an Agent</h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {totalAgents} agents • {activeAgents} active • {liveAgents} on calls
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-1 sm:w-64">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                placeholder="Search agents..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="pl-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                                            />
                                        </div>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="w-32 h-10 rounded-xl">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select value={sortBy} onValueChange={setSortBy}>
                                            <SelectTrigger className="w-40 h-10 rounded-xl">
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="conversations">Most Conversations</SelectItem>
                                                <SelectItem value="name">Name A-Z</SelectItem>
                                                <SelectItem value="active">Active First</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Agents Grid */}
                            <div className="p-5">
                                {displayed.length === 0 ? (
                                    <div className="text-center py-16">
                                        {search || statusFilter !== "all" ? (
                                            <>
                                                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No agents found</h3>
                                                <Button variant="ghost" onClick={() => { setSearch(''); setStatusFilter('all'); }} className="text-cyan-600">
                                                    Clear filters
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Bot className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No agents yet</h3>
                                                <p className="text-gray-500">Create your first agent to get started</p>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {displayed.map((agent, i) => {
                                                if (!agent.id) return null;
                                                
                                                const isLive = agent.is_active && i < liveStats.liveNow;
                                                const convCount = Math.floor(Math.random() * 400) + 50;
                                                const todayCount = Math.floor(Math.random() * 15) + 1;
                                                const avgDur = `${Math.floor(Math.random() * 6) + 2}m`;
                                                const sat = Math.floor(Math.random() * 15) + 80;

                                                return (
                                                    <motion.div
                                                        key={agent.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.03 }}
                                                        onClick={() => router.push(`/dashboard/conversation-history/chat?agent=${agent.id}`)}
                                                        className="group bg-gray-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600 p-5 cursor-pointer transition-all hover:shadow-lg relative overflow-hidden"
                                                    >
                                                        {/* Live Indicator Bar */}
                                                        {isLive && (
                                                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500" />
                                                        )}

                                                        <div className="flex items-start gap-4">
                                                            {/* Avatar */}
                                                            <div className="relative">
                                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold ${
                                                                    agent.is_active 
                                                                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600' 
                                                                        : 'bg-gray-400'
                                                                }`}>
                                                                    {agent.name?.charAt(0).toUpperCase() || 'A'}
                                                                </div>
                                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                                                                    !agent.is_active ? 'bg-gray-400' : isLive ? 'bg-red-500' : 'bg-emerald-500'
                                                                }`}>
                                                                    {isLive && <Activity className="w-2.5 h-2.5 text-white absolute inset-0 m-auto animate-pulse" />}
                                                                </div>
                                                            </div>

                                                            {/* Info */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                                                        {agent.name}
                                                                    </h3>
                                                                    {isLive && (
                                                                        <Badge className="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-0 text-[10px] animate-pulse">
                                                                            LIVE
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="secondary" className={`text-[10px] ${
                                                                        agent.is_active 
                                                                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                                                                            : 'bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400'
                                                                    }`}>
                                                                        {agent.is_active ? 'Active' : 'Inactive'}
                                                                    </Badge>
                                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {todayCount} calls today
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                                                        </div>

                                                        {/* Stats */}
                                                        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                                                            <div className="text-center">
                                                                <p className="text-lg font-bold text-gray-900 dark:text-white">{convCount}</p>
                                                                <p className="text-[10px] text-gray-500 dark:text-gray-400">Total Calls</p>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{avgDur}</p>
                                                                <p className="text-[10px] text-gray-500 dark:text-gray-400">Avg Duration</p>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{sat}%</p>
                                                                <p className="text-[10px] text-gray-500 dark:text-gray-400">Satisfaction</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>

                                        {/* Load More */}
                                        {filtered.length > visible && (
                                            <div className="flex justify-center mt-6">
                                                <Button onClick={() => setVisible(v => v + 12)} className="rounded-xl h-10 px-6 bg-cyan-600 hover:bg-cyan-500 text-white">
                                                    <TrendingUp className="w-4 h-4 mr-2" />
                                                    Load More ({filtered.length - visible} remaining)
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}