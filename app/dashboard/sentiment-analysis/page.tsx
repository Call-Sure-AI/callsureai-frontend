// app/dashboard/sentiment-analysis/page.tsx - Complete with WebSocket
"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  Search,
  Calendar,
  Smile,
  Frown,
  Meh,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  FileText,
  Play,
  Sparkles,
  Bot,
  BarChart3,
  Activity,
  Zap,
  Target,
  RefreshCw,
  Loader2,
  X,
  ArrowUpRight,
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
const MOCK_SENTIMENT_RECORDS: SentimentRecord[] = [
  {
    id: 'CS001',
    date: '2025-04-11',
    time: '14:30',
    caller: '+1 (555) 123-4567',
    callerName: 'John Smith',
    agent: 'AI Agent 1',
    duration: '4m 12s',
    sentiment: 'Positive',
    score: 0.85,
    keywords: ['helpful', 'friendly', 'efficient'],
    summary: 'Customer was very satisfied with quick resolution of billing inquiry.'
  },
  {
    id: 'CS002',
    date: '2025-04-11',
    time: '12:15',
    caller: '+1 (555) 234-5678',
    callerName: 'Sarah Johnson',
    agent: 'AI Agent 2',
    duration: '6m 45s',
    sentiment: 'Neutral',
    score: 0.52,
    keywords: ['informative', 'standard', 'adequate'],
    summary: 'Standard product information request, customer received needed details.'
  },
  {
    id: 'CS003',
    date: '2025-04-10',
    time: '15:20',
    caller: '+1 (555) 345-6789',
    callerName: 'Mike Wilson',
    agent: 'AI Agent 1',
    duration: '8m 32s',
    sentiment: 'Negative',
    score: 0.25,
    keywords: ['confused', 'frustrated', 'long wait'],
    summary: 'Customer experienced frustration with technical issue. Escalated to specialist.'
  },
  {
    id: 'CS004',
    date: '2025-04-10',
    time: '09:45',
    caller: '+1 (555) 456-7890',
    callerName: 'Emily Davis',
    agent: 'AI Agent 3',
    duration: '3m 50s',
    sentiment: 'Positive',
    score: 0.95,
    keywords: ['excellent', 'quick', 'knowledgeable'],
    summary: 'Exceptional service delivery, customer praised AI assistant capabilities.'
  },
  {
    id: 'CS005',
    date: '2025-04-09',
    time: '16:30',
    caller: '+1 (555) 567-8901',
    callerName: 'Robert Brown',
    agent: 'AI Agent 2',
    duration: '5m 15s',
    sentiment: 'Positive',
    score: 0.78,
    keywords: ['resolved', 'clear', 'professional'],
    summary: 'Account update completed smoothly with clear explanations.'
  },
  {
    id: 'CS006',
    date: '2025-04-09',
    time: '11:00',
    caller: '+1 (555) 678-9012',
    callerName: 'Lisa Anderson',
    agent: 'AI Agent 1',
    duration: '7m 20s',
    sentiment: 'Neutral',
    score: 0.48,
    keywords: ['routine', 'average', 'okay'],
    summary: 'General inquiry handled with standard procedures.'
  },
];

interface SentimentRecord {
  id: string;
  date: string;
  time: string;
  caller: string;
  callerName?: string;
  agent: string;
  duration: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  score: number;
  keywords: string[];
  summary?: string;
}

