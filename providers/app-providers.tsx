"use client";

import { ActivityProvider } from '@/contexts/activity-context';
import { AgentProvider } from '@/contexts/agent-context';

interface AppProvidersProps {
    children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <ActivityProvider>
            <AgentProvider>
                {children}
            </AgentProvider>
        </ActivityProvider>
    );
} 