"use client";

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { History, Download, Search, Clock, User, Filter, MoreVertical } from 'lucide-react';
import { HistoryEntry } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AccountHistoryDashboard: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<string>('all');

    const historyData: HistoryEntry[] = [
        {
            id: '1',
            user: 'harsha19555555@gmail.com',
            actionName: 'CREATE_PROJECT',
            actionTime: 'November 5, 2024 3:26 PM'
        },
        {
            id: '2',
            user: 'john.doe@example.com',
            actionName: 'UPDATE_SETTINGS',
            actionTime: 'November 5, 2024 2:15 PM'
        },
        {
            id: '3',
            user: 'sarah.smith@example.com',
            actionName: 'DELETE_DOCUMENT',
            actionTime: 'November 5, 2024 1:45 PM'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    } as Variants;

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    } as Variants;

    const filteredHistory = historyData.filter(entry =>
        entry.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.actionName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatActionName = (action: string) => {
        return action.replace(/_/g, ' ');
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

    // Mobile Card Component for History Entry
    const HistoryCard = ({ entry, index }: { entry: HistoryEntry; index: number }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="mb-3">
                <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 flex-1">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <User size={16} className="text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-700 truncate">
                                    {entry.user}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatTimeShort(entry.actionTime)}
                                </p>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Export Entry</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                            {formatActionName(entry.actionName)}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <motion.div
                className="max-w-6xl mx-auto bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header - Responsive */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6 lg:p-8 text-white">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <motion.h1
                                className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3"
                                variants={itemVariants}
                            >
                                <History className="w-6 h-6 sm:w-7 sm:h-7" />
                                <span className="truncate">Account History</span>
                            </motion.h1>
                            <motion.p
                                className="text-xs sm:text-sm lg:text-base text-blue-100"
                                variants={itemVariants}
                            >
                                Track all account activities and changes
                            </motion.p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-blue-600 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 hover:bg-blue-50 transition-colors duration-200 w-full sm:w-auto justify-center"
                        >
                            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                            Export History
                        </motion.button>
                    </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                    {/* Search and Filter Section - Responsive */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <motion.div
                            className="flex-1 relative"
                            variants={itemVariants}
                        >
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                            <input
                                type="text"
                                placeholder="Search user or action..."
                                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </motion.div>
                        <motion.div
                            className="relative"
                            variants={itemVariants}
                        >
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                            <select
                                className="w-full sm:w-auto pl-9 sm:pl-10 pr-8 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer sm:min-w-[200px]"
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value)}
                            >
                                <option value="all">All Actions</option>
                                <option value="create">Create</option>
                                <option value="update">Update</option>
                                <option value="delete">Delete</option>
                            </select>
                        </motion.div>
                    </div>

                    {/* Mobile View - Cards */}
                    <div className="block lg:hidden">
                        {filteredHistory.map((entry, index) => (
                            <HistoryCard key={entry.id} entry={entry} index={index} />
                        ))}
                    </div>

                    {/* Desktop View - Table */}
                    <motion.div
                        className="hidden lg:block overflow-x-auto"
                        variants={itemVariants}
                    >
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-4 px-4 font-semibold text-gray-600 w-16">#</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <User size={16} />
                                            User
                                        </div>
                                    </th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-600">Action Name</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            Action Time
                                        </div>
                                    </th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-600 w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHistory.map((entry, index) => (
                                    <motion.tr
                                        key={entry.id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <td className="py-4 px-4 text-gray-600">{index + 1}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <User size={16} className="text-blue-600" />
                                                </div>
                                                <span className="text-gray-700">{entry.user}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                                                {formatActionName(entry.actionName)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-gray-400" />
                                                {entry.actionTime}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem>Export Entry</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>

                    {/* Empty State - Responsive */}
                    {filteredHistory.length === 0 && (
                        <motion.div
                            className="text-center py-8 sm:py-12 text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <History className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
                            <p className="text-sm sm:text-base">No history entries found matching your search.</p>
                        </motion.div>
                    )}

                    {/* Mobile Pagination Indicator */}
                    <div className="lg:hidden mt-4 text-center">
                        <p className="text-xs text-gray-500">
                            Showing {filteredHistory.length} of {historyData.length} entries
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AccountHistoryDashboard;