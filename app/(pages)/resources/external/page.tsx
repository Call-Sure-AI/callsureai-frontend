"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon } from 'lucide-react';

const ExternalPage: React.FC = () => {
    return (
        <div className="relative min-h-screen py-24 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
            {/* Background decoration */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 dark:bg-green-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-3xl" />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-6"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-md" />
                            <div className="relative bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 backdrop-blur-sm border border-green-200/50 dark:border-green-800/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                                <LinkIcon className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                <span className="text-xs font-semibold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent tracking-wider">
                                    EXTERNAL RESOURCES
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
                    >
                        <motion.span
                            initial={{ backgroundPosition: "0% 50%" }}
                            animate={{ backgroundPosition: "100% 50%" }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            className="inline-block bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 dark:from-green-400 dark:via-emerald-400 dark:to-green-400 bg-clip-text text-transparent"
                            style={{ backgroundSize: "200% auto" }}
                        >
                            External Resources
                        </motion.span>
                    </motion.h1>
                </motion.div>

                {/* Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative group"
                >
                    {/* Card glow */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-50" />
                    
                    <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-3xl p-12 text-center">
                        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 shadow-lg">
                            <LinkIcon className="w-10 h-10 text-white" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Coming Soon
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            We&apos;re curating a list of helpful third-party tools and resources to enhance your experience.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ExternalPage;