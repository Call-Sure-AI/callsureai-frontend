"use client";

import React from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const data = [
    { day: 'Mon', agent1: 20, agent2: 15, agent3: 10 },
    { day: 'Tue', agent1: 25, agent2: 28, agent3: 12 },
    { day: 'Wed', agent1: 35, agent2: 30, agent3: 20 },
    { day: 'Thu', agent1: 40, agent2: 25, agent3: 25 },
    { day: 'Fri', agent1: 42, agent2: 32, agent3: 30 },
    { day: 'Sat', agent1: 43, agent2: 35, agent3: 32 },
    { day: 'Sun', agent1: 45, agent2: 30, agent3: 35 },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 rounded-xl border border-gray-200/50 dark:border-slate-700/50 shadow-xl">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{entry.value} calls</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// Custom legend component
const CustomLegend = ({ payload }: any) => {
    return (
        <div className="flex items-center justify-center gap-6 mt-4">
            {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                    <div 
                        className="w-3 h-3 rounded-full shadow-lg"
                        style={{ 
                            backgroundColor: entry.color,
                            boxShadow: `0 0 8px ${entry.color}40`
                        }}
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

const AgentPerformanceChart = () => {
    // Calculate totals for stats
    const totalCalls = data.reduce((acc, day) => acc + day.agent1 + day.agent2 + day.agent3, 0);
    const avgCalls = Math.round(totalCalls / 7);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg overflow-hidden">
                {/* Gradient top accent */}
                <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                
                <CardContent className="p-3 lg:p-4 xl:p-5">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-4 mb-3 lg:mb-4">
                        <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-sm lg:text-base xl:text-lg font-bold text-gray-900 dark:text-white">
                                    Agent Performance
                                </h2>
                                <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400">
                                    Calls completed per agent over the week
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-2 lg:gap-3">
                            <div className="px-2 lg:px-3 py-1 lg:py-1.5 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-500/10 dark:to-blue-500/10 rounded-lg border border-cyan-200/50 dark:border-cyan-500/20">
                                <div className="flex items-center gap-1 lg:gap-1.5">
                                    <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-cyan-500" />
                                    <span className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white">{totalCalls}</span>
                                    <span className="text-[9px] lg:text-[10px] text-gray-500 dark:text-gray-400">total</span>
                                </div>
                            </div>
                            <div className="px-2 lg:px-3 py-1 lg:py-1.5 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-500/10 dark:to-indigo-500/10 rounded-lg border border-purple-200/50 dark:border-purple-500/20">
                                <div className="flex items-center gap-1 lg:gap-1.5">
                                    <Activity className="w-3 h-3 lg:w-4 lg:h-4 text-purple-500" />
                                    <span className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white">{avgCalls}</span>
                                    <span className="text-[9px] lg:text-[10px] text-gray-500 dark:text-gray-400">avg/day</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-48 lg:h-64 xl:h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    {/* Gradient for Agent 1 */}
                                    <linearGradient id="gradientAgent1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                    </linearGradient>
                                    {/* Gradient for Agent 2 */}
                                    <linearGradient id="gradientAgent2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                    {/* Gradient for Agent 3 */}
                                    <linearGradient id="gradientAgent3" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                
                                <CartesianGrid 
                                    strokeDasharray="3 3" 
                                    stroke="#e5e7eb" 
                                    className="dark:stroke-slate-700" 
                                    vertical={false}
                                />
                                <XAxis 
                                    dataKey="day" 
                                    stroke="#9ca3af"
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    axisLine={{ stroke: '#e5e7eb' }}
                                    tickLine={false}
                                />
                                <YAxis 
                                    stroke="#9ca3af"
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend content={<CustomLegend />} />
                                
                                {/* Area fills */}
                                <Area
                                    type="monotone"
                                    dataKey="agent1"
                                    stroke="#06b6d4"
                                    fill="url(#gradientAgent1)"
                                    strokeWidth={0}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="agent2"
                                    stroke="#8b5cf6"
                                    fill="url(#gradientAgent2)"
                                    strokeWidth={0}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="agent3"
                                    stroke="#10b981"
                                    fill="url(#gradientAgent3)"
                                    strokeWidth={0}
                                />
                                
                                {/* Lines on top */}
                                <Line
                                    type="monotone"
                                    dataKey="agent1"
                                    stroke="#06b6d4"
                                    name="Agent 1"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="agent2"
                                    stroke="#8b5cf6"
                                    name="Agent 2"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="agent3"
                                    stroke="#10b981"
                                    name="Agent 3"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AgentPerformanceChart;