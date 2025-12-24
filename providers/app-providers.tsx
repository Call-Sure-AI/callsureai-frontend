// providers/app-providers.tsx - Updated with Dashboard Metrics Provider
"use client";

import React from 'react';
import { ThemeProvider } from './theme-provider';
import { ActivityProvider } from '@/contexts/activity-context';
import { AgentProvider } from '@/contexts/agent-context';
import { CampaignProvider } from '@/contexts/campaign-context';
import { CompanyProvider } from '@/contexts/company-context';
import { TicketProvider } from '@/contexts/ticket-context';
import { DashboardMetricsProvider } from '@/contexts/dashboard-metrics-context';
import { Toaster } from '@/components/ui/toaster';

interface AppProvidersProps {
    children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <CompanyProvider>
                <AgentProvider>
                    <CampaignProvider>
                        <TicketProvider>
                            <ActivityProvider>
                                {/* DashboardMetricsProvider handles all WebSocket connections for real-time data */}
                                <DashboardMetricsProvider>
                                    {children}
                                    <Toaster />
                                </DashboardMetricsProvider>
                            </ActivityProvider>
                        </TicketProvider>
                    </CampaignProvider>
                </AgentProvider>
            </CompanyProvider>
        </ThemeProvider>
    );
}

export default AppProviders;