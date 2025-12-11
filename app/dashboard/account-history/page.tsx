// app/dashboard/account-history/page.tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    History, 
    Download, 
    Search, 
    Clock, 
    Filter, 
    MoreVertical,
    FileText,
    Settings,
    Trash2,
    Eye,
    RefreshCw,
    Calendar,
    Activity,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    ArrowUpRight,
    Shield,
    UserPlus,
    FolderPlus,
    FileEdit,
    LogIn,
    LogOut,
    Key,
    AlertCircle
} from 'lucide-react';
import { HistoryEntry } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const AccountHistoryDashboard: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isExporting, setIsExporting] = useState(false);

    const historyData: HistoryEntry[] = [
        {
            id: '1',
            user: 'harsha19555555@gmail.com',
            actionName: 'CREATE_PROJECT',
            actionTime: 'December 10, 2024 3:26 PM',
            details: 'Created new project "Customer Support Bot"',
            ipAddress: '192.168.1.105'
        },
        {
            id: '2',
            user: 'john.doe@example.com',
            actionName: 'UPDATE_SETTINGS',
            actionTime: 'December 10, 2024 2:15 PM',
            details: 'Updated notification preferences',
            ipAddress: '10.0.0.42'
        },
        {
            id: '3',
            user: 'sarah.smith@example.com',
            actionName: 'DELETE_DOCUMENT',
            actionTime: 'December 10, 2024 1:45 PM',
            details: 'Deleted document "Q3 Report Draft"',
            ipAddress: '172.16.0.89'
        },
        {
            id: '4',
            user: 'mike.wilson@example.com',
            actionName: 'USER_LOGIN',
            actionTime: 'December 10, 2024 12:30 PM',
            details: 'Logged in from Chrome on Windows',
            ipAddress: '203.45.67.89'
        },
        {
            id: '5',
            user: 'emma.jones@example.com',
            actionName: 'INVITE_USER',
            actionTime: 'December 10, 2024 11:20 AM',
            details: 'Invited alex.brown@example.com as Manager',
            ipAddress: '192.168.1.150'
        },
        {
            id: '6',
            user: 'harsha19555555@gmail.com',
            actionName: 'UPDATE_PROJECT',
            actionTime: 'December 9, 2024 4:45 PM',
            details: 'Updated project settings for "Sales Assistant"',
            ipAddress: '192.168.1.105'
        },
        {
            id: '7',
            user: 'john.doe@example.com',
            actionName: 'CHANGE_PASSWORD',
            actionTime: 'December 9, 2024 3:00 PM',
            details: 'Password changed successfully',
            ipAddress: '10.0.0.42'
        },
        {
            id: '8',
            user: 'sarah.smith@example.com',
            actionName: 'CREATE_DOCUMENT',
            actionTime: 'December 9, 2024 2:15 PM',
            details: 'Created document "API Integration Guide"',
            ipAddress: '172.16.0.89'
        },
    ];

    const getActionConfig = (actionName: string) => {
        const configs: Record<string, { icon: any; color: string; bgColor: string; label: string }> = {
            'CREATE_PROJECT': { 
                icon: FolderPlus, 
                color: 'text-green-600 dark:text-green-400', 
                bgColor: 'bg-green-100 dark:bg-green-500/20',
                label: 'Project Created'
            },
            'UPDATE_PROJECT': { 
                icon: FileEdit, 
                color: 'text-blue-600 dark:text-blue-400', 
                bgColor: 'bg-blue-100 dark:bg-blue-500/20',
                label: 'Project Updated'
            },
            'UPDATE_SETTINGS': { 
                icon: Settings, 
                color: 'text-purple-600 dark:text-purple-400', 
                bgColor: 'bg-purple-100 dark:bg-purple-500/20',
                label: 'Settings Updated'
            },
            'DELETE_DOCUMENT': { 
                icon: Trash2, 
                color: 'text-red-600 dark:text-red-400', 
                bgColor: 'bg-red-100 dark:bg-red-500/20',
                label: 'Document Deleted'
            },
            'CREATE_DOCUMENT': { 
                icon: FileText, 
                color: 'text-green-600 dark:text-green-400', 
                bgColor: 'bg-green-100 dark:bg-green-500/20',
                label: 'Document Created'
            },
            'USER_LOGIN': { 
                icon: LogIn, 
                color: 'text-orange-600 dark:text-orange-400', 
                bgColor: 'bg-orange-100 dark:bg-orange-500/20',
                label: 'User Login'
            },
            'USER_LOGOUT': { 
                icon: LogOut, 
                color: 'text-gray-600 dark:text-gray-400', 
                bgColor: 'bg-gray-100 dark:bg-gray-500/20',
                label: 'User Logout'
            },
            'INVITE_USER': { 
                icon: UserPlus, 
                color: 'text-cyan-600 dark:text-cyan-400', 
                bgColor: 'bg-cyan-100 dark:bg-cyan-500/20',
                label: 'User Invited'
            },
            'CHANGE_PASSWORD': { 
                icon: Key, 
                color: 'text-amber-600 dark:text-amber-400', 
                bgColor: 'bg-amber-100 dark:bg-amber-500/20',
                label: 'Password Changed'
            },
        };
        
        return configs[actionName] || { 
            icon: Activity, 
            color: 'text-gray-600 dark:text-gray-400', 
            bgColor: 'bg-gray-100 dark:bg-gray-500/20',
            label: actionName.replace(/_/g, ' ')
        };
    };

    const filteredHistory = historyData.filter(entry => {
        const matchesSearch = entry.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.actionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (entry.details?.toLowerCase().includes(searchQuery.toLowerCase()));
        
        if (selectedFilter === 'all') return matchesSearch;
        
        const filterMap: Record<string, string[]> = {
            'create': ['CREATE_PROJECT', 'CREATE_DOCUMENT'],
            'update': ['UPDATE_PROJECT', 'UPDATE_SETTINGS'],
            'delete': ['DELETE_DOCUMENT'],
            'auth': ['USER_LOGIN', 'USER_LOGOUT', 'CHANGE_PASSWORD'],
            'user': ['INVITE_USER'],
        };
        
        return matchesSearch && filterMap[selectedFilter]?.includes(entry.actionName);
    });

    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
    const paginatedHistory = filteredHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatTimeRelative = (time: string) => {
        const date = new Date(time);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatTimeShort = (time: string) => {
        const date = new Date(time);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
        }, 2000);
    };

    // Stats calculation
    const stats = {
        total: historyData.length,
        today: historyData.filter(e => new Date(e.actionTime).toDateString() === new Date().toDateString()).length,
        creates: historyData.filter(e => e.actionName.includes('CREATE')).length,
        updates: historyData.filter(e => e.actionName.includes('UPDATE')).length,
    };

    // Mobile Card Component
    const HistoryCard = ({ entry, index }: { entry: HistoryEntry; index: number }) => {
        const config = getActionConfig(entry.actionName);
        const ActionIcon = config.icon;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
            >
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 mb-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <ActionIcon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${config.bgColor} ${config.color}`}>
                                    {config.label}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatTimeRelative(entry.actionTime)}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                                {entry.user}
                            </p>
                            {entry.details && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                    {entry.details}
                                </p>
                            )}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className="flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Export Entry
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-3">
                                <History className="w-4 h-4" />
                                Activity Log
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Account History
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Track all account activities, changes, and audit events
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="border-gray-200 dark:border-slate-700"
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Date Range</span>
                            </Button>
                            <Button
                                onClick={handleExport}
                                disabled={isExporting}
                                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25"
                            >
                                {isExporting ? (
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4 mr-2" />
                                )}
                                Export
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: "Total Events", value: stats.total, icon: Activity, color: "from-orange-500 to-amber-500", trend: "+12%" },
                        { label: "Today", value: stats.today, icon: Clock, color: "from-blue-500 to-cyan-500", trend: "+3" },
                        { label: "Creates", value: stats.creates, icon: FolderPlus, color: "from-green-500 to-emerald-500", trend: "+5" },
                        { label: "Updates", value: stats.updates, icon: FileEdit, color: "from-purple-500 to-pink-500", trend: "+8" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            className="relative p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className={`absolute top-4 right-4 w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
                                <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center">
                                    <ArrowUpRight className="w-3 h-3" />
                                    {stat.trend}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden"
                >
                    {/* Search and Filter Section */}
                    <div className="p-6 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by user, action, or details..."
                                    className="pl-12 h-11 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 rounded-xl"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="relative min-w-[180px]">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                <select
                                    className="w-full h-11 pl-12 pr-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-gray-300 appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                    value={selectedFilter}
                                    onChange={(e) => {
                                        setSelectedFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="all">All Actions</option>
                                    <option value="create">Create Actions</option>
                                    <option value="update">Update Actions</option>
                                    <option value="delete">Delete Actions</option>
                                    <option value="auth">Authentication</option>
                                    <option value="user">User Management</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Mobile View - Cards */}
                    <div className="block lg:hidden p-4">
                        {paginatedHistory.length > 0 ? (
                            paginatedHistory.map((entry, index) => (
                                <HistoryCard key={entry.id} entry={entry} index={index} />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                    <History className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No events found</h3>
                                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter</p>
                            </div>
                        )}
                    </div>

                    {/* Desktop View - Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
                                    <th className="text-left py-4 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm">Event</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm">User</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm">Details</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm">Time</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                                {paginatedHistory.length > 0 ? (
                                    paginatedHistory.map((entry, index) => {
                                        const config = getActionConfig(entry.actionName);
                                        const ActionIcon = config.icon;

                                        return (
                                            <motion.tr
                                                key={entry.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center`}>
                                                            <ActionIcon className={`w-5 h-5 ${config.color}`} />
                                                        </div>
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${config.bgColor} ${config.color}`}>
                                                            {config.label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-medium text-sm">
                                                            {entry.user.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {entry.user}
                                                            </p>
                                                            {entry.ipAddress && (
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    IP: {entry.ipAddress}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                                        {entry.details || '-'}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                                {formatTimeShort(entry.actionTime)}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {formatTimeRelative(entry.actionTime)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem className="flex items-center gap-2">
                                                                <Eye className="w-4 h-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2">
                                                                <Download className="w-4 h-4" />
                                                                Export Entry
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                                                <AlertCircle className="w-4 h-4" />
                                                                Report Issue
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-16 text-center">
                                            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                                <History className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No events found</h3>
                                            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredHistory.length > itemsPerPage && (
                        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing <span className="font-medium text-gray-700 dark:text-gray-300">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {Math.min(currentPage * itemsPerPage, filteredHistory.length)}
                                    </span>{' '}
                                    of <span className="font-medium text-gray-700 dark:text-gray-300">{filteredHistory.length}</span> events
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="border-gray-200 dark:border-slate-700"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                                    currentPage === page
                                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="border-gray-200 dark:border-slate-700"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 dark:from-orange-500/20 dark:via-amber-500/20 dark:to-orange-500/20 border border-orange-200/50 dark:border-orange-500/30"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                Activity logs are retained for 90 days
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Export your history regularly for compliance and long-term record keeping. Enterprise plans include extended retention.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="border-orange-300 dark:border-orange-500/50 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Upgrade Plan
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AccountHistoryDashboard;