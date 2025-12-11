// app/dashboard/call-reports/page.tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  Search,
  Calendar,
  Phone,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp,
  TrendingDown,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneCall,
  Smile,
  Meh,
  Frown,
  MoreVertical,
  Eye,
  FileText,
  MessageSquare,
  Play,
  Sparkles,
  ArrowUpRight,
  SlidersHorizontal,
  X,
  Bot,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Loader2
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface CallReport {
  id: string;
  date: string;
  time: string;
  caller: string;
  callerName?: string;
  duration: string;
  durationSeconds: number;
  callType: 'Inbound' | 'Outbound';
  agent: string;
  outcome: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  tags?: string[];
}

const CallReportsDashboard = () => {
  const [dateRange, setDateRange] = useState('This Week');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCallType, setSelectedCallType] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Extended mock data for call reports
  const callReports: CallReport[] = [
    {
      id: 'CR001',
      date: '2025-04-10',
      time: '14:32',
      caller: '+1 (555) 123-4567',
      callerName: 'John Smith',
      duration: '5m 23s',
      durationSeconds: 323,
      callType: 'Inbound',
      agent: 'AI Agent 1',
      outcome: 'Resolved',
      sentiment: 'Positive',
      tags: ['Support', 'Billing']
    },
    {
      id: 'CR002',
      date: '2025-04-10',
      time: '13:15',
      caller: '+1 (555) 234-5678',
      callerName: 'Sarah Johnson',
      duration: '3m 45s',
      durationSeconds: 225,
      callType: 'Outbound',
      agent: 'AI Agent 2',
      outcome: 'Escalated',
      sentiment: 'Neutral',
      tags: ['Sales', 'Follow-up']
    },
    {
      id: 'CR003',
      date: '2025-04-09',
      time: '16:45',
      caller: '+1 (555) 345-6789',
      callerName: 'Mike Wilson',
      duration: '8m 12s',
      durationSeconds: 492,
      callType: 'Inbound',
      agent: 'AI Agent 1',
      outcome: 'Resolved',
      sentiment: 'Negative',
      tags: ['Complaint', 'Urgent']
    },
    {
      id: 'CR004',
      date: '2025-04-09',
      time: '11:20',
      caller: '+1 (555) 456-7890',
      callerName: 'Emily Davis',
      duration: '2m 55s',
      durationSeconds: 175,
      callType: 'Outbound',
      agent: 'AI Agent 3',
      outcome: 'Follow-up Required',
      sentiment: 'Positive',
      tags: ['Onboarding']
    },
    {
      id: 'CR005',
      date: '2025-04-09',
      time: '09:30',
      caller: '+1 (555) 567-8901',
      callerName: 'Robert Brown',
      duration: '6m 18s',
      durationSeconds: 378,
      callType: 'Inbound',
      agent: 'AI Agent 2',
      outcome: 'Resolved',
      sentiment: 'Positive',
      tags: ['Technical', 'Support']
    },
    {
      id: 'CR006',
      date: '2025-04-08',
      time: '15:45',
      caller: '+1 (555) 678-9012',
      callerName: 'Lisa Anderson',
      duration: '4m 02s',
      durationSeconds: 242,
      callType: 'Inbound',
      agent: 'AI Agent 1',
      outcome: 'Resolved',
      sentiment: 'Neutral',
      tags: ['General Inquiry']
    },
  ];

  const getSentimentConfig = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': 
        return { 
          icon: Smile, 
          color: 'text-green-600 dark:text-green-400', 
          bgColor: 'bg-green-100 dark:bg-green-500/20',
          label: 'Positive'
        };
      case 'neutral': 
        return { 
          icon: Meh, 
          color: 'text-blue-600 dark:text-blue-400', 
          bgColor: 'bg-blue-100 dark:bg-blue-500/20',
          label: 'Neutral'
        };
      case 'negative': 
        return { 
          icon: Frown, 
          color: 'text-red-600 dark:text-red-400', 
          bgColor: 'bg-red-100 dark:bg-red-500/20',
          label: 'Negative'
        };
      default: 
        return { 
          icon: Meh, 
          color: 'text-gray-600 dark:text-gray-400', 
          bgColor: 'bg-gray-100 dark:bg-gray-500/20',
          label: sentiment
        };
    }
  };

  const getOutcomeConfig = (outcome: string) => {
    switch (outcome.toLowerCase()) {
      case 'resolved': 
        return { 
          icon: CheckCircle, 
          color: 'text-green-600 dark:text-green-400', 
          bgColor: 'bg-green-100 dark:bg-green-500/20'
        };
      case 'escalated': 
        return { 
          icon: ArrowUpRight, 
          color: 'text-orange-600 dark:text-orange-400', 
          bgColor: 'bg-orange-100 dark:bg-orange-500/20'
        };
      case 'follow-up required': 
        return { 
          icon: Clock, 
          color: 'text-blue-600 dark:text-blue-400', 
          bgColor: 'bg-blue-100 dark:bg-blue-500/20'
        };
      default: 
        return { 
          icon: AlertCircle, 
          color: 'text-gray-600 dark:text-gray-400', 
          bgColor: 'bg-gray-100 dark:bg-gray-500/20'
        };
    }
  };

  const getCallTypeConfig = (callType: string) => {
    switch (callType.toLowerCase()) {
      case 'inbound': 
        return { 
          icon: PhoneIncoming, 
          color: 'text-green-600 dark:text-green-400', 
          bgColor: 'bg-green-100 dark:bg-green-500/20'
        };
      case 'outbound': 
        return { 
          icon: PhoneOutgoing, 
          color: 'text-blue-600 dark:text-blue-400', 
          bgColor: 'bg-blue-100 dark:bg-blue-500/20'
        };
      default: 
        return { 
          icon: Phone, 
          color: 'text-gray-600 dark:text-gray-400', 
          bgColor: 'bg-gray-100 dark:bg-gray-500/20'
        };
    }
  };

  // Filter logic
  const filteredReports = callReports.filter(report => {
    const matchesSearch = 
      report.caller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.callerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCallType = selectedCallType === 'all' || report.callType.toLowerCase() === selectedCallType;
    const matchesSentiment = selectedSentiment === 'all' || report.sentiment.toLowerCase() === selectedSentiment;
    
    return matchesSearch && matchesCallType && matchesSentiment;
  });

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Stats calculations
  const stats = {
    totalCalls: 1247,
    avgDuration: '4m 12s',
    resolutionRate: 92,
    sentimentScore: 7.8,
    inboundCalls: 847,
    outboundCalls: 400,
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
                <PhoneCall className="w-4 h-4" />
                Call Analytics
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Call Reports
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Detailed analysis and insights from your AI-powered calls
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-gray-200 dark:border-slate-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    {dateRange}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setDateRange('Today')}>Today</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateRange('This Week')}>This Week</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateRange('This Month')}>This Month</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateRange('Last 30 Days')}>Last 30 Days</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setDateRange('Custom Range')}>Custom Range</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                Export
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
          {[
            { 
              label: "Total Calls", 
              value: stats.totalCalls.toLocaleString(), 
              icon: Phone, 
              color: "from-orange-500 to-amber-500",
              trend: { value: "+12%", positive: true },
              detail: `${stats.inboundCalls} inbound, ${stats.outboundCalls} outbound`
            },
            { 
              label: "Avg. Duration", 
              value: stats.avgDuration, 
              icon: Clock, 
              color: "from-purple-500 to-pink-500",
              trend: { value: "-30s", positive: true },
              detail: "Per call average"
            },
            { 
              label: "Resolution Rate", 
              value: `${stats.resolutionRate}%`, 
              icon: CheckCircle, 
              color: "from-green-500 to-emerald-500",
              trend: { value: "+5%", positive: true },
              detail: "First call resolution"
            },
            { 
              label: "Sentiment Score", 
              value: `${stats.sentimentScore}/10`, 
              icon: Smile, 
              color: "from-blue-500 to-cyan-500",
              trend: { value: "+0.5", positive: true },
              detail: "Customer satisfaction"
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="relative p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all group"
            >
              <div className={`absolute top-4 right-4 w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center opacity-90`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="pr-14">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{stat.label}</div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium flex items-center ${stat.trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stat.trend.positive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                    {stat.trend.value}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{stat.detail}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden"
        >
          {/* Search and Filter Section */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-800">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by caller, name, agent, or ID..."
                  className="pl-12 h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Quick Filters */}
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-11 border-gray-200 dark:border-slate-700 rounded-xl">
                      <PhoneCall className="w-4 h-4 mr-2" />
                      {selectedCallType === 'all' ? 'All Types' : selectedCallType.charAt(0).toUpperCase() + selectedCallType.slice(1)}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedCallType('all')}>All Types</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCallType('inbound')}>
                      <PhoneIncoming className="w-4 h-4 mr-2 text-green-500" />
                      Inbound
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCallType('outbound')}>
                      <PhoneOutgoing className="w-4 h-4 mr-2 text-blue-500" />
                      Outbound
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-11 border-gray-200 dark:border-slate-700 rounded-xl">
                      <Smile className="w-4 h-4 mr-2" />
                      {selectedSentiment === 'all' ? 'All Sentiments' : selectedSentiment.charAt(0).toUpperCase() + selectedSentiment.slice(1)}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedSentiment('all')}>All Sentiments</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedSentiment('positive')}>
                      <Smile className="w-4 h-4 mr-2 text-green-500" />
                      Positive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedSentiment('neutral')}>
                      <Meh className="w-4 h-4 mr-2 text-blue-500" />
                      Neutral
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedSentiment('negative')}>
                      <Frown className="w-4 h-4 mr-2 text-red-500" />
                      Negative
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  className="h-11 border-gray-200 dark:border-slate-700 rounded-xl"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>

                {(selectedCallType !== 'all' || selectedSentiment !== 'all' || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCallType('all');
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

            {/* Active Filters Display */}
            {(selectedCallType !== 'all' || selectedSentiment !== 'all') && (
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
                {selectedCallType !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-300">
                    {selectedCallType === 'inbound' ? <PhoneIncoming className="w-3 h-3" /> : <PhoneOutgoing className="w-3 h-3" />}
                    {selectedCallType}
                    <button onClick={() => setSelectedCallType('all')} className="ml-1 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedSentiment !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-300">
                    {selectedSentiment === 'positive' ? <Smile className="w-3 h-3" /> : selectedSentiment === 'neutral' ? <Meh className="w-3 h-3" /> : <Frown className="w-3 h-3" />}
                    {selectedSentiment}
                    <button onClick={() => setSelectedSentiment('all')} className="ml-1 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Mobile Cards View */}
          <div className="block lg:hidden divide-y divide-gray-200 dark:divide-slate-800">
            {paginatedReports.length > 0 ? (
              paginatedReports.map((report, index) => {
                const sentimentConfig = getSentimentConfig(report.sentiment);
                const outcomeConfig = getOutcomeConfig(report.outcome);
                const callTypeConfig = getCallTypeConfig(report.callType);
                const SentimentIcon = sentimentConfig.icon;
                const OutcomeIcon = outcomeConfig.icon;
                const CallTypeIcon = callTypeConfig.icon;

                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${callTypeConfig.bgColor} flex items-center justify-center`}>
                          <CallTypeIcon className={`w-5 h-5 ${callTypeConfig.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{report.callerName || report.caller}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{report.caller}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${sentimentConfig.bgColor} ${sentimentConfig.color}`}>
                        <SentimentIcon className="w-3 h-3" />
                        {sentimentConfig.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {formatDate(report.date)} {report.time}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        {report.duration}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Bot className="w-4 h-4" />
                        {report.agent}
                      </div>
                      <div className={`flex items-center gap-1 ${outcomeConfig.color}`}>
                        <OutcomeIcon className="w-4 h-4" />
                        {report.outcome}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{report.id}</span>
                      <Button variant="ghost" size="sm" className="text-orange-600 dark:text-orange-400">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No calls found</h3>
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
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Duration</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Type</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Agent</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Outcome</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-gray-400">Sentiment</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 dark:divide-slate-800">
                {paginatedReports.length > 0 ? (
                  paginatedReports.map((report, index) => {
                    const sentimentConfig = getSentimentConfig(report.sentiment);
                    const outcomeConfig = getOutcomeConfig(report.outcome);
                    const callTypeConfig = getCallTypeConfig(report.callType);
                    const SentimentIcon = sentimentConfig.icon;
                    const OutcomeIcon = outcomeConfig.icon;
                    const CallTypeIcon = callTypeConfig.icon;

                    return (
                      <motion.tr
                        key={report.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-medium">
                              {report.callerName?.charAt(0) || report.caller.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {report.callerName || 'Unknown'}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{report.caller}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">{formatDate(report.date)}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{report.time}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900 dark:text-white">{report.duration}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${callTypeConfig.bgColor} ${callTypeConfig.color}`}>
                            <CallTypeIcon className="w-3.5 h-3.5" />
                            {report.callType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                              <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="text-gray-900 dark:text-white">{report.agent}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${outcomeConfig.bgColor} ${outcomeConfig.color}`}>
                            <OutcomeIcon className="w-3.5 h-3.5" />
                            {report.outcome}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${sentimentConfig.bgColor} ${sentimentConfig.color}`}>
                            <SentimentIcon className="w-3.5 h-3.5" />
                            {sentimentConfig.label}
                          </span>
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
                                <MessageSquare className="w-4 h-4" />
                                Add Note
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Export Report
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
                        <Phone className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No calls found</h3>
                      <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredReports.length > itemsPerPage && (
            <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-medium text-gray-700 dark:text-gray-300">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {Math.min(currentPage * itemsPerPage, filteredReports.length)}
                  </span>{' '}
                  of <span className="font-medium text-gray-700 dark:text-gray-300">{filteredReports.length}</span> calls
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

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 dark:from-orange-500/20 dark:via-amber-500/20 dark:to-orange-500/20 border border-orange-200/50 dark:border-orange-500/30"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Unlock Advanced Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upgrade to Pro for real-time sentiment analysis, predictive insights, and custom reporting dashboards.
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CallReportsDashboard;