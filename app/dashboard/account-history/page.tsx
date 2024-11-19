"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Download, Search, Clock, User, Filter } from 'lucide-react';
import { HistoryEntry } from '@/types';

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
    };

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
    };

    const filteredHistory = historyData.filter(entry =>
        entry.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.actionName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="ml-12 min-h-screen bg-gray-50 p-8">
            <motion.div
                className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white">
                    <div className="flex w-full gap-2 flex-col md:flex-row justify-between items-center">
                        <div>
                            <motion.h1
                                className="text-lg md:text-3xl font-bold mb-2 flex items-center gap-3"
                                variants={itemVariants}
                            >
                                <History size={28} />
                                Account History
                            </motion.h1>
                            <motion.p
                                className="text-xs md:text-md text-blue-100"
                                variants={itemVariants}
                            >
                                Track all account activities and changes
                            </motion.p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-blue-600 text-xs md:text-md px-2 py-1 md:px-4 md:py-2 rounded-lg flex items-center gap-2 hover:bg-blue-50 transition-colors duration-200"
                        >
                            <Download size={20} />
                            Export History
                        </motion.button>
                    </div>
                </div>

                <div className="p-8">
                    {/* Search and Filter Section */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <motion.div
                            className="flex-1 relative"
                            variants={itemVariants}
                        >
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by user or action..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </motion.div>
                        <motion.div
                            className="relative"
                            variants={itemVariants}
                        >
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                className="pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer min-w-[200px]"
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value)}
                            >
                                <option value="all">All Actions</option>
                                <option value="create">Create Actions</option>
                                <option value="update">Update Actions</option>
                                <option value="delete">Delete Actions</option>
                            </select>
                        </motion.div>
                    </div>

                    {/* History Table */}
                    <motion.div
                        className="overflow-x-auto"
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
                                                {entry.actionName}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-gray-400" />
                                                {entry.actionTime}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>

                    {filteredHistory.length === 0 && (
                        <motion.div
                            className="text-center py-8 text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            No history entries found matching your search.
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AccountHistoryDashboard;