"use client";

import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
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
    BellDotIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from "lucide-react";
import Link from 'next/link';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const menuItems = [
        { icon: <HomeIcon className="w-4 h-4" />, label: 'Home', link: "/dashboard" },
        { icon: <UserIcon className="w-4 h-4" />, label: 'Profile', link: '/profile-section' },
        { icon: <BarChart3Icon className="w-4 h-4" />, label: 'Analytics', link: '/analytics-section' },
        { icon: <PhoneCallIcon className="w-4 h-4" />, label: 'Call History', link: '/call-history-section' },
        { icon: <CreditCardIcon className="w-4 h-4" />, label: 'Payments', link: '/payments-section' },
    ];

    const accountItems = [
        { icon: <UsersIcon className="w-4 h-4" />, label: 'Access Manager' },
        { icon: <ClockIcon className="w-4 h-4" />, label: 'Account History' },
        { icon: <LinkIcon className="w-4 h-4" />, label: 'Integration' },
        { icon: <LifeBuoyIcon className="w-4 h-4" />, label: 'Help' },
    ];

    const sidebarVariants = {
        expanded: {
            width: "16rem",
            transition: {
                duration: 0.3
            }
        },
        collapsed: {
            width: "4rem",
            transition: {
                duration: 0.3
            }
        }
    };

    const contentVariants = {
        visible: { opacity: 1, x: 0 },
        hidden: { opacity: 0, x: -20 }
    };

    return (
        <motion.div
            initial="expanded"
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            className="absolute z-20 bg-white p-4 space-y-8 border-r h-screen"
        >
            <Button
                variant="ghost"
                size="icon"
                className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white border shadow-md z-50"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? (
                    <ChevronRightIcon className="w-4 h-4" />
                ) : (
                    <ChevronLeftIcon className="w-4 h-4" />
                )}
            </Button>

            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && (
                    <motion.h1
                        variants={contentVariants}
                        initial="visible"
                        animate={isCollapsed ? "hidden" : "visible"}
                        className="text-xl text-[#0A1E4E] font-bold"
                    >
                        Dashboard
                    </motion.h1>
                )}
                <motion.div
                    initial={{ scale: 1 }}
                    animate={{
                        scale: isCollapsed ? 1.2 : 1,
                        x: isCollapsed ? 0 : 0
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <BellDotIcon className="w-4 h-4 text-[#0A1E4E] cursor-pointer" />
                </motion.div>
            </div>


            <div className="space-y-2">
                {menuItems.map((item, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link href={item.link}>
                            <Button
                                variant="ghost"
                                className={`w-full justify-start text-gray-800 hover:text-black hover:bg-gray-200 ${isCollapsed ? "px-2" : ""
                                    }`}
                            >
                                {item.icon}
                                <motion.span
                                    variants={contentVariants}
                                    initial="visible"
                                    animate={isCollapsed ? "hidden" : "visible"}
                                    className="ml-2"
                                >
                                    {item.label}
                                </motion.span>
                            </Button>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div>
                <motion.div
                    variants={contentVariants}
                    initial="visible"
                    animate={isCollapsed ? "hidden" : "visible"}
                    className="text-sm text-gray-400 mb-2"
                >
                    Accounts
                </motion.div>
                <div className="space-y-2">
                    {accountItems.map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                variant="ghost"
                                className={`w-full justify-start text-gray-800 hover:text-black hover:bg-gray-200 ${isCollapsed ? "px-2" : ""
                                    }`}
                            >
                                {item.icon}
                                <motion.span
                                    variants={contentVariants}
                                    initial="visible"
                                    animate={isCollapsed ? "hidden" : "visible"}
                                    className="ml-2"
                                >
                                    {item.label}
                                </motion.span>
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;