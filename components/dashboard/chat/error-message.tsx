// components\dashboard\chat\error-message.tsx
"use client";

import React from 'react';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorMessageProps {
    onBack: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#030712] dark:via-[#0a0f1e] dark:to-[#030712]">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-red-200/30 to-orange-200/30 dark:from-red-500/10 dark:to-orange-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-slate-800/50 p-8 max-w-md text-center">
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-xl shadow-red-500/30"
                    >
                        <AlertCircle className="w-10 h-10 text-white" />
                    </motion.div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Agent ID Missing
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        No agent ID was provided in the URL parameters. Please select an agent from the dashboard.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                            onClick={onBack}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </motion.button>
                        
                        <motion.button
                            onClick={() => window.location.reload()}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Retry
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ErrorMessage;