interface SentimentTrend {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
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

const SentimentAnalysisDashboard = () => {
  // 🔥 Get real-time data from WebSocket
  const { 
    sentiment, 
    sentimentStatus, 
    lastUpdate,
    refreshAll,
    period,
    setPeriod
  } = useDashboardMetrics();

  const [timeFrame, setTimeFrame] = useState('last7Days');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Use real data or fallback to defaults/mock
  const wsData = sentiment || defaults.sentiment;

  // Mock data for sentiment trends (fallback when no WebSocket data)
  const sentimentTrends: SentimentTrend[] = wsData.trends.length > 0 ? wsData.trends : [
    { date: 'Mon', positive: 65, neutral: 20, negative: 15, total: 156 },
    { date: 'Tue', positive: 55, neutral: 30, negative: 15, total: 142 },
    { date: 'Wed', positive: 60, neutral: 25, negative: 15, total: 168 },
    { date: 'Thu', positive: 70, neutral: 20, negative: 10, total: 189 },
    { date: 'Fri', positive: 75, neutral: 15, negative: 10, total: 201 },
    { date: 'Sat', positive: 68, neutral: 22, negative: 10, total: 134 },
    { date: 'Sun', positive: 72, neutral: 18, negative: 10, total: 98 },
  ];

  // Mock data for call sentiment records - use constant to avoid recreating on each render
  const sentimentRecords = useMemo(() => {
    const records = sentiment?.records || defaults.sentiment.records;
    return records.length > 0 ? records : MOCK_SENTIMENT_RECORDS;
  }, [sentiment?.records]);

  const getSentimentConfig = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': 
        return { 
          icon: Smile, 
          color: 'text-green-600 dark:text-green-400', 
          bgColor: 'bg-green-100 dark:bg-green-500/20',
          barColor: 'bg-green-500',
          gradient: 'from-green-500 to-emerald-500',
          label: 'Positive'
        };
      case 'neutral': 
        return { 
          icon: Meh, 
          color: 'text-blue-600 dark:text-blue-400', 
          bgColor: 'bg-blue-100 dark:bg-blue-500/20',
          barColor: 'bg-blue-500',
          gradient: 'from-blue-500 to-cyan-500',
          label: 'Neutral'
        };
      case 'negative': 
        return { 
          icon: Frown, 
          color: 'text-red-600 dark:text-red-400', 
          bgColor: 'bg-red-100 dark:bg-red-500/20',
          barColor: 'bg-red-500',
          gradient: 'from-red-500 to-rose-500',
          label: 'Negative'
        };
      default: 
        return { 
          icon: Meh, 
          color: 'text-gray-600 dark:text-gray-400', 
          bgColor: 'bg-gray-100 dark:bg-gray-500/20',
          barColor: 'bg-gray-500',
          gradient: 'from-gray-500 to-slate-500',
          label: sentiment
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600 dark:text-green-400';
    if (score >= 0.4) return 'text-blue-600 dark:text-blue-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 0.7) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (score >= 0.4) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    return 'bg-gradient-to-r from-red-500 to-rose-500';
  };

  // Filter records
  const filteredRecords = useMemo(() => {
    return sentimentRecords.filter(record => {
      const matchesSearch = 
        record.caller.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.callerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesAgent = selectedAgent === 'all' || record.agent.toLowerCase().includes(selectedAgent);
      const matchesSentiment = selectedSentiment === 'all' || record.sentiment.toLowerCase() === selectedSentiment;
      
      return matchesSearch && matchesAgent && matchesSentiment;
    });
  }, [sentimentRecords, searchQuery, selectedAgent, selectedSentiment]);

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Stats calculations - use WebSocket data or fallback
  const stats = {
    positive: wsData.stats.positive || 68,
    neutral: wsData.stats.neutral || 22,
    negative: wsData.stats.negative || 10,
    avgScore: wsData.stats.avgScore || 7.2,
    totalAnalyzed: wsData.stats.totalAnalyzed || 1088,
    improvement: wsData.stats.improvement || 5,
  };

  // Sentiment Score Bar Component
  const SentimentScoreBar = ({ score }: { score: number }) => (
    <div className="flex items-center gap-2 w-full max-w-[120px]">
      <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${getScoreBarColor(score)}`}
        />
      </div>
      <span className={`text-sm font-semibold min-w-[40px] ${getScoreColor(score)}`}>
        {(score * 100).toFixed(0)}%
      </span>
    </div>
  );

  // Trend Chart Bar Component
  const TrendBar = ({ data, maxHeight = 120 }: { data: SentimentTrend; maxHeight?: number }) => {
    const positiveHeight = (data.positive / 100) * maxHeight;
    const neutralHeight = (data.neutral / 100) * maxHeight;
    const negativeHeight = (data.negative / 100) * maxHeight;

    return (
      <div className="flex flex-col items-center flex-1 group">
        <div className="relative w-full max-w-[40px] flex flex-col-reverse gap-0.5" style={{ height: maxHeight }}>
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: positiveHeight }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm"
          />
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: neutralHeight }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full bg-gradient-to-t from-blue-500 to-blue-400"
          />
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: negativeHeight }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t-sm"
          />
          
          {/* Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <div className="bg-gray-900 dark:bg-slate-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>Positive: {data.positive}%</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Neutral: {data.neutral}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span>Negative: {data.negative}%</span>
              </div>
            </div>
          </div>
        </div>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">{data.date}</span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500">{data.total} calls</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-3">
                <Activity className="w-4 h-4" />
                Emotion Intelligence
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Sentiment Analysis
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Monitor customer sentiment and emotional patterns in conversations
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <ConnectionStatus status={sentimentStatus} lastUpdate={lastUpdate} />
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
          {/* Positive Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Smile className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{stats.improvement}%
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.positive}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Positive Sentiment</div>
            </div>
          </motion.div>

          {/* Neutral Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Meh className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-red-600 dark:text-red-400 text-sm font-medium">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -2%
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.neutral}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Neutral Sentiment</div>
            </div>
          </motion.div>

          {/* Negative Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                  <Frown className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -3%
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.negative}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Negative Sentiment</div>
            </div>
          </motion.div>

          {/* Average Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="relative p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +0.4
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.avgScore}/10
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Average Score</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Sentiment Trend Chart */}
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
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sentiment Trend Analysis</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Weekly sentiment distribution</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Positive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Neutral</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-rose-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Negative</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-end justify-between gap-2 h-[180px]">
                {sentimentTrends.map((trend, index) => (
                  <TrendBar key={index} data={trend} maxHeight={140} />
                ))}
              </div>
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
                placeholder="Search by caller, name, or keyword..."
                className="pl-12 h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <Select value={timeFrame} onValueChange={setTimeFrame}>
                <SelectTrigger className="w-[160px] h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="Time Frame" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7Days">Last 7 Days</SelectItem>
                  <SelectItem value="last30Days">Last 30 Days</SelectItem>
                  <SelectItem value="customRange">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-[160px] h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="Select Agent" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  <SelectItem value="ai agent 1">AI Agent 1</SelectItem>
                  <SelectItem value="ai agent 2">AI Agent 2</SelectItem>
                  <SelectItem value="ai agent 3">AI Agent 3</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                <SelectTrigger className="w-[160px] h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="Sentiment" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">
                    <div className="flex items-center gap-2">
                      <Smile className="w-4 h-4 text-green-500" />
                      Positive
                    </div>
                  </SelectItem>
                  <SelectItem value="neutral">
                    <div className="flex items-center gap-2">
                      <Meh className="w-4 h-4 text-blue-500" />
                      Neutral
                    </div>
                  </SelectItem>
                  <SelectItem value="negative">
                    <div className="flex items-center gap-2">
                      <Frown className="w-4 h-4 text-red-500" />
                      Negative
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {(selectedAgent !== 'all' || selectedSentiment !== 'all' || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedAgent('all');
                    setSelectedSentiment('all');
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

        {/* Sentiment Records Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Call Sentiment</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Detailed sentiment analysis per conversation</p>
              </div>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="block lg:hidden divide-y divide-gray-200 dark:divide-slate-800">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record, index) => {
                const sentimentConfig = getSentimentConfig(record.sentiment);
                const SentimentIcon = sentimentConfig.icon;

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
                        <div className={`w-10 h-10 rounded-xl ${sentimentConfig.bgColor} flex items-center justify-center`}>
                          <SentimentIcon className={`w-5 h-5 ${sentimentConfig.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{record.callerName || record.caller}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(record.date)} at {record.time}</p>
                        </div>
                      </div>
                      <SentimentScoreBar score={record.score} />
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {record.keywords.map((keyword, idx) => (
                        <span 
                          key={idx}
                          className={`text-xs px-2 py-0.5 rounded-md ${sentimentConfig.bgColor} ${sentimentConfig.color}`}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Bot className="w-4 h-4" />
                        {record.agent}
                      </div>
                      <Button variant="ghost" size="sm" className="text-orange-600 dark:text-orange-400">
                        View Details
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
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
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Agent</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Duration</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Sentiment</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Score</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Key Phrases</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 dark:divide-slate-800">
                {paginatedRecords.length > 0 ? (
                  paginatedRecords.map((record, index) => {
                    const sentimentConfig = getSentimentConfig(record.sentiment);
                    const SentimentIcon = sentimentConfig.icon;

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
                              {record.callerName?.charAt(0) || record.caller.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {record.callerName || 'Unknown'}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{record.caller}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">{formatDate(record.date)}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{record.time}</p>
                            </div>
                          </div>
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
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900 dark:text-white">{record.duration}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${sentimentConfig.bgColor} ${sentimentConfig.color}`}>
                            <SentimentIcon className="w-3.5 h-3.5" />
                            {sentimentConfig.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          <SentimentScoreBar score={record.score} />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {record.keywords.slice(0, 3).map((keyword, idx) => (
                              <span 
                                key={idx}
                                className={`text-xs px-2 py-0.5 rounded-md ${sentimentConfig.bgColor} ${sentimentConfig.color}`}
                              >
                                {keyword}
                              </span>
                            ))}
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
                                <Download className="w-4 h-4" />
                                Export Analysis
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
                        <MessageCircle className="w-8 h-8 text-gray-400" />
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

        {/* AI Insights Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 dark:from-orange-500/20 dark:via-amber-500/20 dark:to-orange-500/20 border border-orange-200/50 dark:border-orange-500/30"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                AI-Powered Insights Available
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get actionable recommendations to improve customer satisfaction based on sentiment patterns and conversation analysis.
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              View Insights
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SentimentAnalysisDashboard;