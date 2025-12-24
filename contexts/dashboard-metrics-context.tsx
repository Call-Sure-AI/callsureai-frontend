// contexts/dashboard-metrics-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { 
    useCompanyMetrics, 
    useAnalyticsWS, 
    useAgentStatsWS,
    useCallReportsWS,
    useSentimentWS,
    useUrgencyWS,
    ConnectionStatus 
} from '@/hooks/use-realtime-ws';

// ============== Types ==============

export interface CompanyMetrics {
    totalCalls: number;
    completedCalls: number;
    activeCalls: number;
    resolutionRate: number;
    totalBookings: number;
    creditBalance: number;
    avgCallDuration: string;
    trends: {
        calls: number;
        resolution: number;
        bookings: number;
    };
}

export interface AnalyticsData {
    callVolume: { name: string; calls: number }[];
    activeAgents: number;
    availableAgents: number;
    alerts: number;
    avgWaitTime: string;
    avgResponseTime: string;
}

export interface AgentStats {
    agents: {
        id: string;
        name: string;
        status: 'active' | 'idle' | 'offline';
        callsHandled: number;
        avgDuration: string;
        resolutionRate: number;
        sentiment: number;
    }[];
    totalActive: number;
    totalIdle: number;
    totalOffline: number;
}

export interface CallReport {
    id: string;
    date: string;
    time: string;
    caller: string;
    callerName?: string;
    duration: string;
    durationSeconds: number;
    callType: 'Inbound' | 'Outbound';
    agent: string;
    outcome: string;
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    tags?: string[];
}

export interface CallReportsData {
    reports: CallReport[];
    stats: {
        totalCalls: number;
        avgDuration: string;
        resolutionRate: number;
        sentimentScore: number;
        inboundCalls: number;
        outboundCalls: number;
    };
}

export interface SentimentData {
    records: {
        id: string;
        date: string;
        time: string;
        caller: string;
        callerName?: string;
        agent: string;
        duration: string;
        sentiment: 'Positive' | 'Neutral' | 'Negative';
        score: number;
        keywords: string[];
        summary?: string;
    }[];
    trends: {
        date: string;
        positive: number;
        neutral: number;
        negative: number;
        total: number;
    }[];
    stats: {
        positive: number;
        neutral: number;
        negative: number;
        avgScore: number;
        totalAnalyzed: number;
        improvement: number;
    };
}

export interface UrgencyData {
    records: {
        id: string;
        timestamp: string;
        caller: string;
        name: string;
        duration: string;
        urgencyLevel: 'High' | 'Medium' | 'Low';
        triggerPhrases: string[];
        status: 'Resolved' | 'In Progress' | 'Escalated' | 'Pending';
        agent: string;
        category: string;
        summary?: string;
    }[];
    stats: {
        high: { value: number; change: number; trend: 'up' | 'down' };
        medium: { value: number; change: number; trend: 'up' | 'down' };
        low: { value: number; change: number; trend: 'up' | 'down' };
        avgResponse: { value: string; change: number; trend: 'up' | 'down' };
    };
    categories: {
        category: string;
        high: number;
        medium: number;
        low: number;
        total: number;
    }[];
}

export interface DashboardMetricsContextType {
    // Company Metrics (Main Dashboard)
    companyMetrics: CompanyMetrics | null;
    companyMetricsStatus: ConnectionStatus;
    
    // Analytics Dashboard
    analytics: AnalyticsData | null;
    analyticsStatus: ConnectionStatus;
    
    // Agent Stats
    agentStats: AgentStats | null;
    agentStatsStatus: ConnectionStatus;
    
    // Call Reports
    callReports: CallReportsData | null;
    callReportsStatus: ConnectionStatus;
    
    // Sentiment Analysis
    sentiment: SentimentData | null;
    sentimentStatus: ConnectionStatus;
    
    // Urgency Detection
    urgency: UrgencyData | null;
    urgencyStatus: ConnectionStatus;
    
