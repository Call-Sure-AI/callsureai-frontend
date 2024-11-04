"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const IntegrationSection = () => {
    const integrations = [
        { name: 'Salesforce', icon: '☁️', x: "20%", y: "15%" },
        { name: 'Trello', icon: '📋', x: "35%", y: "25%" },
        { name: 'Hubspot', icon: '🎯', x: "15%", y: "45%" },
        { name: 'MailChimp', icon: '✉️', x: "30%", y: "65%" },
        { name: 'Google Drive', icon: '📁', x: "80%", y: "20%" },
        { name: 'Slack', icon: '💬', x: "65%", y: "35%" },
        { name: 'Zapier', icon: '⚡', x: "85%", y: "55%" },
        { name: 'Teams', icon: '👥', x: "70%", y: "75%" },
    ];

    // Define connecting paths
    const paths = [
        "M 20% 15% C 30% 20%, 40% 25%, 50% 50%",
        "M 35% 25% C 40% 35%, 45% 45%, 50% 50%",
        "M 15% 45% C 25% 45%, 35% 48%, 50% 50%",
        "M 30% 65% C 35% 60%, 40% 55%, 50% 50%",
        "M 80% 20% C 70% 25%, 60% 35%, 50% 50%",
        "M 65% 35% C 60% 40%, 55% 45%, 50% 50%",
        "M 85% 55% C 75% 55%, 65% 52%, 50% 50%",
        "M 70% 75% C 65% 65%, 60% 55%, 50% 50%",
    ];

    const containerVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const lineVariants = {
        initial: {
            pathLength: 0,
            opacity: 0
        },
        animate: {
            pathLength: 1,
            opacity: 0.3,
            transition: {
                duration: 1.2,
                ease: "easeInOut"
            }
        }
    };

    const iconVariants = {
        initial: {
            scale: 0,
            opacity: 0
        },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
            }
        },
        hover: {
            scale: 1.1,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <div className="relative w-full max-w-7xl mx-auto px-4 py-20">
            <div className="flex flex-col lg:flex-row items-center gap-12">
                <motion.div
                    className="relative w-full lg:w-1/2 aspect-square"
                    variants={containerVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-slate-50/30 rounded-3xl" />

                    <svg
                        className="absolute inset-0 w-full h-full"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        {paths.map((path, index) => (
                            <motion.path
                                key={index}
                                d={path}
                                stroke="#E2E8F0"
                                strokeWidth="1.5"
                                fill="none"
                                variants={lineVariants}
                                filter="url(#glow)"
                            />
                        ))}
                    </svg>

                    <motion.div
                        variants={iconVariants}
                        className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg flex items-center justify-center z-20"
                    >
                        <div className="text-white text-3xl">≋</div>
                    </motion.div>

                    {integrations.map((integration, index) => (
                        <motion.div
                            key={index}
                            variants={iconVariants}
                            whileHover="hover"
                            className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-md flex items-center justify-center cursor-pointer z-10"
                            style={{
                                left: integration.x,
                                top: integration.y
                            }}
                        >
                            <span className="text-2xl">{integration.icon}</span>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="w-full lg:w-1/2 text-left space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        Connect with Your Favorite Tools
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                        Seamlessly integrate with the apps
                    </h2>

                    <p className="text-lg text-slate-600">
                        Keep everything in sync, automate tasks, and manage your business
                        from a single, unified platform.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium group"
                    >
                        Learn more
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default IntegrationSection;