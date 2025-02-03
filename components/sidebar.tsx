"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    ChevronRightIcon,
    MenuIcon,
    XIcon,
    ChevronUpIcon,
    ChevronDownIcon
} from "lucide-react";
import Link from 'next/link';

const Navigation = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAccountsOpen, setIsAccountsOpen] = useState(false);

    const menuItems = [
        { icon: <HomeIcon className="w-4 h-4" />, label: 'Home', link: "/dashboard" },
        { icon: <UserIcon className="w-4 h-4" />, label: 'Profile', link: '/dashboard/profile-section' },
        { icon: <BarChart3Icon className="w-4 h-4" />, label: 'Analytics', link: '/dashboard/analytics-dashboard' },
        { icon: <PhoneCallIcon className="w-4 h-4" />, label: 'Call History', link: '/dashboard/call-history-dashboard' },
    ];

    const accountItems = [
        { icon: <LinkIcon className="w-4 h-4" />, label: 'Integration', link: '/dashboard/integration' },
        { icon: <CreditCardIcon className="w-4 h-4" />, label: 'Payments', link: '/dashboard/payments-section' },
        { icon: <LifeBuoyIcon className="w-4 h-4" />, label: 'Help', link: '/dashboard/help' },
    ];

    const accounts = [
        { icon: <UsersIcon className="w-4 h-4" />, label: 'Access Manager', link: '/dashboard/access-manager' },
        { icon: <ClockIcon className="w-4 h-4" />, label: 'Account History', link: '/dashboard/account-history' },
    ]

    const sidebarVariants = {
        expanded: {
            width: "16rem",
            transition: { duration: 0.3 }
        },
        collapsed: {
            width: "4rem",
            transition: { duration: 0.3 }
        }
    };

    const contentVariants = {
        visible: { opacity: 1, x: 0 },
        hidden: { opacity: 0, x: -20 }
    };

    // Desktop Sidebar
    const DesktopSidebar = () => (
        <motion.div
            initial="expanded"
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            className="relative z-20 bg-white p-4 space-y-8 border-r h-screen hidden md:block"
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
                <BellDotIcon className="w-4 h-4 text-[#0A1E4E] cursor-pointer" />
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
                                className={`w-full justify-start text-gray-800 hover:text-[#0A1E4E] hover:bg-gray-200 ${isCollapsed ? "px-2" : ""
                                    }`}
                            >
                                {item.icon}
                                {!isCollapsed && (
                                    <motion.span
                                        variants={contentVariants}
                                        initial="visible"
                                        animate={isCollapsed ? "hidden" : "visible"}
                                        className="ml-2"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </Button>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div>
                {!isCollapsed && (
                    <motion.div
                        variants={contentVariants}
                        initial="visible"
                        animate={isCollapsed ? "hidden" : "visible"}
                        className="space-y-2"
                    >
                        <Button
                            variant="ghost"
                            className="w-full justify-between text-gray-800 hover:text-[#0A1E4E] hover:bg-gray-200"
                            onClick={() => setIsAccountsOpen(!isAccountsOpen)}
                        >
                            <span>Accounts</span>
                            {isAccountsOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                        </Button>
                    </motion.div>
                )}

                <AnimatePresence>
                    {(!isCollapsed && isAccountsOpen) && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-2 pl-2"
                        >
                            {accounts.map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link href={item.link}>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-gray-800 hover:text-[#0A1E4E] hover:bg-gray-200"
                                        >
                                            {item.icon}
                                            <span className="ml-2">{item.label}</span>
                                        </Button>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="space-y-2">
                    {accountItems.map((item, index) => (
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
                                    {!isCollapsed && (
                                        <motion.span
                                            variants={contentVariants}
                                            initial="visible"
                                            animate={isCollapsed ? "hidden" : "visible"}
                                            className="ml-2"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    const MobileMenu = () => (
        <>
            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t md:hidden">
                <div className="flex justify-between items-center px-4 py-2">
                    {menuItems.slice(0, 4).map((item, index) => (
                        <Link key={index} href={item.link}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex flex-col items-center p-2"
                            >
                                {item.icon}
                                <span className="text-xs mt-1">{item.label}</span>
                            </Button>
                        </Link>
                    ))}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex flex-col items-center p-2"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <MenuIcon className="w-4 h-4" />
                        <span className="text-xs mt-1">More</span>
                    </Button>
                </div>
            </div>

            {/* Full Screen Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 bg-white z-50 md:hidden"
                    >
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-8">
                                <h1 className="text-xl font-bold text-[#0A1E4E]">Menu</h1>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <XIcon className="w-6 h-6" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {menuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-gray-800 hover:text-[#0A1E4E] hover:bg-gray-100"
                                        >
                                            {item.icon}
                                            <span className="ml-2">{item.label}</span>
                                        </Button>
                                    </Link>
                                ))}
                                {accounts.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-gray-800 hover:text-[#0A1E4E] hover:bg-gray-100"
                                        >
                                            {item.icon}
                                            <span className="ml-2">{item.label}</span>
                                        </Button>
                                    </Link>
                                ))}

                                {accountItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-gray-800 hover:text-[#0A1E4E] hover:bg-gray-100"
                                        >
                                            {item.icon}
                                            <span className="ml-2">{item.label}</span>
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );

    return (
        <>
            <DesktopSidebar />
            <MobileMenu />
        </>
    );
};

export default Navigation;