// components\dashboard\alert-message.tsx
"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Building2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export const AlertMessage = () => {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
        >
            <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-slate-800/50 overflow-hidden">
                {/* Top gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />
                
                {/* Glow effects */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full blur-3xl" />

                <div className="relative p-6">
                    {/* Icon and Header */}
                    <div className="flex items-start gap-4 mb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="flex-shrink-0"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/25">
                                <AlertCircle className="h-6 w-6 text-white" />
                            </div>
                        </motion.div>
                        <div>
                            <motion.h3
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg font-bold text-gray-900 dark:text-white"
                            >
                                Company Details Required
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                            >
                                Please complete your company profile to access the dashboard
                            </motion.p>
                        </div>
                    </div>

                    {/* Alert Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-500/10 dark:to-orange-500/10 border border-red-200/50 dark:border-red-500/20 rounded-xl p-4 mb-6"
                    >
                        <div className="flex items-start gap-3">
                            <Building2 className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-300">
                                Your company details are missing. Please update your profile to continue using the dashboard features.
                            </p>
                        </div>
                    </motion.div>

                    {/* Action Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/profile-section')}
                        className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-red-500/25 transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                        <span>Update Company Details</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    {/* Footer Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                    >
                        <Sparkles className="w-3 h-3" />
                        <span>Required for full dashboard access</span>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};