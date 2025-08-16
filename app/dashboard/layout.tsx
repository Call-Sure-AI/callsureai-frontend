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
        <>
            <Navbar />
            <div className="min-h-screen relative flex">
                {/* Desktop Sidebar */}
                <Sidebar />

                {/* Main Content Area - Responsive */}
                <div className="flex-1 relative lg:ml-0 pb-16 lg:pb-0">
                    {company && !company.address ? (
                        <>
                            <div className="absolute inset-0 bg-gray-900 opacity-50 z-10" />
                            <AlertMessage />
                            <div className="p-4 sm:p-6 lg:p-8 opacity-50 pointer-events-none">
                                {children}
                            </div>
                        </>
                    ) : (
                        <div className="p-4 sm:p-6 lg:p-8">
                            {children}
                        </div>
                    )}
                </div>

                {/* Activity Feed - Hidden on mobile */}
                <div className="hidden xl:block">
                    <ActivityFeed />
                </div>
            </div>

            {/* Mobile-specific spacing for bottom navigation */}
            <div className="h-16 lg:hidden" />
        </>
    );
}