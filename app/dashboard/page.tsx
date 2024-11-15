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
    BellDotIcon
} from "lucide-react";

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
            {/* Sidebar */}
            <motion.div
                initial={{ x: -800 }}
                animate={{ x: 0 }}
                className="w-64 bg-white p-4 space-y-8 border-r"
            >
                <div className='flex justify-between items-center'>
                    <h1 className="text-xl text-[#0A1E4E] font-bold">Dashboard</h1>
                    <BellDotIcon className="w-4 h-4 text-[#0A1E4E] cursor-pointer" />
                </div>

                {/* Main Menu */}
                <div className="space-y-2">
                    {menuItems.map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-gray-800 hover:text-black hover:bg-gray-200"
                            >
                                {item.icon}
                                <span className="ml-2">{item.label}</span>
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* Accounts Section */}
                <div>
                    <div className="text-sm text-gray-400 mb-2">Accounts</div>
                    <div className="space-y-2">
                        {accountItems.map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-gray-800 hover:text-black hover:bg-gray-200"
                                >
                                    {item.icon}
                                    <span className="ml-2">{item.label}</span>
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 p-8 bg-white">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-bold mb-4 text-[#0A1E4E]">Good Afternoon, name</h1>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {statsCards.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="bg-white hover:bg-[#172d54] transition-colors">
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
                            <div className="flex items-center justify-between">
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