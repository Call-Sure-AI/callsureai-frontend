"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import {
    CircleIcon,
    GitCommitIcon,
    MessageCircleIcon,
    StarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XIcon,
    ActivityIcon
} from "lucide-react";

const ActivityFeed = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const activities = [
        {
            id: 1,
            type: 'commit',
            title: 'Updated dashboard layout with new responsive design and improved accessibility features',
            timestamp: '2 hours ago',
            user: 'Sarah Chen',
            icon: <GitCommitIcon className="w-4 h-4" />,
        },
        {
            id: 2,
            type: 'comment',
            title: 'Left a comment on pull request #123 regarding the navigation implementation',
            timestamp: '3 hours ago',
            user: 'Mike Johnson',
            icon: <MessageCircleIcon className="w-4 h-4" />,
        },
        {
            id: 3,
            type: 'status',
            title: 'Deployed version 2.0.1 to production environment',
            timestamp: '5 hours ago',
            user: 'Deploy Bot',
            icon: <CircleIcon className="w-4 h-4" />,
        },
        {
            id: 4,
            type: 'star',
            title: 'Starred the project and added it to featured repositories',
            timestamp: 'Yesterday',
            user: 'Alex Williams',
            icon: <StarIcon className="w-4 h-4" />,
        },
    ];

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
        hidden: { opacity: 0, x: 20 }
    };

    const mobileVariants = {
        hidden: { x: "100%" },
        visible: { x: 0 }
    };

    const DesktopView = () => (
        <motion.div
            initial="expanded"
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            className="relative right-0 z-20 bg-white p-4 space-y-8 border-l h-screen hidden md:block"
        >
            <Button
                variant="ghost"
                size="icon"
                className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-white border shadow-md z-50"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? (
                    <ChevronLeftIcon className="w-4 h-4" />
                ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                )}
            </Button>

            {!isCollapsed && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex w-full justify-between items-center"
                >
                    <h1 className="text-sm md:text-lg font-bold text-[#0A1E4E] truncate mr-2">Recent Activity</h1>
                    <ActivityIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                </motion.div>
            )}

            <ActivityList isCollapsed={isCollapsed} />
        </motion.div>
    );

    const MobileView = () => (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(true)}
                className="fixed right-4 top-20 md:hidden bg-white shadow-md rounded-full p-2 z-30"
            >
                <ActivityIcon className="w-5 h-5" />
            </Button>

            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={mobileVariants}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-lg z-50 md:hidden"
                    >
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-lg font-bold text-[#0A1E4E]">Recent Activity</h1>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <XIcon className="w-5 h-5" />
                                </Button>
                            </div>
                            <ActivityList isCollapsed={false} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );

    const ActivityList = ({ isCollapsed }: { isCollapsed: boolean }) => (
        <div className="space-y-2">
            {activities.map((activity, index) => (
                <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        variant="ghost"
                        className={`w-full justify-start text-gray-800 hover:text-[#0A1E4E] hover:bg-gray-200 ${isCollapsed ? "px-2" : ""
                            }`}
                    >
                        <div className="bg-gray-100 p-1 rounded-full flex-shrink-0">
                            {activity.icon}
                        </div>
                        {!isCollapsed && (
                            <motion.div
                                variants={contentVariants}
                                initial="visible"
                                animate={isCollapsed ? "hidden" : "visible"}
                                className="ml-3 text-left min-w-0 flex-1"
                            >
                                <p className="text-sm font-medium truncate">
                                    {activity.title}
                                </p>
                                <div className="flex items-center text-xs text-gray-500 space-x-1 min-w-0">
                                    <span className="truncate">{activity.user}</span>
                                    <span className="flex-shrink-0">•</span>
                                    <span className="truncate flex-shrink-0">{activity.timestamp}</span>
                                </div>
                            </motion.div>
                        )}
                    </Button>
                </motion.div>
            ))}
        </div>
    );

    return (
        <>
            <DesktopView />
            <MobileView />
        </>
    );
};

export default ActivityFeed;