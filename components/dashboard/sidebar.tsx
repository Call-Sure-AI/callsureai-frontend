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
    ChevronLeftIcon,
    ChevronRightIcon,
    MenuIcon,
    XIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    BookUser,
    Settings
} from "lucide-react";
import Link from 'next/link';

import { useCurrentUser } from '@/hooks/use-current-user';

const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
        return 'Good Afternoon';
    } else {
        return 'Good Evening';
    }
};

const Navigation = () => {
    const { user } = useCurrentUser();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAccountsOpen, setIsAccountsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const menuItems = [
        { icon: <HomeIcon className="w-4 h-4" />, label: 'Home', link: "/dashboard" },
        { icon: <BarChart3Icon className="w-4 h-4" />, label: 'Analytics', link: '/dashboard/analytics-dashboard' },
        { icon: <PhoneCallIcon className="w-4 h-4" />, label: 'Call History', link: '/dashboard/call-history-dashboard' },
    ];

    const accountItems = [
        { icon: <LinkIcon className="w-4 h-4" />, label: 'Integration', link: '/dashboard/integration' },
        { icon: <LifeBuoyIcon className="w-4 h-4" />, label: 'Help', link: '/dashboard/help' },
    ];

    const settings = [
        { icon: <UserIcon className="w-4 h-4" />, label: 'Profile', link: '/dashboard/profile-section' },
        { icon: <CreditCardIcon className="w-4 h-4" />, label: 'Payments', link: '/dashboard/payments-section' },
    ];

    const accounts = [
        { icon: <UsersIcon className="w-4 h-4" />, label: 'Access Manager', link: '/dashboard/access-manager' },
        { icon: <ClockIcon className="w-4 h-4" />, label: 'Account History', link: '/dashboard/account-history' },
    ];

    const toggleDropdown = (dropdown: string) => {
        if (dropdown === 'accounts') {
            setIsAccountsOpen(!isAccountsOpen);
            if (!isAccountsOpen && isSettingsOpen) {
                setIsSettingsOpen(false);
            }
        } else if (dropdown === 'settings') {
            setIsSettingsOpen(!isSettingsOpen);
            if (!isSettingsOpen && isAccountsOpen) {
                setIsAccountsOpen(false);
            }
        }
    };

    const sidebarVariants = {
        expanded: {
            width: "20rem",
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

    // Improved dropdown animation variants
    const dropdownVariants = {
        hidden: {
            height: 0,
            opacity: 0,
            transition: {
                height: { duration: 0.2 },
                opacity: { duration: 0.1 }
            }
        },
        visible: {
            height: "auto",
            opacity: 1,
            transition: {
                height: { duration: 0.2 },
                opacity: { duration: 0.2, delay: 0.1 }
            }
        }
    };

    const DesktopSidebar = () => (
        <motion.div
            initial="expanded"
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            className="relative z-20 bg-white p-4 space-y-2 border-r h-screen hidden lg:block overflow-hidden"
        >
            {
                !isCollapsed &&
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 space-y-2 pl-2 flex w-full justify-between items-center border-b-[1px] border-gray-200"
                >
                    <h1 className="text-xs text-wrap font-medium mb-4 text-[#0A1E4E] text-ellipsis md:text-sm ">{getTimeBasedGreeting()}, <span className="font-bold">{user?.name}</span></h1>
                </motion.div>
            }
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
                    >
                        <Button
                            variant="ghost"
                            className="w-full justify-between text-gray-800 hover:text-[#0A1E4E] hover:bg-gray-200"
                            onClick={() => toggleDropdown('accounts')}
                        >
                            <div className='flex justify-start items-center'>
                                <BookUser className='w-4 h-4' />
                                <span className='ml-4'>Accounts</span>
                            </div>
                            {isAccountsOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                        </Button>
                    </motion.div>
                )}

                <AnimatePresence initial={false}>
                    {(!isCollapsed && isAccountsOpen) && (
                        <motion.div
                            key="accounts-dropdown"
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="space-y-2 pl-2 overflow-hidden"
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

                {!isCollapsed && (
                    <motion.div
                        variants={contentVariants}
                        initial="visible"
                        animate={isCollapsed ? "hidden" : "visible"}
                    >
                        <Button
                            variant="ghost"
                            className="w-full justify-between text-gray-800 hover:text-[#0A1E4E] hover:bg-gray-200"
                            onClick={() => toggleDropdown('settings')}
                        >
                            <div className='flex justify-start items-center'>
                                <Settings className='w-4 h-4' />
                                <span className='ml-4'>Settings</span>
                            </div>
                            {isSettingsOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                        </Button>
                    </motion.div>
                )}

                <AnimatePresence initial={false}>
                    {(!isCollapsed && isSettingsOpen) && (
                        <motion.div
                            key="settings-dropdown"
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="space-y-2 pl-2 overflow-hidden"
                        >
                            {settings.map((item, index) => (
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

                <div className="space-y-2 mt-2">
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
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t lg:hidden">
                <div className="flex justify-between md:justify-evenly items-center px-4 py-2">
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

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 bg-white z-50 lg:hidden"
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

                                {settings.map((item, index) => (
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