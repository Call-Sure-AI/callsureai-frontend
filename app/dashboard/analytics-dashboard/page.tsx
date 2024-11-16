"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PhoneCall,
    Clock,
    UserCheck,
    BarChart2,
    Users,
    Phone,
    CheckCircle,
    AlertTriangle
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const data = [
    { name: 'Mon', calls: 400 },
    { name: 'Tue', calls: 300 },
    { name: 'Wed', calls: 500 },
    { name: 'Thu', calls: 280 },
    { name: 'Fri', calls: 590 },
    { name: 'Sat', calls: 320 },
    { name: 'Sun', calls: 250 }
];

const AnalyticsDashboard = () => {
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
            className="ml-16 p-8 bg-white"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#0A1E4E]">Call Center Analytics</h1>
                <p className="text-gray-600">Real-time monitoring and performance metrics</p>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div variants={itemVariants}>
                    <Card className="bg-white shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-[#0A1E4E]">Total Calls</CardTitle>
                            <PhoneCall className="w-4 h-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#0A1E4E]">2,847</div>
                            <p className="text-xs text-green-600">+12.5% from last week</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="bg-white shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-[#0A1E4E]">Average Wait Time</CardTitle>
                            <Clock className="w-4 h-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#0A1E4E]">2m 34s</div>
                            <p className="text-xs text-red-600">+45s from target</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="bg-white shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-[#0A1E4E]">Resolution Rate</CardTitle>
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#0A1E4E]">94.2%</div>
                            <p className="text-xs text-green-600">+2.1% from last week</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div variants={itemVariants}>
                    <Card className="bg-white shadow-md">
                        <CardHeader>
                            <CardTitle className="text-[#0A1E4E]">Call Volume Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="calls"
                                            stroke="#0A1E4E"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="bg-white shadow-md">
                        <CardHeader>
                            <CardTitle className="text-[#0A1E4E]">Real-Time Monitoring</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-blue-600" />
                                        <span className="text-[#0A1E4E]">Active Calls</span>
                                    </div>
                                    <span className="font-bold text-[#0A1E4E]">24</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <UserCheck className="w-4 h-4 text-green-600" />
                                        <span className="text-[#0A1E4E]">Available Agents</span>
                                    </div>
                                    <span className="font-bold text-[#0A1E4E]">12</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="w-4 h-4 text-red-600" />
                                        <span className="text-[#0A1E4E]">Alerts</span>
                                    </div>
                                    <span className="font-bold text-[#0A1E4E]">3</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Agent Performance Section */}
            <motion.div variants={itemVariants}>
                <Card className="bg-white shadow-md">
                    <CardHeader>
                        <CardTitle className="text-[#0A1E4E]">Agent Performance Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm text-[#0A1E4E]">Active Agents</span>
                                </div>
                                <div className="text-xl font-bold text-[#0A1E4E]">18/20</div>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm text-[#0A1E4E]">Avg Response Time</span>
                                </div>
                                <div className="text-xl font-bold text-[#0A1E4E]">45s</div>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <BarChart2 className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm text-[#0A1E4E]">Resolution Rate</span>
                                </div>
                                <div className="text-xl font-bold text-[#0A1E4E]">94.2%</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default AnalyticsDashboard;