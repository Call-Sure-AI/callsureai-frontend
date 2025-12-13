// components\agent\agent-card.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { capitalizeFirstLetter } from "@/utils/capitalize-letter";
import { Activity, Bot, Play, FlaskConical, Sparkles, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { AgentEdit } from "./agent-edit";
import { useRouter } from "next/navigation";
import { AgentFormData } from "@/types";
import { useState } from "react";
import IntegrationDialog from "./integration-dialog";
import { motion } from "framer-motion";

export const Dot = ({ background = 'bg-green-500', glow = 'shadow-green-500/50' }) => (
    <span className="relative flex h-3 w-3">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${background} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-3 w-3 ${background} shadow-lg ${glow}`}></span>
    </span>
);

export const AgentCard = ({ agent }: { agent: any }) => {
    const router = useRouter();
    const [integrationDialogOpen, setIntegrationDialogOpen] = useState(false);

    const handleTestAgent = (agent: AgentFormData) => {
        router.push(`/dashboard/chat?agentId=${agent.id}`);
    };

    const handleIntegrate = () => {
        setIntegrationDialogOpen(true);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group"
            >
                <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 shadow-lg hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 overflow-hidden rounded-2xl">
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <CardContent className="relative p-6">
                        {/* Status indicator */}
                        {agent.is_active && (
                            <div className="absolute top-4 right-4 z-10">
                                <Dot background="bg-emerald-500" glow="shadow-emerald-500/50" />
                            </div>
                        )}

                        <div className="flex flex-col space-y-5">
                            {/* Header Section */}
                            <div className="flex items-start gap-4">
                                {/* Agent Icon */}
                                <motion.div 
                                    className="relative flex-shrink-0"
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    {/* Glow effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                                    
                                    <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[2px] shadow-lg shadow-cyan-500/25">
                                        <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                            <Bot className="w-7 h-7 text-white" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Agent Info */}
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300 truncate">
                                        {agent.name}
                                    </h2>
                                    
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        {agent?.additional_context?.tone && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-lg">
                                                <Sparkles className="w-3 h-3" />
                                                {capitalizeFirstLetter(agent.additional_context.tone)}
                                            </span>
                                        )}
                                        {agent?.additional_context?.gender && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-lg">
                                                {capitalizeFirstLetter(agent.additional_context.gender)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                                    agent.is_active 
                                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                                        : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
                                }`}>
                                    <Activity className={`w-3.5 h-3.5 ${agent.is_active ? 'animate-pulse' : ''}`} />
                                    <span>{agent.is_active ? 'Online' : 'Offline'}</span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent" />

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    {/* Test Button */}
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button
                                            onClick={() => handleTestAgent(agent)}
                                            className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 group/btn"
                                            size="sm"
                                        >
                                            {/* Shimmer effect */}
                                            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                            
                                            <FlaskConical className="w-4 h-4 mr-2 relative z-10" />
                                            <span className="relative z-10">Test Agent</span>
                                        </Button>
                                    </motion.div>

                                    {/* Go Live Button */}
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button
                                            onClick={handleIntegrate}
                                            className="relative overflow-hidden bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-medium px-4 py-2 rounded-xl shadow-lg transition-all duration-300 group/btn"
                                            size="sm"
                                        >
                                            {/* Shimmer effect */}
                                            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-900/20 to-transparent" />
                                            
                                            <Zap className="w-4 h-4 mr-2 relative z-10" />
                                            <span className="relative z-10">Go Live</span>
                                            <Play className="w-3.5 h-3.5 ml-1.5 relative z-10 fill-current" />
                                        </Button>
                                    </motion.div>
                                </div>

                                {/* Edit Button */}
                                <AgentEdit {...agent} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <IntegrationDialog
                open={integrationDialogOpen}
                onOpenChange={setIntegrationDialogOpen}
                agentId={agent.id}
                agentName={agent.name}
            />
        </>
    );
};