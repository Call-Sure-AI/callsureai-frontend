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
  Phone,
  ChevronDown,
  PieChart,
  BarChart2,
  Check
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
} from "@/components/ui/dropdown-menu";

const CallReportsDashboard = () => {
//   const [selectedFilter, setSelectedFilter] = useState('all');
  const [dateRange, setDateRange] = useState('This Week');
  
  // Mock data for call reports
  const callReports = [
    {
      id: 'CR001',
      date: '2025-04-10',
      caller: '+1 (555) 123-4567',
      duration: '5m 23s',
      callType: 'Inbound',
      agent: 'AI Agent 1',
      outcome: 'Resolved',
      sentiment: 'Positive'
    },
    {
      id: 'CR002',
      date: '2025-04-10',
      caller: '+1 (555) 234-5678',
      duration: '3m 45s',
      callType: 'Outbound',
      agent: 'AI Agent 2',
      outcome: 'Escalated',
      sentiment: 'Neutral'
    },
    {
      id: 'CR003',
      date: '2025-04-09',
      caller: '+1 (555) 345-6789',
      duration: '8m 12s',
      callType: 'Inbound',
      agent: 'AI Agent 1',
      outcome: 'Resolved',
      sentiment: 'Negative'
    },
    {
      id: 'CR004',
      date: '2025-04-09',
      caller: '+1 (555) 456-7890',
      duration: '2m 55s',
      callType: 'Outbound',
      agent: 'AI Agent 3',
      outcome: 'Follow-up Required',
      sentiment: 'Positive'
    }
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'neutral': return 'bg-blue-100 text-blue-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome.toLowerCase()) {
      case 'resolved': return <Check className="w-4 h-4 text-green-500" />;
      case 'escalated': return <ChevronDown className="w-4 h-4 text-orange-500" />;
      case 'follow-up required': return <Calendar className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
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
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1E4E]">Call Reports</h1>
          <p className="text-gray-600">Detailed analysis and insights from your calls</p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-[#0A1E4E] text-[#0A1E4E] hover:bg-[#0A1E4E] hover:text-white"
        >
          <Download className="w-4 h-4" />
          Export Reports
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Calls</p>
                <h3 className="text-2xl font-bold text-[#0A1E4E]">1,247</h3>
              </div>
              <Phone className="w-8 h-8 text-blue-100 bg-blue-50 p-1.5 rounded-lg" />
            </div>
            <p className="text-xs text-green-600 mt-2">+12% from last period</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Duration</p>
                <h3 className="text-2xl font-bold text-[#0A1E4E]">4m 12s</h3>
              </div>
              <Calendar className="w-8 h-8 text-purple-100 bg-purple-50 p-1.5 rounded-lg" />
            </div>
            <p className="text-xs text-green-600 mt-2">-30s from last period</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Resolution Rate</p>
                <h3 className="text-2xl font-bold text-[#0A1E4E]">92%</h3>
              </div>
              <PieChart className="w-8 h-8 text-green-100 bg-green-50 p-1.5 rounded-lg" />
            </div>
            <p className="text-xs text-green-600 mt-2">+5% from last period</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Sentiment Score</p>
                <h3 className="text-2xl font-bold text-[#0A1E4E]">7.8/10</h3>
              </div>
              <BarChart2 className="w-8 h-8 text-yellow-100 bg-yellow-50 p-1.5 rounded-lg" />
            </div>
            <p className="text-xs text-green-600 mt-2">+0.5 from last period</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by caller or agent"
                className="pl-10 bg-white border-gray-200"
              />
            </div>

            {/* Date Range Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 text-[#0A1E4E]">
                  <Calendar className="w-4 h-4" />
                  {dateRange}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setDateRange('Today')}>Today</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange('This Week')}>This Week</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange('This Month')}>This Month</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange('Custom Range')}>Custom Range</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter Button */}
            <Button variant="outline" className="border-gray-200">
              <Filter className="w-4 h-4" />
            </Button>
            
            {/* Apply Button */}
            <Button variant="primary">
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Call Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0A1E4E]">Call Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Caller</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Call Type</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.caller}</TableCell>
                  <TableCell>{report.duration}</TableCell>
                  <TableCell>{report.callType}</TableCell>
                  <TableCell>{report.agent}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getOutcomeIcon(report.outcome)}
                      {report.outcome}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getSentimentColor(report.sentiment)}`}>
                      {report.sentiment}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>View Transcript</DropdownMenuItem>
                        <DropdownMenuItem>Download Recording</DropdownMenuItem>
                        <DropdownMenuItem>Add Note</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls (simplified) */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">Showing 1-4 of 120 reports</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CallReportsDashboard;