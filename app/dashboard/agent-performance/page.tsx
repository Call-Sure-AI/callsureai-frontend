"use client";

import React, { useState } from 'react';
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
  UserCheck
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

// Mock data for the charts
const performanceData = [
  { date: 'Jan', aiSuccess: 85, humanSuccess: 90 },
  { date: 'Feb', aiSuccess: 87, humanSuccess: 89 },
  { date: 'Mar', aiSuccess: 89, humanSuccess: 88 },
  { date: 'Apr', aiSuccess: 91, humanSuccess: 87 },
  { date: 'May', aiSuccess: 92, humanSuccess: 88 },
  { date: 'Jun', aiSuccess: 93, humanSuccess: 89 },
];

const issueResolutionData = [
  { name: 'Technical', ai: 245, human: 123 },
  { name: 'Billing', ai: 178, human: 156 },
  { name: 'Product', ai: 210, human: 90 },
  { name: 'Account', ai: 190, human: 110 },
  { name: 'Other', ai: 160, human: 130 },
];

const agentEfficiencyData = [
  { name: 'AI Agent 1', calls: 523, resolution: 92 },
  { name: 'AI Agent 2', calls: 489, resolution: 88 },
  { name: 'AI Agent 3', calls: 510, resolution: 90 },
  { name: 'AI Agent 4', calls: 470, resolution: 85 },
  { name: 'AI Agent 5', calls: 505, resolution: 91 },
];

const qualityScoresData = [
  { name: 'Script Adherence', value: 92 },
  { name: 'Accuracy', value: 88 },
  { name: 'Compliance', value: 95 },
  { name: 'Customer Satisfaction', value: 87 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AgentPerformanceDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [agentFilter, setAgentFilter] = useState('all');
  
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
      className="w-full p-8 bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header and filters section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1E4E]">Agent Performance Dashboard</h1>
          <p className="text-gray-600">Monitor and optimize your AI agent efficiency</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter Agents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="ai">AI Agents Only</SelectItem>
                <SelectItem value="human">Human Agents Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search agents..."
              className="pl-9 pr-4 py-2"
            />
          </div>
        </div>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#0A1E4E]">Overall Success Rate</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1E4E]">91.5%</div>
              <p className="text-xs text-emerald-600">+2.3% from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#0A1E4E]">Average Handle Time</CardTitle>
              <Clock className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1E4E]">3m 24s</div>
              <p className="text-xs text-emerald-600">-18s from target</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#0A1E4E]">First-Call Resolution</CardTitle>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1E4E]">1144</div>
              <p className="text-xs text-emerald-600">+5.1% from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#0A1E4E]">Quality Score</CardTitle>
              <UserCheck className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1E4E]">4.8/5.0</div>
              <p className="text-xs text-emerald-600">+0.3 from last month</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-[#0A1E4E]">AI vs Human Success Rate</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[70, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="aiSuccess"
                      name="AI Success"
                      stroke="#0088FE"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="humanSuccess"
                      name="Human Success"
                      stroke="#FF8042"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-[#0A1E4E]">Issue Resolution by Type</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={issueResolutionData}
                    barSize={30}
                    barGap={10}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ai" name="AI Resolved" fill="#0088FE" />
                    <Bar dataKey="human" name="Human Resolved" fill="#FF8042" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-[#0A1E4E]">Agent Efficiency Metrics</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={agentEfficiencyData}
                    barSize={30}
                    barGap={10}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="calls" name="Calls Handled" fill="#0088FE" />
                    <Bar dataKey="resolution" name="Resolution Rate (%)" fill="#00C49F" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-[#0A1E4E]">Quality Assurance Scores</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {qualityScoresData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Agent Performance Details */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-[#0A1E4E]">Agent Performance Details</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <LineChartIcon className="w-4 h-4 mr-1" />
                  View Trends
                </Button>
                <Button variant="outline" size="sm">
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
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-medium text-[#0A1E4E]">Agent Name</th>
                    <th className="py-3 px-4 text-left font-medium text-[#0A1E4E]">Type</th>
                    <th className="py-3 px-4 text-left font-medium text-[#0A1E4E]">Calls Handled</th>
                    <th className="py-3 px-4 text-left font-medium text-[#0A1E4E]">Avg. Handle Time</th>
                    <th className="py-3 px-4 text-left font-medium text-[#0A1E4E]">Resolution Rate</th>
                    <th className="py-3 px-4 text-left font-medium text-[#0A1E4E]">Quality Score</th>
                    <th className="py-3 px-4 text-left font-medium text-[#0A1E4E]">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'AI Agent 1', type: 'AI', calls: 523, time: '2m 45s', resolution: '92%', quality: 4.8, trend: 'up' },
                    { name: 'AI Agent 2', type: 'AI', calls: 489, time: '3m 12s', resolution: '88%', quality: 4.5, trend: 'up' },
                    { name: 'Human Agent 1', type: 'Human', calls: 312, time: '4m 32s', resolution: '90%', quality: 4.7, trend: 'down' },
                    { name: 'AI Agent 3', type: 'AI', calls: 510, time: '2m 58s', resolution: '90%', quality: 4.6, trend: 'up' },
                    { name: 'Human Agent 2', type: 'Human', calls: 289, time: '4m 15s', resolution: '91%', quality: 4.9, trend: 'up' },
                  ].map((agent, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{agent.name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${agent.type === 'AI' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                          {agent.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">{agent.calls}</td>
                      <td className="py-3 px-4">{agent.time}</td>
                      <td className="py-3 px-4">{agent.resolution}</td>
                      <td className="py-3 px-4">{agent.quality}/5.0</td>
                      <td className="py-3 px-4">
                        {agent.trend === 'up' ? (
                          <div className="flex items-center text-emerald-600">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="ml-1">Improving</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="ml-1">Declining</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
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