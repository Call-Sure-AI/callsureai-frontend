// app/dashboard/agent-performance/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  CheckCircle2, 
  Clock, 
  Filter, 
  HelpCircle, 
  LineChart as LineChartIcon,
  Search,
  Sparkles,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Bot,
  Users,
  RefreshCw,
  WifiOff
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useDashboardMetrics, defaults } from '@/contexts/dashboard-metrics-context';

// Mock data for charts not yet supported by backend
const issueResolutionData = [
  { name: 'Technical', ai: 245, human: 123 },
  { name: 'Billing', ai: 178, human: 156 },
  { name: 'Product', ai: 210, human: 90 },
  { name: 'Account', ai: 190, human: 110 },
  { name: 'Other', ai: 160, human: 130 },
];

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b'];

// Connection Status Component
const ConnectionStatus = ({ status, lastUpdate }: { status: string; lastUpdate: Date | null }) => {
    const isConnected = status === 'connected';
    
    return (
        <div className="flex items-center gap-2 text-xs">
            {isConnected ? (
                <>
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-medium">Live</span>
                </>
            ) : status === 'connecting' || status === 'reconnecting' ? (
                <>
                    <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" />
                    <span className="text-amber-600 dark:text-amber-400">Connecting...</span>
                </>
            ) : (
                <>
                    <WifiOff className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400">Offline</span>
                </>
            )}
        </div>
    );
};

// Stat Card Component
const StatCard = ({ title, value, change, icon: Icon, iconColor, iconBg }: {
  title: string;
  value: string;
  change: string;
  icon: any;
  iconColor: string;
  iconBg: string;
}) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ duration: 0.2 }}
    className="group"
  >
    <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 hover:border-cyan-500/30 shadow-lg hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shadow-lg`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
        <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
          <TrendingUp className="w-4 h-4" />
          {change}
        </p>
      </CardContent>
    </Card>
  </motion.div>
);

// Chart Card Component
const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">{title}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-50 dark:hover:bg-cyan-500/10">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-50 dark:hover:bg-cyan-500/10">
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  </motion.div>
);

const AgentPerformanceDashboard: React.FC = () => {
  // 🔥 Get real-time data from WebSocket
  const { 
    agentPerformance, 
    agentPerformanceStatus, 
    lastUpdate,
    refreshAll,
    period,
    setPeriod
  } = useDashboardMetrics();

  const [timeRange, setTimeRange] = useState('month');
  const [agentFilter, setAgentFilter] = useState('all');
  
  // Use WebSocket data or fallback to defaults
  const wsData = agentPerformance || defaults.agentPerformance;
  
  // Prepare chart data
  const performanceData = useMemo(() => {
    return wsData.performanceData.length > 0 ? wsData.performanceData : [];
  }, [wsData.performanceData]);
  
  const agentEfficiencyData = useMemo(() => {
    return wsData.agentEfficiency.map((agent, index) => ({
      name: agent.name,
      calls: agent.callsHandled,
      resolution: agent.resolutionRate,
    }));
  }, [wsData.agentEfficiency]);
  
  const qualityScoresData = useMemo(() => {
    return [
      { name: 'Script Adherence', value: wsData.qaScores.scriptAdherence },
      { name: 'Accuracy', value: wsData.qaScores.accuracy },
      { name: 'Compliance', value: wsData.qaScores.compliance },
      { name: 'Customer Satisfaction', value: wsData.qaScores.customerSatisfaction },
    ];
  }, [wsData.qaScores]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Agent Performance
            </span>
            <span className="text-gray-900 dark:text-white ml-2">Dashboard</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and optimize your AI agent efficiency</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <ConnectionStatus status={agentPerformanceStatus} lastUpdate={lastUpdate} />
          
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-gray-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-gray-200 dark:border-slate-700">
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className="w-[150px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-gray-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20">
                <SelectValue placeholder="Filter Agents" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-gray-200 dark:border-slate-700">
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="ai">AI Agents Only</SelectItem>
                <SelectItem value="human">Human Agents Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={refreshAll}
              className="bg-white/80 dark:bg-slate-800/80 border-gray-200 dark:border-slate-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <Input
                placeholder="Search agents..."
                className="pl-10 pr-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-gray-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div variants={itemVariants}>
          <StatCard
            title="Overall Success Rate"
            value={`${wsData.stats.overallSuccessRate.toFixed(1)}%`}
            change="+2.3% from last month"
            icon={CheckCircle2}
            iconColor="text-white"
            iconBg="bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            title="Average Handle Time"
            value={wsData.stats.averageHandleTime}
            change="-18s from target"
            icon={Clock}
            iconColor="text-white"
            iconBg="bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            title="First-Call Resolution"
            value={wsData.stats.firstCallResolution.toLocaleString()}
            change="+5.1% from last month"
            icon={Sparkles}
            iconColor="text-white"
            iconBg="bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            title="Quality Score"
            value={`${(wsData.stats.qualityScore / 20).toFixed(1)}/5.0`} 
            change="+0.3 from last month"
            icon={UserCheck}
            iconColor="text-white"
            iconBg="bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/30"
          />
        </motion.div>
      </div>

      {/* Charts Section - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div variants={itemVariants}>
          <ChartCard title="AI vs Human Success Rate">
            <div className="h-[300px]">
              {performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, '']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.95)', 
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="aiSuccess"
                      name="AI Success"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#06b6d4' }}
                      activeDot={{ r: 6, fill: '#06b6d4' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="humanSuccess"
                      name="Human Success"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#8b5cf6' }}
                      activeDot={{ r: 6, fill: '#8b5cf6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No performance data available
                </div>
              )}
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ChartCard title="Issue Resolution by Type">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={issueResolutionData} barSize={24} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.95)', 
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="ai" name="AI Resolved" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="human" name="Human Resolved" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>
      </div>

      {/* Charts Section - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div variants={itemVariants}>
          <ChartCard title="Agent Efficiency Metrics">
            <div className="h-[300px]">
              {agentEfficiencyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={agentEfficiencyData} barSize={20} barGap={8} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" />
                    <XAxis type="number" stroke="#9ca3af" />
                    <YAxis type="category" dataKey="name" width={100} stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.95)', 
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="calls" name="Calls Handled" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="resolution" name="Resolution Rate (%)" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No agent efficiency data available
                </div>
              )}
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ChartCard title="Quality Assurance Scores">
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={qualityScoresData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={4}
                  >
                    {qualityScoresData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Score']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.95)', 
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>
      </div>

      {/* Agent Performance Table */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg overflow-hidden">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Agent Performance Details</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-50 dark:hover:bg-cyan-500/10">
                  <LineChartIcon className="w-4 h-4 mr-1" />
                  View Trends
                </Button>
                <Button variant="outline" size="sm" className="bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-50 dark:hover:bg-cyan-500/10">
                  <BarChart className="w-4 h-4 mr-1" />
                  Compare
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="py-4 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">Agent Name</th>
                    <th className="py-4 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">Type</th>
                    <th className="py-4 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">Calls Handled</th>
                    <th className="py-4 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">Resolution Rate</th>
                    <th className="py-4 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {wsData.agentEfficiency.map((agent, i) => (
                    <motion.tr 
                      key={agent.agentId} 
                      className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{agent.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400">
                          AI
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300 font-medium">{agent.callsHandled}</td>
                      <td className="py-4 px-4">
                        <span className="text-gray-900 dark:text-white font-semibold">{agent.resolutionRate.toFixed(1)}%</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                            <TrendingUp className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium text-sm">Improving</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {wsData.agentEfficiency.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        No agent data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AgentPerformanceDashboard;