    // Period controls
    period: string;
    setPeriod: (period: string) => void;
    
    // Global
    companyId: string | null;
    isLoading: boolean;
    lastUpdate: Date | null;
    
    // Actions
    refreshAll: () => void;
}

// ============== Default Values ==============

const defaultCompanyMetrics: CompanyMetrics = {
    totalCalls: 0,
    completedCalls: 0,
    activeCalls: 0,
    resolutionRate: 0,
    totalBookings: 0,
    creditBalance: 0,
    avgCallDuration: '0m 0s',
    trends: { calls: 0, resolution: 0, bookings: 0 },
};

const defaultAnalytics: AnalyticsData = {
    callVolume: [],
    activeAgents: 0,
    availableAgents: 0,
    alerts: 0,
    avgWaitTime: '0m 0s',
    avgResponseTime: '0s',
};

const defaultAgentStats: AgentStats = {
    agents: [],
    totalActive: 0,
    totalIdle: 0,
    totalOffline: 0,
};

const defaultCallReports: CallReportsData = {
    reports: [],
    stats: {
        totalCalls: 0,
        avgDuration: '0m 0s',
        resolutionRate: 0,
        sentimentScore: 0,
        inboundCalls: 0,
        outboundCalls: 0,
    },
};

const defaultSentiment: SentimentData = {
    records: [],
    trends: [],
    stats: {
        positive: 0,
        neutral: 0,
        negative: 0,
        avgScore: 0,
        totalAnalyzed: 0,
        improvement: 0,
    },
};

const defaultUrgency: UrgencyData = {
    records: [],
    stats: {
        high: { value: 0, change: 0, trend: 'up' },
        medium: { value: 0, change: 0, trend: 'up' },
        low: { value: 0, change: 0, trend: 'up' },
        avgResponse: { value: '0m 0s', change: 0, trend: 'up' },
    },
    categories: [],
};

// ============== Context ==============

const DashboardMetricsContext = createContext<DashboardMetricsContextType | undefined>(undefined);

// ============== Provider ==============

