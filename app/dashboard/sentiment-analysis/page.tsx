"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  Search,
  Calendar,
  Filter,
//   BarChart2,
  Smile,
  Frown,
  Meh,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Clock
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

const SentimentAnalysisDashboard = () => {
  const [timeFrame, setTimeFrame] = useState('last7Days');
  const [selectedAgent, setSelectedAgent] = useState('all');

  // Mock data for sentiment trends
  const sentimentData = [
    { date: 'Apr 5', positive: 65, neutral: 20, negative: 15 },
    { date: 'Apr 6', positive: 55, neutral: 30, negative: 15 },
    { date: 'Apr 7', positive: 60, neutral: 25, negative: 15 },
    { date: 'Apr 8', positive: 70, neutral: 20, negative: 10 },
    { date: 'Apr 9', positive: 75, neutral: 15, negative: 10 },
    { date: 'Apr 10', positive: 68, neutral: 22, negative: 10 },
    { date: 'Apr 11', positive: 72, neutral: 18, negative: 10 },
  ];

  // Mock data for call sentiment records
  const sentimentRecords = [
    {
      id: 'CS001',
      date: '2025-04-11 14:30',
      caller: '+1 (555) 123-4567',
      agent: 'AI Agent 1',
      duration: '4m 12s',
      sentiment: 'Positive',
      score: 0.85,
      keywords: ['helpful', 'friendly', 'efficient']
    },
    {
      id: 'CS002',
      date: '2025-04-11 12:15',
      caller: '+1 (555) 234-5678',
      agent: 'AI Agent 2',
      duration: '6m 45s',
      sentiment: 'Neutral',
      score: 0.52,
      keywords: ['informative', 'standard', 'adequate']
    },
    {
      id: 'CS003',
      date: '2025-04-10 15:20',
      caller: '+1 (555) 345-6789',
      agent: 'AI Agent 1',
      duration: '8m 32s',
      sentiment: 'Negative',
      score: 0.25,
      keywords: ['confused', 'frustrated', 'long wait']
    },
    {
      id: 'CS004',
      date: '2025-04-10 09:45',
      caller: '+1 (555) 456-7890',
      agent: 'AI Agent 3',
      duration: '3m 50s',
      sentiment: 'Positive',
      score: 0.95,
      keywords: ['excellent', 'quick', 'knowledgeable']
    },
  ];

  // Function to get sentiment icon
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return <Smile className="w-5 h-5 text-green-500" />;
      case 'neutral': return <Meh className="w-5 h-5 text-blue-500" />;
      case 'negative': return <Frown className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  // Function to get sentiment score background color
//   const getSentimentScoreColor = (score: number) => {
//     if (score >= 0.7) return 'bg-green-100';
//     if (score >= 0.4) return 'bg-blue-100';
//     return 'bg-red-100';
//   };

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
        duration: 0.5
      }
    }
  };

  // Helper function to generate sentiment score bar
  const SentimentScoreBar = ({ score }: { score: number }) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${
            score >= 0.7 ? 'bg-green-500' : 
            score >= 0.4 ? 'bg-blue-500' : 
            'bg-red-500'
          }`}
          style={{ width: `${score * 100}%` }}
        ></div>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-[#0A1E4E]">Sentiment Analysis</h1>
          <p className="text-gray-600">Monitor customer sentiment and emotional patterns in conversations</p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-[#0A1E4E] text-[#0A1E4E] hover:bg-[#0A1E4E] hover:text-white"
        >
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Filter Section */}
      <motion.div
        className="flex flex-col md:flex-row gap-4 mb-8"
        variants={itemVariants}
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by caller or keyword"
            className="pl-10 bg-white border-gray-200"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              <SelectItem value="ai1">AI Agent 1</SelectItem>
              <SelectItem value="ai2">AI Agent 2</SelectItem>
              <SelectItem value="ai3">AI Agent 3</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        variants={itemVariants}
      >
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Positive Sentiment</p>
                <h3 className="text-2xl font-bold text-[#0A1E4E]">68%</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Smile className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <p className="text-xs text-green-600">+5% from last period</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Neutral Sentiment</p>
                <h3 className="text-2xl font-bold text-[#0A1E4E]">22%</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Meh className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              <p className="text-xs text-red-600">-2% from last period</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Negative Sentiment</p>
                <h3 className="text-2xl font-bold text-[#0A1E4E]">10%</h3>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Frown className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
              <p className="text-xs text-green-600">-3% from last period</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sentiment Trend Chart */}
      <motion.div variants={itemVariants} className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sentiment Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end">
              {sentimentData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col-reverse h-48 gap-1">
                    <div 
                      className="w-full bg-green-400 rounded-t" 
                      style={{ height: `${day.positive * 0.7}%` }}
                    ></div>
                    <div 
                      className="w-full bg-blue-400 rounded-t" 
                      style={{ height: `${day.neutral * 0.7}%` }}
                    ></div>
                    <div 
                      className="w-full bg-red-400 rounded-t" 
                      style={{ height: `${day.negative * 0.7}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium text-gray-600 mt-2">{day.date}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-green-400 rounded-sm mr-1"></div>
                <span className="text-xs">Positive</span>
              </div>
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-blue-400 rounded-sm mr-1"></div>
                <span className="text-xs">Neutral</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-400 rounded-sm mr-1"></div>
                <span className="text-xs">Negative</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Calls Sentiment Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Call Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Caller</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Key Phrases</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentimentRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{record.date}</span>
                      </div>
                    </TableCell>
                    <TableCell>{record.caller}</TableCell>
                    <TableCell>{record.agent}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{record.duration}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getSentimentIcon(record.sentiment)}
                        <span>{record.sentiment}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          record.score >= 0.7 ? 'text-green-600' : 
                          record.score >= 0.4 ? 'text-blue-600' : 
                          'text-red-600'
                        }`}>
                          {record.score.toFixed(2)}
                        </span>
                        <SentimentScoreBar score={record.score} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {record.keywords.map((keyword, index) => (
                          <span 
                            key={index}
                            className={`text-xs px-2 py-1 rounded-full ${
                              record.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                              record.sentiment === 'Neutral' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MessageCircle className="h-4 w-4" />
                        <span className="sr-only">View transcript</span>
                      </Button>
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
        <p className="text-sm text-gray-500">Showing 1-4 of 24 records</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SentimentAnalysisDashboard;