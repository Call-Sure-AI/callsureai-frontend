"use client";

import { ActivityProvider } from '@/contexts/activity-context';
import { AgentProvider } from '@/contexts/agent-context';
import { CompanyProvider } from '@/contexts/company-context';
import { CampaignProvider } from '@/contexts/campaign-context';

interface AppProvidersProps {
    children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <ActivityProvider>
            <AgentProvider>
                <CompanyProvider>
                    <CampaignProvider>
                        {children}
                    </CampaignProvider>
                </CompanyProvider>
            </AgentProvider>
        </ActivityProvider>
    );
} 