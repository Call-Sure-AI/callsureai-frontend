// providers\app-providers.tsx
"use client";

import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { CompanyProvider } from "@/contexts/company-context";
import { AgentProvider } from "@/contexts/agent-context";
import { ActivityProvider } from "@/contexts/activity-context";
import { CampaignProvider } from "@/contexts/campaign-context";
import { TicketProvider } from "@/contexts/ticket-context";
import { Toaster } from "@/components/ui/toaster";

interface AppProvidersProps {
    children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
        >
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                <CompanyProvider>
                    <AgentProvider>
                        <ActivityProvider>
                            <CampaignProvider>
                                <TicketProvider>
                                    {children}
                                    <Toaster />
                                </TicketProvider>
                            </CampaignProvider>
                        </ActivityProvider>
                    </AgentProvider>
                </CompanyProvider>
            </GoogleOAuthProvider>
        </ThemeProvider>
    );
}