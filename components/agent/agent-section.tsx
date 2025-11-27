// components\agent\agent-section.tsx
"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { AgentFormData } from "@/types";
import { Bot, Plus, Sparkles } from "lucide-react";
import { AgentCard } from "./agent-card";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/button";

export const AgentSection = ({ agents }: { agents: AgentFormData[] }) => {
    const { user } = useCurrentUser();

    if (user && !user.id) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center gap-4">
                    {/* Premium loading spinner */}
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-cyan-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 animate-pulse font-medium">Loading your agents...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {agents.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <div className="flex flex-col items-center justify-center py-12 px-6 bg-gradient-to-br from-gray-50/80 via-white to-gray-50/80 dark:from-slate-800/50 dark:via-slate-800/30 dark:to-slate-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 transition-all duration-300 overflow-hidden group">
                        
                        {/* Background effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
                            <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-500/20 flex items-center justify-center">
                                <Bot className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
                            </div>
                        </motion.div>

                        {/* Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-center mt-4 relative z-10"
                        >
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                No agents yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm max-w-xs">
                                Create your first AI voice agent to start automating calls
                            </p>
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-4 relative z-10"
                        >
                            <Link href="/agent/creation">
                                <Button className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all duration-300 group/btn">
                                    <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                    <Plus className="w-4 h-4 relative z-10" />
                                    <span className="relative z-10">Create First Agent</span>
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    className="space-y-3"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.08
                            }
                        }
                    }}
                >
                    {agents.map((agent) => (
                        <motion.div
                            key={agent.id}
                            variants={{
                                hidden: { opacity: 0, y: 15 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.25 }}
                        >
                            <AgentCard agent={agent} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};