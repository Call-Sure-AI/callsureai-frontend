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
                <Sidebar />

                <div className="flex-1 relative">
                    {company && !company.address ? (
                        <>
                            <div className="absolute inset-0 bg-gray-900 opacity-50 z-10" />
                            <AlertMessage />
                            <div className="p-8 opacity-50 pointer-events-none">
                                {children}
                            </div>
                        </>
                    ) : (
                        children
                    )}
                </div>

                <ActivityFeed />
            </div>
        </>
    );
}