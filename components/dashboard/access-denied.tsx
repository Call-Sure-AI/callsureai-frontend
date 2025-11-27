// components\dashboard\access-denied.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AccessDenied({ redirectPath = "/dashboard" }) {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const redirectTimer = setTimeout(() => {
            router.push(redirectPath);
        }, 5000);

        const countdownTimer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => {
            clearTimeout(redirectTimer);
            clearInterval(countdownTimer);
        };
    }, [redirectPath, router]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#030712] dark:via-[#0a0f1e] dark:to-[#030712]">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-red-200/30 to-orange-200/30 dark:from-red-500/10 dark:to-orange-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-slate-800/50 overflow-hidden">
                    {/* Top gradient line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />

                    <div className="p-8">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", duration: 0.8 }}
                                className="relative"
                            >
                                {/* Rotating ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 w-24 h-24 rounded-2xl border-2 border-dashed border-red-500/30"
                                />
                                
                                {/* Main icon */}
                                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-xl shadow-red-500/30 m-2">
                                    <Lock className="w-10 h-10 text-white" />
                                </div>
                            </motion.div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                            Access Denied
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                            You don&apos;t have permission to access this page
                        </p>

                        {/* Countdown */}
                        <div className="bg-gray-100 dark:bg-slate-800/50 rounded-xl p-4 mb-6 text-center">
                            <div className="flex items-center justify-center gap-3">
                                <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    Redirecting in{" "}
                                    <span className="font-bold text-red-500">{countdown}</span>
                                    {" "}seconds
                                </p>
                            </div>
                            {/* Progress bar */}
                            <div className="mt-3 h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 5, ease: "linear" }}
                                    className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                                />
                            </div>
                        </div>

                        {/* Button */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                onClick={() => router.push(redirectPath)}
                                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Return to Dashboard
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}