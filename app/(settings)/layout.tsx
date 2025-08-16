// app\(settings)\layout.tsx
"use client";

import React from 'react';
import ActivityFeed from "@/components/dashboard/activity-bar";
import Navbar from "@/components/dashboard/navbar";
import Sidebar from "@/components/dashboard/sidebar";

export default function SettingsLayout({
    children,
}: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <div className="min-h-screen relative flex">
                {/* Desktop Sidebar */}
                <Sidebar />
                
                {/* Main Content Area - Responsive */}
                <div className="flex-1 relative lg:ml-0 pb-16 lg:pb-0">
                    {children}
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