export function DashboardMetricsProvider({ children }: { children: React.ReactNode }) {
    const { user, loading: userLoading } = useCurrentUser();
    const [period, setPeriod] = useState('week');
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    // Get company ID from user
    const companyId = useMemo(() => {
        if (!user) return null;
        return (user as any).company_id || (user as any).companyId || null;
    }, [user]);

    // ============== WebSocket Connections ==============

    // Company Metrics (Main Dashboard)
    const {
        data: rawCompanyMetrics,
        status: companyMetricsStatus,
        reconnect: reconnectCompanyMetrics,
    } = useCompanyMetrics(companyId, period);

    // Analytics
    const {
        data: rawAnalytics,
        status: analyticsStatus,
        reconnect: reconnectAnalytics,
    } = useAnalyticsWS(companyId);

    // Agent Stats
    const {
        data: rawAgentStats,
        status: agentStatsStatus,
        reconnect: reconnectAgentStats,
    } = useAgentStatsWS(companyId);

    // Call Reports
    const {
        data: rawCallReports,
        status: callReportsStatus,
        reconnect: reconnectCallReports,
    } = useCallReportsWS(companyId, period);

    // Sentiment
    const {
        data: rawSentiment,
        status: sentimentStatus,
        reconnect: reconnectSentiment,
    } = useSentimentWS(companyId, period);

    // Urgency
    const {
        data: rawUrgency,
        status: urgencyStatus,
        reconnect: reconnectUrgency,
    } = useUrgencyWS(companyId, period);

    // ============== Transform Raw Data ==============

    const companyMetrics = useMemo<CompanyMetrics | null>(() => {
        if (!rawCompanyMetrics) return null;
        // Transform backend data to our format
        return {
            totalCalls: rawCompanyMetrics.total_calls ?? rawCompanyMetrics.totalCalls ?? 0,
            completedCalls: rawCompanyMetrics.completed_calls ?? rawCompanyMetrics.completedCalls ?? 0,
            activeCalls: rawCompanyMetrics.active_calls ?? rawCompanyMetrics.activeCalls ?? 0,
            resolutionRate: rawCompanyMetrics.resolution_rate ?? rawCompanyMetrics.resolutionRate ?? 0,
            totalBookings: rawCompanyMetrics.total_bookings ?? rawCompanyMetrics.totalBookings ?? 0,
            creditBalance: rawCompanyMetrics.credit_balance ?? rawCompanyMetrics.creditBalance ?? 0,
            avgCallDuration: rawCompanyMetrics.avg_call_duration ?? rawCompanyMetrics.avgCallDuration ?? '0m 0s',
            trends: {
                calls: rawCompanyMetrics.trends?.calls ?? 0,
                resolution: rawCompanyMetrics.trends?.resolution ?? 0,
                bookings: rawCompanyMetrics.trends?.bookings ?? 0,
            },
        };
    }, [rawCompanyMetrics]);

    const analytics = useMemo<AnalyticsData | null>(() => {
        if (!rawAnalytics) return null;
        return {
            callVolume: rawAnalytics.call_volume ?? rawAnalytics.callVolume ?? [],
            activeAgents: rawAnalytics.active_agents ?? rawAnalytics.activeAgents ?? 0,
            availableAgents: rawAnalytics.available_agents ?? rawAnalytics.availableAgents ?? 0,
            alerts: rawAnalytics.alerts ?? 0,
            avgWaitTime: rawAnalytics.avg_wait_time ?? rawAnalytics.avgWaitTime ?? '0m 0s',
            avgResponseTime: rawAnalytics.avg_response_time ?? rawAnalytics.avgResponseTime ?? '0s',
        };
    }, [rawAnalytics]);

    const agentStats = useMemo<AgentStats | null>(() => {
        if (!rawAgentStats) return null;
        return {
            agents: (rawAgentStats.agents ?? []).map((agent: any) => ({
                id: agent.id,
                name: agent.name,
                status: agent.status ?? 'offline',
                callsHandled: agent.calls_handled ?? agent.callsHandled ?? 0,
                avgDuration: agent.avg_duration ?? agent.avgDuration ?? '0m 0s',
                resolutionRate: agent.resolution_rate ?? agent.resolutionRate ?? 0,
                sentiment: agent.sentiment ?? 0,
            })),
            totalActive: rawAgentStats.total_active ?? rawAgentStats.totalActive ?? 0,
            totalIdle: rawAgentStats.total_idle ?? rawAgentStats.totalIdle ?? 0,
            totalOffline: rawAgentStats.total_offline ?? rawAgentStats.totalOffline ?? 0,
        };
    }, [rawAgentStats]);

    const callReports = useMemo<CallReportsData | null>(() => {
        if (!rawCallReports) return null;
        return {
            reports: (rawCallReports.reports ?? rawCallReports.data ?? []).map((report: any) => ({
                id: report.id,
                date: report.date,
                time: report.time,
                caller: report.caller ?? report.phone_number,
                callerName: report.caller_name ?? report.callerName,
                duration: report.duration,
                durationSeconds: report.duration_seconds ?? report.durationSeconds ?? 0,
                callType: report.call_type ?? report.callType ?? 'Inbound',
                agent: report.agent ?? report.agent_name,
                outcome: report.outcome ?? report.status,
                sentiment: report.sentiment ?? 'Neutral',
                tags: report.tags ?? [],
            })),
            stats: {
                totalCalls: rawCallReports.stats?.total_calls ?? rawCallReports.stats?.totalCalls ?? 0,
                avgDuration: rawCallReports.stats?.avg_duration ?? rawCallReports.stats?.avgDuration ?? '0m 0s',
                resolutionRate: rawCallReports.stats?.resolution_rate ?? rawCallReports.stats?.resolutionRate ?? 0,
                sentimentScore: rawCallReports.stats?.sentiment_score ?? rawCallReports.stats?.sentimentScore ?? 0,
                inboundCalls: rawCallReports.stats?.inbound_calls ?? rawCallReports.stats?.inboundCalls ?? 0,
                outboundCalls: rawCallReports.stats?.outbound_calls ?? rawCallReports.stats?.outboundCalls ?? 0,
            },
        };
    }, [rawCallReports]);

    const sentiment = useMemo<SentimentData | null>(() => {
        if (!rawSentiment) return null;
        return {
            records: rawSentiment.records ?? rawSentiment.data ?? [],
            trends: rawSentiment.trends ?? [],
            stats: {
                positive: rawSentiment.stats?.positive ?? 0,
                neutral: rawSentiment.stats?.neutral ?? 0,
                negative: rawSentiment.stats?.negative ?? 0,
                avgScore: rawSentiment.stats?.avg_score ?? rawSentiment.stats?.avgScore ?? 0,
                totalAnalyzed: rawSentiment.stats?.total_analyzed ?? rawSentiment.stats?.totalAnalyzed ?? 0,
                improvement: rawSentiment.stats?.improvement ?? 0,
            },
        };
    }, [rawSentiment]);

    const urgency = useMemo<UrgencyData | null>(() => {
        if (!rawUrgency) return null;
        return {
            records: rawUrgency.records ?? rawUrgency.data ?? [],
            stats: rawUrgency.stats ?? defaultUrgency.stats,
            categories: rawUrgency.categories ?? [],
        };
    }, [rawUrgency]);

    // ============== Update timestamp ==============

    useEffect(() => {
        if (rawCompanyMetrics || rawAnalytics || rawAgentStats || rawCallReports || rawSentiment || rawUrgency) {
            setLastUpdate(new Date());
        }
    }, [rawCompanyMetrics, rawAnalytics, rawAgentStats, rawCallReports, rawSentiment, rawUrgency]);

    // ============== Actions ==============

    const refreshAll = useCallback(() => {
        reconnectCompanyMetrics();
        reconnectAnalytics();
        reconnectAgentStats();
        reconnectCallReports();
        reconnectSentiment();
        reconnectUrgency();
    }, [reconnectCompanyMetrics, reconnectAnalytics, reconnectAgentStats, reconnectCallReports, reconnectSentiment, reconnectUrgency]);

    // ============== Loading State ==============

    const isLoading = userLoading || (
        companyId !== null && 
        companyMetricsStatus === 'connecting' &&
        analyticsStatus === 'connecting'
    );

    // ============== Context Value ==============

    const value = useMemo<DashboardMetricsContextType>(() => ({
        companyMetrics,
        companyMetricsStatus,
        analytics,
        analyticsStatus,
        agentStats,
        agentStatsStatus,
        callReports,
        callReportsStatus,
        sentiment,
        sentimentStatus,
        urgency,
        urgencyStatus,
        period,
        setPeriod,
        companyId,
        isLoading,
        lastUpdate,
        refreshAll,
    }), [
        companyMetrics, companyMetricsStatus,
        analytics, analyticsStatus,
        agentStats, agentStatsStatus,
        callReports, callReportsStatus,
        sentiment, sentimentStatus,
        urgency, urgencyStatus,
        period, companyId, isLoading, lastUpdate, refreshAll
    ]);

    return (
        <DashboardMetricsContext.Provider value={value}>
            {children}
        </DashboardMetricsContext.Provider>
    );
}

// ============== Hook ==============

export function useDashboardMetrics() {
    const context = useContext(DashboardMetricsContext);
    if (context === undefined) {
        throw new Error('useDashboardMetrics must be used within a DashboardMetricsProvider');
    }
    return context;
}

// Export default values for fallback
export const defaults = {
    companyMetrics: defaultCompanyMetrics,
    analytics: defaultAnalytics,
    agentStats: defaultAgentStats,
    callReports: defaultCallReports,
    sentiment: defaultSentiment,
    urgency: defaultUrgency,
};

export default DashboardMetricsContext;