// app/dashboard/urgency-detection/page.tsx - Complete with WebSocket
"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  Search,
  Calendar,
  AlertCircle,
  Bell,
  Phone,
  Tag,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  AlertOctagon,
  CheckCircle,
  ArrowUpRight,
  MoreVertical,
  Eye,
  FileText,
  Play,
  Bot,
  Zap,
  Shield,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Loader2,
  X,
  Flame,
  Timer,
  Activity,
  BarChart3,
  WifiOff
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDashboardMetrics, defaults } from '@/contexts/dashboard-metrics-context';

// Mock data moved outside component to prevent re-creation on each render
const MOCK_URGENCY_DATA: UrgencyRecord[] = [
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
    category: 'Technical Issue',
    summary: 'Critical system outage affecting production environment.'
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
    category: 'Billing Question',
    summary: 'Invoice discrepancy needs resolution before payment deadline.'
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
    category: 'Account Access',
    summary: 'Account locked, customer unable to access critical data.'
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
    category: 'General Inquiry',
    summary: 'Product information request, non-time-sensitive.'
  },
  {
    id: 'URG005',
    timestamp: '2025-04-10T09:20:00',
    caller: '+1 (555) 567-8901',
    name: 'Michael Brown',
    duration: '5m 30s',
    urgencyLevel: 'High',
    triggerPhrases: ['asap', 'escalate', 'manager'],
    status: 'Pending',
    agent: 'AI Agent 2',
    category: 'Service Complaint',
    summary: 'Repeated service failures, customer threatening to cancel.'
  },
  {
    id: 'URG006',
    timestamp: '2025-04-09T15:45:00',
    caller: '+1 (555) 678-9012',
    name: 'Lisa Anderson',
    duration: '2m 15s',
    urgencyLevel: 'Medium',
    triggerPhrases: ['today', 'need help', 'problem'],
    status: 'Resolved',
    agent: 'AI Agent 1',
    category: 'Technical Issue',
    summary: 'Minor configuration issue resolved during call.'
  },
];

interface UrgencyRecord {
  id: string;
  timestamp: string;
  caller: string;
  name: string;
  duration: string;
  urgencyLevel: 'High' | 'Medium' | 'Low';
  triggerPhrases: string[];
  status: 'Resolved' | 'In Progress' | 'Escalated' | 'Pending';
  agent: string;
  category: string;
  summary?: string;
}

interface CategoryData {
  category: string;
  high: number;
  medium: number;
  low: number;
  total: number;
}

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

