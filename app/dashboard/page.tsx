"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    HomeIcon,
    UserIcon,
    BarChart3Icon,
    PhoneCallIcon,
    CreditCardIcon,
    UsersIcon,
    ClockIcon,
    LinkIcon,
    LifeBuoyIcon,
    BellIcon,
    PlusCircleIcon,
} from "lucide-react";
import Sidebar from '@/components/sidebar';

const DashboardLayout = () => {
    const menuItems = [
        { icon: <HomeIcon className="w-4 h-4" />, label: 'Home' },
        { icon: <UserIcon className="w-4 h-4" />, label: 'Profile' },
        { icon: <BarChart3Icon className="w-4 h-4" />, label: 'Analytics' },
        { icon: <PhoneCallIcon className="w-4 h-4" />, label: 'Call History' },
        { icon: <CreditCardIcon className="w-4 h-4" />, label: 'Payments' },
    ];

    const accountItems = [
        { icon: <UsersIcon className="w-4 h-4" />, label: 'Access Manager' },
        { icon: <ClockIcon className="w-4 h-4" />, label: 'Account History' },
        { icon: <LinkIcon className="w-4 h-4" />, label: 'Integration' },
        { icon: <LifeBuoyIcon className="w-4 h-4" />, label: 'Reach out to Founders' },
        { icon: <BellIcon className="w-4 h-4" />, label: 'Help' },
    ];

    const statsCards = [
        { label: 'Account Balance', value: '$1,234' },
        { label: 'Total Call Cost', value: '$567' },
        { label: 'Completed Calls', value: '89' },
        { label: 'Total Call Duration', value: '45h' },
    ];

    return (
        <div className="flex h-screen bg-white text-black">
            <Sidebar />

            {/* Main Content */}
            <div className="ml-16 flex-1 p-8 bg-white">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-bold mb-4 text-[#0A1E4E]">Good Afternoon, name</h1>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cold-2 md:grid-cols-4 gap-4 mb-8">
                    {statsCards.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="bg-white transition-colors">
                                <CardContent className="p-4">
                                    <div className="text-sm font-bold text-[#0A1E4E]">{stat.label}</div>
                                    <div className="text-xl font-bold mt-1 text-black">{stat.value}</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Agent Setup Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Card className="bg-white">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold mb-2 text-black">Set up a new agent - Start</h2>
                                    <p className="text-[#0A1E4E]">(Agent flow will work here)</p>
                                </div>
                                <Button className="bg-[#0A1E4E] text-white">
                                    <PlusCircleIcon className="w-4 h-4 mr-2" />
                                    Add Agent
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default DashboardLayout;