// components\dashboard\sidebar.tsx
"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
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
    ChevronUpIcon,
    ChevronDownIcon,
    Settings,
    TicketIcon,
    ShieldAlert,
    Clock1Icon,
    MessageSquare,
    CalendarIcon,
    Target
} from "lucide-react";
import Link from 'next/link';

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

    if (hour >= 5 && hour < 12) {
        return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
        return 'Good Afternoon';
    } else {
        return 'Good Evening';
    }
};

const Navigation: React.FC = () => {
    const { user } = useCurrentUser() as { user: User | null };
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const [openSections, setOpenSections] = useState<OpenSections>({
        conversations: false,
        callAnalytics: false,
        userAccess: false,
        settings: false
    });

    const toggleSection = useCallback((section: string): void => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    }, []);

    const menuStructure: MenuItem[] = [
        {
            id: "dashboard",
            icon: <HomeIcon className="w-4 h-4" />,
            label: "Dashboard",
            link: "/dashboard",
            isDropdown: false,
            showMenu: true
        },
        {
            id: "campaigns",
            icon: <Target className="w-4 h-4" />,
            label: "Campaigns",
            link: "/campaigns",
            isDropdown: false,
            showMenu: true
        },
        {
            id: "conversation-history",
            label: "Conversations",
            link: "/dashboard/conversation-history",
            icon: <Clock1Icon className="w-4 h-4" />,
            isDropdown: false,
            showMenu: true
        },
        {
            id: "tickets",
            icon: <TicketIcon className="w-4 h-4" />,
            label: "Tickets",
            link: "/tickets",
            isDropdown: false,
            showMenu: true
        },
        {
            id: "bookings",
            icon: <CalendarIcon className="w-4 h-4" />,
            label: "Bookings",
            link: "/bookings",
            isDropdown: false,
            showMenu: true
        },
        {
            id: "callAnalytics",
            icon: <BarChart3Icon className="w-4 h-4" />,
            label: "Call Analytics",
            isDropdown: true,
            items: [
                { id: "agent-performance", label: "Agent Performance", link: "/dashboard/agent-performance", icon: <ShieldAlert className="w-4 h-4" /> },
                { id: "call-reports", label: "Call Reports", link: "/dashboard/call-reports", icon: <MessageSquare className="w-4 h-4" /> },
                { id: "sentiment-analysis", label: "Sentiment Analysis", link: "/dashboard/sentiment-analysis", icon: <MessageSquare className="w-4 h-4" /> },
                { id: "urgency-detection", label: "Urgency Detection", link: "/dashboard/urgency-detection", icon: <MessageSquare className="w-4 h-4" /> }
            ],
            showMenu: user?.role === "admin"
        },
        {
            id: "userAccess",
            icon: <UsersIcon className="w-4 h-4" />,
            label: "Access Management",
            isDropdown: true,
            items: [
                { id: "access-manager", label: "Access Manager", link: "/dashboard/access-manager", icon: <UsersIcon className="w-4 h-4" /> },
                { id: "account-history", label: "Account History", link: "/dashboard/account-history", icon: <UsersIcon className="w-4 h-4" /> }
            ],
            showMenu: user?.role === "admin"
        },
        {
            id: "settings",
            icon: <Settings className="w-4 h-4" />,
            label: "Settings",
            isDropdown: true,
            items: [
                { id: "profile", label: "Profile", link: "/profile-section", icon: <UserIcon className="w-4 h-4" /> },
                { id: "payment", label: "Payment", link: "/payments-section", icon: <CreditCardIcon className="w-4 h-4" /> },
                { id: "security", label: "Security & Compliance", link: "/security", icon: <ShieldAlert className="w-4 h-4" /> }
            ],
            showMenu: true
        },
        {
            id: "integration",
            icon: <LinkIcon className="w-4 h-4" />,
            label: "Integration",
            link: "/dashboard/integration",
            isDropdown: false,
            showMenu: true
        },
        {
            id: "help",
            icon: <LifeBuoyIcon className="w-4 h-4" />,
            label: "Help & Support",
            link: "/dashboard/help",
            isDropdown: false,
            showMenu: true
        }
    ];

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

    const Icon: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => (
        <div className="relative w-8 h-8 flex items-center justify-center">
            <span className="relative z-10">{children}</span>
        </div>
    ));

    const SmallIcon: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => (
        <div className="relative w-6 h-6 flex items-center justify-center">
            <span className="relative z-10 text-xs">{children}</span>
        </div>
    ));

    const DesktopDropdownSection: React.FC<{
        item: MenuItem
    }> = React.memo(({ item }) => {
        const isOpen = openSections[item.id];

        return (
            <>
                <Button
                    variant="ghost"
                    className="w-full justify-between text-gray-800 hover:text-[#0A1E4E] hover:bg-gray-200"
                    onClick={() => toggleSection(item.id)}
                >
                    <div className="flex items-center">
                        <Icon>{item.icon}</Icon>
                        <span className="ml-2 truncate">{item.label}</span>
                    </div>
                    {isOpen ? (
                        <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                    )}
                </Button>

                <AnimatePresence initial={false} mode="wait">
                    {isOpen && item.items && (
                        <motion.div
                            key={`${item.id}-dropdown-desktop`}
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="space-y-2 pl-10 overflow-hidden"
                        >
                            {item.items.map((subItem) => (
                                <motion.div
                                    key={subItem.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link href={subItem.link}>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-gray-800 hover:text-[#0A1E4E] hover:bg-gray-200"
                                        >
                                            <SmallIcon>{subItem.icon}</SmallIcon>
                                            <span className="ml-2 truncate">{subItem.label}</span>
                                        </Button>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </>
        );
    });

    const MobileDropdownSection: React.FC<{
        item: MenuItem,
        onItemClick?: () => void
    }> = React.memo(({ item, onItemClick }) => {
        const isOpen = openSections[item.id];

        return (
            <div className="space-y-2">
                <Button
                    variant="ghost"
                    className="w-full justify-between text-gray-800 hover:bg-gray-100"
                    onClick={() => toggleSection(item.id)}
                >
                    <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                    </div>
                    {isOpen ? (
                        <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                    )}
                </Button>

                <AnimatePresence>
                    {isOpen && item.items && (
                        <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="space-y-1 pl-8"
                        >
                            {item.items.map((subItem) => (
                                <Link
                                    key={subItem.id}
                                    href={subItem.link}
                                    onClick={onItemClick}
                                >
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-gray-600 hover:text-[#0A1E4E] hover:bg-gray-50"
                                    >
                                        {subItem.icon}
                                        <span className="ml-3">{subItem.label}</span>
                                    </Button>
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    });

    const RegularMenuItem: React.FC<{
        item: MenuItem | SubMenuItem,
        isMobile?: boolean,
        isCollapsed?: boolean,
        onItemClick?: () => void
    }> = React.memo(({ item, isMobile = false, isCollapsed = false, onItemClick }) => (
        <Link
            href={'link' in item ? (item.link || "#") : "#"}
            onClick={onItemClick}
        >
            <Button
                variant="ghost"
                className={`w-full justify-start text-gray-800 hover:text-[#0A1E4E] hover:bg-${isMobile ? 'gray-100' : 'gray-200'} ${isCollapsed ? "px-2" : ""}`}
            >
                {isMobile ? (
                    <>
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                    </>
                ) : (
                    <>
                        <Icon>{item.icon}</Icon>
                        {!isCollapsed && (
                            <motion.span
                                className="ml-2"
                                variants={contentVariants}
                                initial="visible"
                                animate={isCollapsed ? "hidden" : "visible"}
                            >
                                {item.label}
                            </motion.span>
                        )}
                    </>
                )}
            </Button>
        </Link>
    ));

    const DesktopSidebar: React.FC = () => (
        <motion.div
            initial="expanded"
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            className="relative z-20 bg-white p-4 space-y-6 border-r h-screen hidden lg:block overflow-hidden"
        >
            {!isCollapsed && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 space-y-2 pl-2 flex w-full justify-between items-center border-b-[1px] border-gray-200 pb-4"
                >
                    <h1 className="text-xs text-wrap font-medium text-[#0A1E4E] text-ellipsis md:text-sm">
                        {getTimeBasedGreeting()}, <span className="font-bold">{user?.name || ""}</span>
                    </h1>
                </motion.div>
            )}

            <Button
                variant="ghost"
                size="icon"
                className="absolute -right-3 top-4 w-6 h-6 rounded-full bg-white border shadow-md z-[100] flex items-center justify-center hover:scale-110 transition-transform"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? (
                    <ChevronRightIcon className="w-4 h-4" />
                ) : (
                    <ChevronLeftIcon className="w-4 h-4" />
                )}
            </Button>

            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                {menuStructure.map((item) => (
                    <div key={item.id} className="space-y-2">
                        {item.showMenu ?
                            item.isDropdown ? (
                                <>
                                    {!isCollapsed ? (
                                        <DesktopDropdownSection item={item} />
                                    ) : (
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-gray-800 hover:text-[#0A1E4E] hover:bg-gray-200 px-2"
                                            >
                                                <Icon>{item.icon}</Icon>
                                            </Button>
                                        </motion.div>
                                    )}
                                </>
                            ) : (
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <RegularMenuItem
                                        item={item}
                                        isCollapsed={isCollapsed}
                                    />
                                </motion.div>
                            )
                            : null
                        }
                    </div>
                ))}
            </div>
        </motion.div>
    );

    // Primary mobile navigation items (for bottom bar)
    const primaryMobileItems = [
        menuStructure[0], // Dashboard
        menuStructure[1], // Campaigns  
        menuStructure[2], // Conversations
        menuStructure[3], // Tickets
    ];

    const MobileBottomBar: React.FC = React.memo(() => (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t lg:hidden safe-area-inset-bottom">
            <div className="flex justify-around items-center px-2 py-2">
                {primaryMobileItems.map((item) => (
                    <Link
                        key={item.id}
                        href={item.link || "#"}
                        className="flex-1"
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full flex flex-col items-center p-1 h-auto"
                        >
                            {item.icon}
                            <span className="text-[10px] mt-1 truncate max-w-[60px]">
                                {item.label.split(' ')[0]}
                            </span>
                        </Button>
                    </Link>
                ))}
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 flex flex-col items-center p-1 h-auto"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <MenuIcon className="w-4 h-4" />
                    <span className="text-[10px] mt-1">More</span>
                </Button>
            </div>
        </div>
    ));

    const MobileSlideMenu: React.FC = React.memo(() => {
        if (!isMobileMenuOpen) return null;

        return (
            <div className="fixed inset-0 z-50 lg:hidden">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween', duration: 0.3 }}
                    className="absolute right-0 top-0 h-full w-full max-w-xs bg-white shadow-xl overflow-y-auto"
                >
                    <div className="sticky top-0 bg-white z-10 p-4 border-b">
                        <div className="flex justify-between items-center">
                            <h1 className="text-xl font-bold text-[#0A1E4E]">Menu</h1>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <XIcon className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 pb-20">
                        <div className="space-y-2">
                            {menuStructure.map((item) => (
                                <div key={item.id}>
                                    {item.showMenu && (
                                        item.isDropdown ? (
                                            <MobileDropdownSection
                                                item={item}
                                                onItemClick={() => setIsMobileMenuOpen(false)}
                                            />
                                        ) : (
                                            <RegularMenuItem
                                                item={item}
                                                isMobile={true}
                                                onItemClick={() => setIsMobileMenuOpen(false)}
                                            />
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    });

    const MobileMenu: React.FC = () => {
        return (
            <>
                <MobileBottomBar />
                <AnimatePresence>
                    {isMobileMenuOpen && <MobileSlideMenu />}
                </AnimatePresence>
            </>
        );
    };

    return (
        <>
            <DesktopSidebar />
            <MobileMenu />
        </>
    );
};

export default Navigation;