const UrgencyDetectionDashboard = () => {
  // 🔥 Get real-time data from WebSocket
  const { 
    urgency, 
    urgencyStatus, 
    lastUpdate,
    refreshAll,
    period,
    setPeriod
  } = useDashboardMetrics();

  const [timeRange, setTimeRange] = useState('last7Days');
  const [urgencyLevel, setUrgencyLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Use WebSocket data if available, otherwise use mock data
  const urgencyData = useMemo(() => {
    const records = urgency?.records || defaults.urgency.records;
    return records.length > 0 ? records : MOCK_URGENCY_DATA;
  }, [urgency?.records]);

  // Use real data or fallback to mock for other data
  const wsData = urgency || defaults.urgency;


  // Stats data - use WebSocket data or fallback
  interface StatItem {
    value: number | string;
    change: number;
    trend: 'up' | 'down';
  }

  const statsData: Record<'high' | 'medium' | 'low' | 'avgResponse', StatItem> = wsData.stats || {
    high: { value: 28, change: 12, trend: 'up' },
    medium: { value: 45, change: -8, trend: 'down' },
    low: { value: 132, change: 3, trend: 'up' },
    avgResponse: { value: '2m 12s', change: -15, trend: 'down' }
  };

  // Categories with urgency distribution - use WebSocket data or fallback
  const categoryData: CategoryData[] = wsData.categories.length > 0 ? wsData.categories : [
    { category: "Technical Issues", high: 35, medium: 40, low: 25, total: 156 },
    { category: "Billing Questions", high: 25, medium: 45, low: 30, total: 89 },
    { category: "Account Access", high: 50, medium: 35, low: 15, total: 67 },
    { category: "Product Information", high: 15, medium: 30, low: 55, total: 124 },
    { category: "Service Complaints", high: 65, medium: 25, low: 10, total: 42 }
  ];

  const getUrgencyConfig = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return {
          icon: AlertOctagon,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-500/20',
          gradient: 'from-red-500 to-rose-500',
          label: 'High'
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-100 dark:bg-orange-500/20',
          gradient: 'from-orange-500 to-amber-500',
          label: 'Medium'
        };
      case 'low':
        return {
          icon: Bell,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-500/20',
          gradient: 'from-green-500 to-emerald-500',
          label: 'Low'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-500/20',
          gradient: 'from-gray-500 to-slate-500',
          label: level
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return {
          icon: CheckCircle,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-500/20'
        };
      case 'in progress':
        return {
          icon: Timer,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-500/20'
        };
      case 'escalated':
        return {
          icon: ArrowUpRight,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-500/20'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-100 dark:bg-amber-500/20'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-500/20'
        };
    }
  };

  // Filter records
  const filteredRecords = useMemo(() => {
    return urgencyData.filter(record => {
      const matchesSearch = 
        record.caller.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.triggerPhrases.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
        record.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesUrgency = urgencyLevel === 'all' || record.urgencyLevel.toLowerCase() === urgencyLevel;
      const matchesStatus = selectedStatus === 'all' || record.status.toLowerCase().replace(' ', '-') === selectedStatus;
      
      return matchesSearch && matchesUrgency && matchesStatus;
    });
  }, [urgencyData, searchQuery, urgencyLevel, selectedStatus]);

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Category Bar Component
  const CategoryBar = ({ data }: { data: CategoryData }) => (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-900 dark:text-white">{data.category}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{data.total} calls</span>
      </div>
      <div className="relative h-3 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-800">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${data.high}%` }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute left-0 h-full bg-gradient-to-r from-red-500 to-red-400"
        />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${data.medium}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute h-full bg-gradient-to-r from-orange-500 to-orange-400"
          style={{ left: `${data.high}%` }}
        />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${data.low}%` }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute h-full bg-gradient-to-r from-green-500 to-green-400"
          style={{ left: `${data.high + data.medium}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-xs">
        <span className="text-red-600 dark:text-red-400 font-medium">{data.high}% High</span>
        <span className="text-orange-600 dark:text-orange-400 font-medium">{data.medium}% Medium</span>
        <span className="text-green-600 dark:text-green-400 font-medium">{data.low}% Low</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium mb-3">
                <AlertTriangle className="w-4 h-4" />
                Priority Monitoring
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Urgency Detection
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Monitor and respond to high priority customer inquiries in real-time
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <ConnectionStatus status={urgencyStatus} lastUpdate={lastUpdate} />
              <Button
                variant="outline"
                className="border-gray-200 dark:border-slate-700"
                onClick={refreshAll}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* High Urgency Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                  <AlertOctagon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-medium ${statsData.high.trend === 'up' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {statsData.high.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {statsData.high.change > 0 ? '+' : ''}{statsData.high.change}%
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {statsData.high.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">High Urgency</div>
            </div>
          </motion.div>

          {/* Medium Urgency Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-medium ${statsData.medium.trend === 'down' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {statsData.medium.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {statsData.medium.change}%
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {statsData.medium.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Medium Urgency</div>
            </div>
          </motion.div>

          {/* Low Urgency Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{statsData.low.change}%
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {statsData.low.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Low Urgency</div>
            </div>
          </motion.div>

          {/* Avg Response Time Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="relative p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Timer className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  {statsData.avgResponse.change}s
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {statsData.avgResponse.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Response Time</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Category Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Urgency by Category</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Distribution across call categories</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-rose-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {categoryData.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <CategoryBar data={category} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by caller, phrase, or case ID..."
                className="pl-12 h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[160px] h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
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
                <SelectTrigger className="w-[160px] h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="Urgency" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4 text-red-500" />
                      High
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-green-500" />
                      Low
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[160px] h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              {(urgencyLevel !== 'all' || selectedStatus !== 'all' || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setUrgencyLevel('all');
                    setSelectedStatus('all');
                    setSearchQuery('');
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Urgency Records Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Urgency Detection Insights</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Real-time monitoring of urgent customer interactions</p>
              </div>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="block lg:hidden divide-y divide-gray-200 dark:divide-slate-800">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record, index) => {
                const urgencyConfig = getUrgencyConfig(record.urgencyLevel);
                const statusConfig = getStatusConfig(record.status);
                const UrgencyIcon = urgencyConfig.icon;
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${urgencyConfig.gradient} flex items-center justify-center`}>
                          <UrgencyIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{record.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{record.caller}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${urgencyConfig.bgColor} ${urgencyConfig.color}`}>
                        {urgencyConfig.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {record.triggerPhrases.map((phrase, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400"
                        >
                          &quot;{phrase}&quot;
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {record.status}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">{record.category}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-orange-600 dark:text-orange-400">
                        View
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No records found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-slate-800/30 border-b border-gray-200 dark:border-slate-800">
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Caller</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Date & Time</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Urgency</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Trigger Phrases</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Status</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Agent</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Category</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 dark:divide-slate-800">
                {paginatedRecords.length > 0 ? (
                  paginatedRecords.map((record, index) => {
                    const urgencyConfig = getUrgencyConfig(record.urgencyLevel);
                    const statusConfig = getStatusConfig(record.status);
                    const UrgencyIcon = urgencyConfig.icon;
                    const StatusIcon = statusConfig.icon;
                    const timestamp = formatTimestamp(record.timestamp);

                    return (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-medium">
                              {record.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{record.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{record.caller}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">{timestamp.date}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{timestamp.time}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${urgencyConfig.bgColor} ${urgencyConfig.color}`}>
                            <UrgencyIcon className="w-3.5 h-3.5" />
                            {urgencyConfig.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {record.triggerPhrases.slice(0, 3).map((phrase, idx) => (
                              <span 
                                key={idx}
                                className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400"
                              >
                                &quot;{phrase}&quot;
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {record.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                              <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="text-gray-900 dark:text-white">{record.agent}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">{record.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                View Transcript
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Play className="w-4 h-4" />
                                Play Recording
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Call Back
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                <ArrowUpRight className="w-4 h-4" />
                                Escalate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-16 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No records found</h3>
                      <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredRecords.length > itemsPerPage && (
            <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-medium text-gray-700 dark:text-gray-300">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {Math.min(currentPage * itemsPerPage, filteredRecords.length)}
                  </span>{' '}
                  of <span className="font-medium text-gray-700 dark:text-gray-300">{filteredRecords.length}</span> records
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="border-gray-200 dark:border-slate-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="border-gray-200 dark:border-slate-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Alert Configuration Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 dark:from-red-500/20 dark:via-orange-500/20 dark:to-amber-500/20 border border-orange-200/50 dark:border-orange-500/30"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Configure Real-Time Alerts
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set up instant notifications for high-urgency calls. Get alerted via SMS, email, or Slack when critical issues are detected.
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg shadow-red-500/25"
            >
              <Zap className="w-4 h-4 mr-2" />
              Configure Alerts
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UrgencyDetectionDashboard;