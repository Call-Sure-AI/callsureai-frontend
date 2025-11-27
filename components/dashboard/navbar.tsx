"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { BellDotIcon, Search, Sparkles, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserProfileIcon } from "../auth/user-profile-icon";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Navbar = () => {
    const { user } = useCurrentUser();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch - IMPORTANT!
    useEffect(() => {
        setMounted(true);
    }, []);

    // Use resolvedTheme for system theme detection
    const currentTheme = resolvedTheme || theme;

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 w-full"
        >
            {/* Glassmorphic background */}
            <div className="absolute inset-0 bg-white/80 dark:bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800/50" />
            
            {/* Gradient accent line at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            <div className="relative px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-3 group flex-shrink-0">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="relative"
                        >
                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
                            
                            {/* Logo container with gradient border */}
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/25">
                                <div className="w-full h-full rounded-[10px] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                                    <Image
                                        src="/images/csai_logos/logo_without_text/fulllogo_transparent_nobuffer.png"
                                        alt="Callsure AI Logo"
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Brand name */}
                        <div className="hidden sm:flex items-baseline gap-0.5">
                            <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                                CallSure
                            </span>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">AI</span>
                        </div>
                    </Link>

                    {/* Search Bar - Center */}
                    <div className="flex-1 max-w-2xl mx-4 hidden md:block">
                        <div className="relative group">
                            {/* Glow effect on focus */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-all duration-300" />
                            
                            <div className="relative flex items-center">
                                {/* Search icon */}
                                <div className="absolute left-4 text-gray-400 dark:text-gray-500">
                                    <Search className="w-5 h-5" />
                                </div>
                                
                                {/* Input */}
                                <input
                                    type="search"
                                    placeholder="Search campaigns, scripts, templates..."
                                    className="w-full pl-12 pr-28 py-3 bg-gray-100/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-slate-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200"
                                />
                                
                                {/* Search button */}
                                <div className="absolute right-1.5">
                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
                                    >
                                        <Search className="w-4 h-4" />
                                        <span className="hidden lg:inline">Search</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        
                        {/* Mobile search button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="md:hidden p-2.5 rounded-xl bg-gray-100/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-slate-700/50 hover:border-cyan-500/50 hover:bg-gray-200/80 dark:hover:bg-slate-700/80 transition-all"
                        >
                            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </motion.button>

                        {/* Theme Toggle - Only render after mount to prevent hydration issues */}
                        {mounted && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
                                className="relative p-2.5 rounded-xl bg-gray-100/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-slate-700/50 hover:border-cyan-500/50 hover:bg-gray-200/80 dark:hover:bg-slate-700/80 transition-all group overflow-hidden"
                                title={currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {/* Hover gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300" />
                                
                                {currentTheme === 'dark' ? (
                                    <Sun className="w-5 h-5 text-amber-400 relative z-10" />
                                ) : (
                                    <Moon className="w-5 h-5 text-slate-600 relative z-10" />
                                )}
                            </motion.button>
                        )}

                        {user && user?.email ? (
                            <>
                                {/* Notifications */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative p-2.5 rounded-xl bg-gray-100/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-slate-700/50 hover:border-cyan-500/50 hover:bg-gray-200/80 dark:hover:bg-slate-700/80 transition-all group"
                                >
                                    <BellDotIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-cyan-500 transition-colors" />
                                    
                                    {/* Notification badge with ping animation */}
                                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-cyan-500 to-blue-500" />
                                    </span>
                                </motion.button>

                                {/* User Profile */}
                                <div className="relative">
                                    <UserProfileIcon />
                                </div>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Link href="/auth">
                                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium px-4 sm:px-5 py-2 rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="hidden sm:inline">Sign In</span>
                                    </Button>
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;