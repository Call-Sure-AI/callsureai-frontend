// components/dashboard/sidebar.tsx
"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from "@/components/ui/button";
import {
    HomeIcon,
    UserIcon,
    BarChart3Icon,
    CreditCardIcon,
    UsersIcon,
    LinkIcon,
    LifeBuoyIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MenuIcon,
    XIcon,
    ChevronDownIcon,
    Settings,
    TicketIcon,
    ShieldAlert,
    Clock1Icon,
    MessageSquare,
    CalendarIcon,
    Target,
    Sparkles,
    Bot,
    PhoneIcon  // Added for Phone Numbers
} from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { User } from '@/types';

interface MenuItem {
    id: string;
    icon: React.ReactNode;
    label: string;
    link?: string;
    isDropdown?: boolean;
    items?: SubMenuItem[];
    showMenu?: boolean;
}

interface SubMenuItem {
    id: string;
    label: string;
    link: string;
    icon: React.ReactNode;
}

interface OpenSections {
    [key: string]: boolean;
}

const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    return 'Good Evening';
};

const Navigation: React.FC = () => {
    const { user } = useCurrentUser() as { user: User | null };
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [openSections, setOpenSections] = useState<OpenSections>({});

    const toggleSection = useCallback((section: string): void => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    }, []);

    const isActive = (link?: string) => link && pathname === link;

    const menuStructure: MenuItem[] = [
        { id: "dashboard", icon: <HomeIcon className="w-5 h-5" />, label: "Dashboard", link: "/dashboard", showMenu: true },
        { id: "agents", icon: <Bot className="w-5 h-5" />, label: "Agents", link: "/dashboard/agents", showMenu: true },
        { id: "campaigns", icon: <Target className="w-5 h-5" />, label: "Campaigns", link: "/campaigns", showMenu: true },
        { id: "conversation-history", label: "Conversations", link: "/dashboard/conversation-history", icon: <Clock1Icon className="w-5 h-5" />, showMenu: true },
        { id: "tickets", icon: <TicketIcon className="w-5 h-5" />, label: "Tickets", link: "/tickets", showMenu: true },
        { id: "bookings", icon: <CalendarIcon className="w-5 h-5" />, label: "Bookings", link: "/bookings", showMenu: true },
        // ✅ NEW: Phone Numbers navigation item
        { id: "phone-numbers", icon: <PhoneIcon className="w-5 h-5" />, label: "Phone Numbers", link: "/phone-numbers", showMenu: true },
        {
            id: "callAnalytics", icon: <BarChart3Icon className="w-5 h-5" />, label: "Call Analytics", isDropdown: true,
            items: [
                { id: "agent-performance", label: "Agent Performance", link: "/dashboard/agent-performance", icon: <ShieldAlert className="w-4 h-4" /> },
                { id: "call-reports", label: "Call Reports", link: "/dashboard/call-reports", icon: <MessageSquare className="w-4 h-4" /> },
                { id: "sentiment-analysis", label: "Sentiment Analysis", link: "/dashboard/sentiment-analysis", icon: <MessageSquare className="w-4 h-4" /> },
                { id: "urgency-detection", label: "Urgency Detection", link: "/dashboard/urgency-detection", icon: <MessageSquare className="w-4 h-4" /> }
            ],
            showMenu: user?.role === "admin"
        },
        {
            id: "userAccess", icon: <UsersIcon className="w-5 h-5" />, label: "Access Management", isDropdown: true,
            items: [
                { id: "access-manager", label: "Access Manager", link: "/dashboard/access-manager", icon: <UsersIcon className="w-4 h-4" /> },
                { id: "account-history", label: "Account History", link: "/dashboard/account-history", icon: <UsersIcon className="w-4 h-4" /> }
            ],
            showMenu: user?.role === "admin"
        },
        {
            id: "settings", icon: <Settings className="w-5 h-5" />, label: "Settings", isDropdown: true,
            items: [
                { id: "profile", label: "Profile", link: "/profile-section", icon: <UserIcon className="w-4 h-4" /> },
                { id: "payment", label: "Payment", link: "/payments-section", icon: <CreditCardIcon className="w-4 h-4" /> },
                { id: "security", label: "Security & Compliance", link: "/security", icon: <ShieldAlert className="w-4 h-4" /> }
            ],
            showMenu: true
        },
        { id: "integration", icon: <LinkIcon className="w-5 h-5" />, label: "Integration", link: "/dashboard/integration", showMenu: true },
        { id: "help", icon: <LifeBuoyIcon className="w-5 h-5" />, label: "Help & Support", link: "/dashboard/help", showMenu: true }
    ];

    const NavItem = ({ item, collapsed = false, onClose }: { item: MenuItem; collapsed?: boolean; mobile?: boolean; onClose?: () => void }) => {
        const active = isActive(item.link);
        
        if (item.isDropdown) {
            const isOpen = openSections[item.id];
            return (
                <div className="space-y-1">
                    <button
                        onClick={() => toggleSection(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                            isOpen 
                                ? 'bg-cyan-500/10 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800/50'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={isOpen ? 'text-cyan-500' : ''}>{item.icon}</span>
                            {!collapsed && <span className="font-medium">{item.label}</span>}
                        </div>
                        {!collapsed && (
                            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronDownIcon className="w-4 h-4" />
                            </motion.div>
                        )}
                    </button>
                    <AnimatePresence>
                        {isOpen && !collapsed && item.items && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-4 space-y-1"
                            >
                                {item.items.map((sub) => (
                                    <Link key={sub.id} href={sub.link} onClick={onClose}>
                                        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                                            pathname === sub.link
                                                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800/50'
                                        }`}>
                                            {sub.icon}
                                            <span className="text-sm">{sub.label}</span>
                                        </div>
                                    </Link>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            );
        }

        return (
            <Link href={item.link || "#"} onClick={onClose}>
                <motion.div
                    whileHover={{ x: collapsed ? 0 : 4 }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                        active
                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-600 dark:text-cyan-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800/50'
                    }`}
                >
                    <span className={active ? 'text-cyan-500' : ''}>{item.icon}</span>
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                    {active && !collapsed && (
                        <motion.div
                            layoutId="activeIndicator"
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500"
                        />
                    )}
                </motion.div>
            </Link>
        );
    };

    // Desktop Sidebar
    const DesktopSidebar = () => (
        <motion.div
            initial={{ width: "18rem" }}
            animate={{ width: isCollapsed ? "5rem" : "18rem" }}
            transition={{ duration: 0.3 }}
            className="relative z-30 hidden lg:flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-slate-800/50 h-[calc(100vh-64px)] sticky top-16"
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
            >
                {isCollapsed ? <ChevronRightIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : <ChevronLeftIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
            </button>

            {/* User Greeting */}
            {!isCollapsed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 border-b border-gray-200/50 dark:border-slate-800/50"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{getTimeBasedGreeting()}</p>
                            <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">{user?.name || "User"}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700">
                {menuStructure.map((item) => (
                    item.showMenu && <NavItem key={item.id} item={item} collapsed={isCollapsed} />
                ))}
            </div>

            {/* Bottom Card */}
            {!isCollapsed && (
                <div className="p-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-500/20">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">Pro Plan</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Unlock advanced features and analytics</p>
                        <button className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );

    // Mobile Bottom Bar
    const MobileBottomBar = () => {
        const primaryItems = menuStructure.slice(0, 4);
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-slate-800/50 safe-area-pb">
                <div className="flex justify-around items-center px-2 py-2">
                    {primaryItems.map((item) => (
                        <Link key={item.id} href={item.link || "#"} className="flex-1">
                            <div className={`flex flex-col items-center py-2 rounded-xl transition-all ${
                                isActive(item.link) 
                                    ? 'text-cyan-500' 
                                    : 'text-gray-500 dark:text-gray-400'
                            }`}>
                                {item.icon}
                                <span className="text-[10px] mt-1 font-medium">{item.label.split(' ')[0]}</span>
                            </div>
                        </Link>
                    ))}
                    <button onClick={() => setIsMobileMenuOpen(true)} className="flex-1">
                        <div className="flex flex-col items-center py-2 text-gray-500 dark:text-gray-400">
                            <MenuIcon className="w-5 h-5" />
                            <span className="text-[10px] mt-1 font-medium">More</span>
                        </div>
                    </button>
                </div>
            </div>
        );
    };

    // Mobile Slide Menu
    const MobileSlideMenu = () => (
        <AnimatePresence>
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="absolute right-0 top-0 h-full w-full max-w-xs bg-white dark:bg-slate-900 shadow-2xl"
                    >
                        <div className="sticky top-0 bg-white dark:bg-slate-900 z-10 p-4 border-b border-gray-200 dark:border-slate-800">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 pb-24 overflow-y-auto max-h-[calc(100vh-80px)] space-y-1">
                            {menuStructure.map((item) => (
                                item.showMenu && <NavItem key={item.id} item={item} mobile onClose={() => setIsMobileMenuOpen(false)} />
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <DesktopSidebar />
            <MobileBottomBar />
            <MobileSlideMenu />
        </>
    );
};

export default Navigation;