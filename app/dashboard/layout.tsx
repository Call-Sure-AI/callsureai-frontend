// app\dashboard\layout.tsx
"use client";

import React from 'react';
import ActivityFeed from "@/components/dashboard/activity-bar";
import Navbar from "@/components/dashboard/navbar";
import Sidebar from "@/components/dashboard/sidebar";
import { useCompany } from "@/contexts/company-context";
import { AlertMessage } from '@/components/dashboard/alert-message';

export default function DashboardLayout({
    children,
}: { children: React.ReactNode }) {
    const { company } = useCompany();

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#030712] dark:via-[#0a0f1e] dark:to-[#030712]">
            {/* Background Effects - Fixed */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Light mode */}
                <div className="absolute inset-0 dark:hidden">
                    <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-[100px]" />
                </div>
                {/* Dark mode */}
                <div className="absolute inset-0 hidden dark:block">
                    <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-[100px]" />
                </div>
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear_gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            {/* Navbar - Fixed at top */}
            <div className="relative z-50">
                <Navbar />
            </div>

            {/* Main Layout - Takes remaining height */}
            <div className="relative flex h-[calc(100vh-64px)]">
                {/* Desktop Sidebar - Fixed */}
                <Sidebar />

                {/* Main Content Area - Scrollable */}
                <main className="flex-1 relative lg:ml-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {company && !company.address ? (
                        <>
                            <div className="absolute inset-0 bg-gray-900/50 dark:bg-black/50 backdrop-blur-sm z-10" />
                            <AlertMessage />
                            <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 opacity-50 pointer-events-none">
                                {children}
                            </div>
                        </>
                    ) : (
                        <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
                            {children}
                        </div>
                    )}
                </main>

                {/* Activity Feed - Fixed on right, hidden on smaller screens */}
                <div className="hidden xl:block flex-shrink-0">
                    <ActivityFeed />
                </div>
            </div>

            {/* Mobile Navigation Spacer */}
            <div className="h-16 lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-100 dark:from-[#030712] to-transparent pointer-events-none" />
        </div>
    );
}