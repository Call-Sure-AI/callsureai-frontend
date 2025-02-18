"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Search,
    Calendar,
    Phone,
    ArrowUpDown,
    Filter,
    Download,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const CallHistoryDashboard = () => {
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
                    <h1 className="text-2xl font-bold text-[#0A1E4E]">Call History</h1>
                    <p className="text-gray-600">View and manage your call records</p>
                </div>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 border-[#0A1E4E] text-[#0A1E4E] hover:bg-[#0A1E4E] hover:text-white"
                >
                    <Download className="w-4 h-4" />
                    Export
                </Button>
            </div>

            {/* Search and Filter Section */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by number/name"
                                className="pl-10 bg-white border-gray-200"
                            />
                        </div>

                        {/* Date Range Picker */}
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 text-[#0A1E4E]"
                            >
                                <Calendar className="w-4 h-4" />
                                13/11/2024 - 13/11/2024
                            </Button>

                            <Button
                                variant="primary"
                            >
                                Apply
                            </Button>

                            <Button
                                variant="outline"
                                className="border-gray-200"
                            >
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Call History Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-12">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </TableHead>
                                <TableHead>NUMBER</TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-2">
                                        CALLING STATUS
                                        <ArrowUpDown className="w-4 h-4" />
                                    </div>
                                </TableHead>
                                <TableHead>USER</TableHead>
                                <TableHead>COST</TableHead>
                                <TableHead>SUMMARY</TableHead>
                                <TableHead>RECORDING</TableHead>
                                <TableHead className="text-right">ACTION</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={8} className="h-64 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Phone className="w-8 h-8 text-gray-300" />
                                        No data found
                                    </div>
                                </TableCell>
                            </TableRow>

                            {/* Example data row (uncomment and multiply for more rows) */}
                            {/* <TableRow>
                                <TableCell>
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </TableCell>
                                <TableCell>+1 234 567 8900</TableCell>
                                <TableCell>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                        Completed
                                    </span>
                                </TableCell>
                                <TableCell>John Doe</TableCell>
                                <TableCell>$5.00</TableCell>
                                <TableCell>Support call regarding billing</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm">
                                        Play
                                    </Button>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow> */}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CallHistoryDashboard;