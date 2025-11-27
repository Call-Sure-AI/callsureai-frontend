"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CircleIcon,
    GitCommitIcon,
    MessageCircleIcon,
    StarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XIcon,
    ActivityIcon,
    Sparkles
} from "lucide-react";
import { useActivities } from '@/contexts/activity-context';
import { getRelativeTime } from '@/utils/time-utils';

const ActivityFeed = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { activities, loading, refreshActivities } = useActivities();

    React.useEffect(() => {
        const interval = setInterval(() => {
            refreshActivities();
        }, 60000);
        return () => clearInterval(interval);
    }, [refreshActivities]);

    const getActivityIcon = (entityType: string) => {
        switch (entityType.toLowerCase()) {
            case 'agent':
                return <GitCommitIcon className="w-4 h-4" />;
            case 'chat':
                return <MessageCircleIcon className="w-4 h-4" />;
            case 'status':
                return <CircleIcon className="w-4 h-4" />;
            default:
                return <StarIcon className="w-4 h-4" />;
        }
    };

    const getActivityColor = (entityType: string) => {
        switch (entityType.toLowerCase()) {
            case 'agent':
                return 'from-cyan-500 to-blue-500';
            case 'chat':
                return 'from-purple-500 to-indigo-500';
            case 'status':
                return 'from-emerald-500 to-green-500';
            default:
                return 'from-orange-500 to-amber-500';
        }
    };

    const ActivityList = ({ isCollapsed }: { isCollapsed: boolean }) => (
        <div 
            className="space-y-2 h-[calc(100vh-180px)] overflow-y-auto"
            style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(100, 116, 139, 0.3) transparent'
            }}
        >
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                    </div>
                </div>
            ) : activities.length === 0 && !isCollapsed ? (
                <div className="text-center py-8">
                    <Sparkles className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No activities yet</p>
                </div>
            ) : (
                activities.map((activity) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: isCollapsed ? 0 : -4 }}
                        className="group"
                    >
                        <div className={`
                            flex items-center gap-3 p-2.5 rounded-xl 
                            bg-white/40 dark:bg-slate-800/40 
                            hover:bg-white/80 dark:hover:bg-slate-800/80 
                            border border-transparent 
                            hover:border-gray-200/50 dark:hover:border-slate-700/50 
                            transition-all cursor-pointer
                            ${isCollapsed ? 'justify-center' : ''}
                        `}>
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getActivityColor(activity.entity_type)} flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/10`}>
                                <span className="text-white">
                                    {getActivityIcon(activity.entity_type)}
                                </span>
                            </div>

                            {/* Content */}
                            {!isCollapsed && (
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {activity.action}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        <span className="truncate max-w-[60px]">{activity.entity_type || 'System'}</span>
                                        <span>•</span>
                                        <span className="flex-shrink-0">{getRelativeTime(activity.created_at!)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    );

    const DesktopView = () => (
        <motion.div
            initial={{ width: "16rem" }}
            animate={{ width: isCollapsed ? "5rem" : "16rem" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative hidden lg:flex flex-col h-[calc(100vh-64px)] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-l border-gray-200/50 dark:border-slate-800/50"
        >
            {/* Collapse Toggle - Inside panel, top area */}
            <div className="absolute top-3 left-1 right-3 flex items-center justify-between z-10">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-7 h-7 rounded-full bg-white/90 dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 transition-all"
                >
                    {isCollapsed ? (
                        <ChevronLeftIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    ) : (
                        <ChevronRightIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    )}
                </button>

                {/* Activity Icon - Always visible */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <ActivityIcon className="w-4 h-4 text-white" />
                </div>
            </div>

            {/* Header Title - Only when expanded */}
            <div className="pt-14 px-3 pb-3 border-b border-gray-200/50 dark:border-slate-800/50">
                {!isCollapsed && (
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Recent Activity
                    </h2>
                )}
            </div>

            {/* Activity List */}
            <div className={`flex-1 overflow-hidden ${isCollapsed ? 'px-2 py-3' : 'p-3'}`}>
                <ActivityList isCollapsed={isCollapsed} />
            </div>
        </motion.div>
    );

    const MobileView = () => (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="fixed right-4 top-24 lg:hidden z-30 w-12 h-12 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg border border-gray-200/50 dark:border-slate-800/50 flex items-center justify-center"
            >
                <ActivityIcon className="w-5 h-5 text-cyan-500" />
            </button>

            {/* Mobile Slide Panel */}
            <AnimatePresence>
                {isMobileOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="absolute right-0 top-0 h-full w-full max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl"
                        >
                            <div className="sticky top-0 p-4 border-b border-gray-200/50 dark:border-slate-800/50 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                        <ActivityIcon className="w-4 h-4 text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Activity</h2>
                                </div>
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <XIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>
                            <div className="p-4">
                                <ActivityList isCollapsed={false} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );

    return (
        <>
            <DesktopView />
            <MobileView />
        </>
    );
};

export default ActivityFeed;