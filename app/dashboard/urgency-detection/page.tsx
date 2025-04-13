"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  Bell,
//   ArrowUpRight,
  User,
  Phone,
  Tag,
  MessageCircle,
//   BarChart2,
  Clock,
  ChevronUp,
  ChevronDown,
  AlertTriangle
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UrgencyDetectionDashboard = () => {
  const [timeRange, setTimeRange] = useState('last7Days');
  const [urgencyLevel, setUrgencyLevel] = useState('all');

  // Mock data for urgency detection
  const urgencyData = [
    {
      id: 'URG001',
      timestamp: '2025-04-11T14:25:00',
      caller: '+1 (555) 123-4567',
      name: 'John Smith',
      duration: '3m 45s',
      urgencyLevel: 'High',
      triggerPhrases: ['immediately', 'urgent', 'emergency'],
      status: 'Resolved',
      agent: 'AI Agent 2',
      category: 'Technical Issue'
    },
    {
      id: 'URG002',
      timestamp: '2025-04-11T10:12:00',
      caller: '+1 (555) 234-5678',
      name: 'Sarah Johnson',
      duration: '6m 20s',
      urgencyLevel: 'Medium',
      triggerPhrases: ['soon', 'important', 'waiting'],
      status: 'In Progress',
      agent: 'AI Agent 1',
      category: 'Billing Question'
    },
    {
      id: 'URG003',
      timestamp: '2025-04-10T16:48:00',
      caller: '+1 (555) 345-6789',
      name: 'David Williams',
      duration: '8m 10s',
      urgencyLevel: 'High',
      triggerPhrases: ['critical', 'deadline', 'now'],
      status: 'Escalated',
      agent: 'AI Agent 3',
      category: 'Account Access'
    },
    {
      id: 'URG004',
      timestamp: '2025-04-10T11:35:00',
      caller: '+1 (555) 456-7890',
      name: 'Emily Davis',
      duration: '4m 55s',
      urgencyLevel: 'Low',
      triggerPhrases: ['whenever', 'no rush', 'later'],
      status: 'Resolved',
      agent: 'AI Agent 1',
      category: 'General Inquiry'
    }
  ];

  // Stats data
  const statsData = [
    { label: "High Urgency", value: 28, change: "+12%", trend: "up" },
    { label: "Medium Urgency", value: 45, change: "-8%", trend: "down" },
    { label: "Low Urgency", value: 132, change: "+3%", trend: "up" },
    { label: "Avg. Response Time", value: "2m 12s", change: "-15s", trend: "up" }
  ];

  // Categories with urgency distribution
  const categoryData = [
    { category: "Technical Issues", high: 35, medium: 40, low: 25 },
    { category: "Billing Questions", high: 25, medium: 45, low: 30 },
    { category: "Account Access", high: 50, medium: 35, low: 15 },
    { category: "Product Information", high: 15, medium: 30, low: 55 },
    { category: "Service Complaints", high: 65, medium: 25, low: 10 }
  ];

  // Function to get urgency level styling
  const getUrgencyStyle = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get status styling
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
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
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1E4E]">Urgency Detection</h1>
          <p className="text-gray-600">Monitor and respond to high priority customer inquiries</p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-[#0A1E4E] text-[#0A1E4E] hover:bg-[#0A1E4E] hover:text-white"
        >
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        variants={itemVariants}
      >
        {statsData.map((stat, index) => (
          <Card key={index} className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-[#0A1E4E]">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${
                  stat.label.includes('High') ? 'bg-red-50 text-red-500' :
                  stat.label.includes('Medium') ? 'bg-orange-50 text-orange-500' :
                  stat.label.includes('Low') ? 'bg-green-50 text-green-500' :
                  'bg-blue-50 text-blue-500'
                }`}>
                  {stat.label.includes('High') ? <AlertCircle className="w-6 h-6" /> :
                   stat.label.includes('Medium') ? <Bell className="w-6 h-6" /> :
                   stat.label.includes('Low') ? <MessageCircle className="w-6 h-6" /> :
                   <Clock className="w-6 h-6" />}
                </div>
              </div>
              <div className="flex items-center mt-2">
                {stat.trend === 'up' ? (
                  <ChevronUp className={`w-4 h-4 mr-1 ${stat.label.includes('Response') ? 'text-green-500' : 'text-red-500'}`} />
                ) : (
                  <ChevronDown className={`w-4 h-4 mr-1 ${stat.label.includes('Response') ? 'text-red-500' : 'text-green-500'}`} />
                )}
                <p className={`text-xs ${
                  (stat.trend === 'up' && !stat.label.includes('Response')) || 
                  (stat.trend === 'down' && stat.label.includes('Response')) 
                    ? 'text-red-600' : 'text-green-600'
                }`}>
                  {stat.change} from last period
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filter Section */}
      <motion.div
        className="mb-8"
        variants={itemVariants}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by caller, phrase, or case ID"
                  className="pl-10 bg-white border-gray-200"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <SelectValue placeholder="Time Range" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="last7Days">Last 7 Days</SelectItem>
                    <SelectItem value="last30Days">Last 30 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <SelectValue placeholder="Urgency Level" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="high">High Urgency</SelectItem>
                    <SelectItem value="medium">Medium Urgency</SelectItem>
                    <SelectItem value="low">Low Urgency</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </Button>

                <Button variant="primary">Apply</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Analysis */}
      <motion.div
        className="mb-8"
        variants={itemVariants}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Urgency by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm text-gray-500">{item.high + item.medium + item.low} calls</span>
                  </div>
                  <div className="flex h-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-red-500" 
                      style={{ width: `${item.high}%` }}
                      title={`High: ${item.high}%`}
                    ></div>
                    <div 
                      className="bg-orange-400" 
                      style={{ width: `${item.medium}%` }}
                      title={`Medium: ${item.medium}%`}
                    ></div>
                    <div 
                      className="bg-green-400" 
                      style={{ width: `${item.low}%` }}
                      title={`Low: ${item.low}%`}
                    ></div>
                  </div>
                  <div className="flex text-xs justify-between">
                    <span className="text-red-600">High: {item.high}%</span>
                    <span className="text-orange-600">Medium: {item.medium}%</span>
                    <span className="text-green-600">Low: {item.low}%</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-red-500 rounded-sm mr-1"></div>
                <span className="text-xs">High Urgency</span>
              </div>
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-orange-400 rounded-sm mr-1"></div>
                <span className="text-xs">Medium Urgency</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-sm mr-1"></div>
                <span className="text-xs">Low Urgency</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Urgency Detection Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Urgency Detection Insights</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Caller</TableHead>
                  <TableHead>Urgency Level</TableHead>
                  <TableHead>Trigger Phrases</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urgencyData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatTimestamp(item.timestamp)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        <span className="text-xs text-gray-500">{item.caller}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.urgencyLevel === 'High' ? (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        ) : item.urgencyLevel === 'Medium' ? (
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                        ) : (
                          <Bell className="w-4 h-4 text-green-500" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs ${getUrgencyStyle(item.urgencyLevel)}`}>
                          {item.urgencyLevel}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.triggerPhrases.map((phrase, index) => (
                          <span 
                            key={index}
                            className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                          >
                            {phrase}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{item.agent}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span>{item.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4" />
                          <span className="sr-only">Call details</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MessageCircle className="h-4 w-4" />
                          <span className="sr-only">View transcript</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">Showing 1-4 of 42 records</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default UrgencyDetectionDashboard;