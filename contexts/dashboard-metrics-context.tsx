// contexts/dashboard-metrics-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useCompany } from '@/contexts/company-context';
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
    const { company, isLoading: companyLoading } = useCompany();
    const [period, setPeriod] = useState('week');
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    // Get company ID from company context (primary) or user (fallback)
    const companyId = useMemo(() => {
        if (company?.id) {
            console.log('📊 Dashboard Metrics using company ID from company context:', company.id);
            return company.id;
        }
        
        if (user) {
            const id = (user as any).company_id || (user as any).companyId || null;
            if (id) {
                console.log('📊 Dashboard Metrics using company ID from user:', id);
            }
            return id;
        }
        
        // Only log warning if NOT in build mode
        if (typeof window !== 'undefined') {  // ← Add this check
            console.log('⚠️ Dashboard Metrics: No company ID available');
        }
        return null;
    }, [company, user]);

    // ============== WebSocket Connections ==============

    // Company Metrics (Main Dashboard)
    const {
        data: rawCompanyMetrics,
        status: companyMetricsStatus,
        reconnect: reconnectCompanyMetrics,
        lastUpdate: companyMetricsLastUpdate,
    } = useCompanyMetrics(companyId, period);

    // Analytics
    const {
        data: rawAnalytics,
        status: analyticsStatus,
        reconnect: reconnectAnalytics,
        lastUpdate: analyticsLastUpdate,
    } = useAnalyticsWS(companyId);

    // Agent Stats
    const {
        data: rawAgentStats,
        status: agentStatsStatus,
        reconnect: reconnectAgentStats,
        lastUpdate: agentStatsLastUpdate,
    } = useAgentStatsWS(companyId);

    // Call Reports
    const {
        data: rawCallReports,
        status: callReportsStatus,
        reconnect: reconnectCallReports,
        lastUpdate: callReportsLastUpdate,
    } = useCallReportsWS(companyId, period);

    // Sentiment
    const {
        data: rawSentiment,
        status: sentimentStatus,
        reconnect: reconnectSentiment,
        lastUpdate: sentimentLastUpdate,
    } = useSentimentWS(companyId, period);

    // Urgency
    const {
        data: rawUrgency,
        status: urgencyStatus,
        reconnect: reconnectUrgency,
        lastUpdate: urgencyLastUpdate,
    } = useUrgencyWS(companyId, period);

    // Debug logging for urgency connection
    useEffect(() => {
        if (companyId) {
            console.log('🚨 Urgency WebSocket:', {
                status: urgencyStatus,
                companyId,
                period,
                hasData: !!rawUrgency,
                recordCount: rawUrgency?.records?.length || 0,
                lastUpdate: urgencyLastUpdate?.toISOString(),
                endpoint: `/api/urgency-detection/ws/${companyId}/${period}`
            });
        }
    }, [urgencyStatus, companyId, period, rawUrgency, urgencyLastUpdate]);

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

    // ✅ SENTIMENT TRANSFORMATION - UPDATED
    const sentiment = useMemo<SentimentData | null>(() => {
        if (!rawSentiment) return null;
        
        console.log('🔄 Transforming sentiment data:', {
            hasRecords: !!(rawSentiment.recent_calls || rawSentiment.records),
            recordCount: (rawSentiment.recent_calls || rawSentiment.records || []).length,
            hasSummary: !!rawSentiment.summary,
            hasTrend: !!rawSentiment.trend,
            rawSample: (rawSentiment.recent_calls || rawSentiment.records)?.[0],
        });
        
        // Helper to format duration from seconds to string
        const formatDuration = (seconds: number): string => {
            if (!seconds || seconds === 0) return '0m 0s';
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}m ${secs}s`;
        };
        
        // Helper to split datetime into date and time
        const splitDateTime = (datetime: string) => {
            const dt = new Date(datetime);
            return {
                date: dt.toISOString().split('T')[0], // "2025-12-30"
                time: dt.toTimeString().slice(0, 5),   // "14:30"
            };
        };
        
        // Transform records (recent_calls → records)
        const transformedRecords = (rawSentiment.recent_calls || rawSentiment.records || rawSentiment.data || []).map((record: any) => {
            const { date, time } = splitDateTime(record.datetime || record.timestamp || new Date().toISOString());
            
            return {
                id: record.id || `SEN${Math.random().toString(36).substr(2, 9)}`,
                date,
                time,
                caller: record.caller || record.phone_number || '',
                callerName: record.caller_name || record.callerName || undefined,
                agent: record.agent || 'AI Agent',
                duration: typeof record.duration === 'number' ? formatDuration(record.duration) : (record.duration || '0m 0s'),
                sentiment: (record.sentiment || 'Neutral') as 'Positive' | 'Neutral' | 'Negative',
                score: typeof record.score === 'number' ? (record.score / 10) : (record.score || 0.5), // Convert 0-10 to 0-1 scale
                keywords: record.key_phrases || record.keywords || [],
                summary: record.summary || undefined,
            };
        });
        
        // Transform trends (trend object → trends array)
        let transformedTrends: any[] = [];
        if (rawSentiment.trend && typeof rawSentiment.trend === 'object') {
            transformedTrends = Object.entries(rawSentiment.trend).map(([date, values]: [string, any]) => ({
                date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), // "Mon"
                positive: values.positive || 0,
                neutral: values.neutral || 0,
                negative: values.negative || 0,
                total: values.total || 0,
            }));
        } else if (rawSentiment.trends) {
            transformedTrends = rawSentiment.trends;
        }
        
        // Transform stats (summary → stats)
        const summary = rawSentiment.summary || rawSentiment.stats || {};
        const transformedStats = {
            positive: summary.positive_pct ?? summary.positive ?? 0,
            neutral: summary.neutral_pct ?? summary.neutral ?? 0,
            negative: summary.negative_pct ?? summary.negative ?? 0,
            avgScore: summary.average_score ?? summary.avg_score ?? summary.avgScore ?? 0,
            totalAnalyzed: summary.total_analyzed ?? summary.totalAnalyzed ?? transformedRecords.length,
            improvement: summary.improvement ?? 0,
        };
        
        console.log('✅ Transformed sentiment data:', {
            recordCount: transformedRecords.length,
            trendsCount: transformedTrends.length,
            stats: transformedStats,
            sampleTransformed: transformedRecords[0],
        });
        
        return {
            records: transformedRecords,
            trends: transformedTrends,
            stats: transformedStats,
        };
    }, [rawSentiment]);

    // ✅ URGENCY TRANSFORMATION - KEPT AS-IS (WORKING)
    const urgency = useMemo<UrgencyData | null>(() => {
        if (!rawUrgency) return null;
        
        console.log('🔄 Transforming urgency data:', {
            hasRecords: !!rawUrgency.records,
            recordCount: rawUrgency.records?.length || 0,
            hasStats: !!rawUrgency.stats,
            hasCategories: !!rawUrgency.categories,
            rawSample: rawUrgency.records?.[0], // Log first record to see structure
        });
        
        // Transform backend records to frontend format
        const transformedRecords = (rawUrgency.records ?? rawUrgency.data ?? []).map((record: any) => ({
            id: record.id || `URG${Math.random().toString(36).substr(2, 9)}`,
            timestamp: record.datetime || record.timestamp || new Date().toISOString(),
            caller: record.caller || '',
            name: record.name || record.caller_name || 'Unknown',
            duration: record.duration || '0m 0s',
            urgencyLevel: record.urgency || record.urgencyLevel || record.urgency_level || 'Low',
            triggerPhrases: record.trigger_phrases || record.triggerPhrases || [],
            status: record.status || 'Pending',
            agent: record.agent || 'AI Agent',
            category: record.category || 'General Inquiry',
            summary: record.summary || undefined,
        }));
        
        console.log('✅ Transformed urgency records:', {
            originalCount: rawUrgency.records?.length || 0,
            transformedCount: transformedRecords.length,
            sampleTransformed: transformedRecords[0],
        });
        
        return {
            records: transformedRecords,
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
        console.log('🔄 Refreshing all WebSocket connections...');
        reconnectCompanyMetrics();
        reconnectAnalytics();
        reconnectAgentStats();
        reconnectCallReports();
        reconnectSentiment();
        reconnectUrgency();
    }, [reconnectCompanyMetrics, reconnectAnalytics, reconnectAgentStats, reconnectCallReports, reconnectSentiment, reconnectUrgency]);

    // ============== Loading State ==============

    const isLoading = userLoading || companyLoading || (
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