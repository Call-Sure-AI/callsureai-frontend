// contexts/activity-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { getAllActivities } from '@/services/activity-service';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useActivityLogWS, ConnectionStatus } from '@/hooks/use-realtime-ws';

// Activity type based on backend response
export interface Activity {
    id: string;
    user_id?: string;
    action: string;
    entity_type: string;
    entity_id?: string;
    metadata?: {
        name?: string;
        agent_name?: string;
        campaign_name?: string;
        business_name?: string;
        email?: string;
        type?: string;
        company_id?: string;
        updated_fields?: string[];
        [key: string]: any;
    };
    created_at?: string;
    user?: {
        name?: string;
        email?: string;
    };
}

interface ActivityContextType {
    activities: Activity[];
    loading: boolean;
    wsStatus: ConnectionStatus;
    isConnected: boolean;
    lastUpdate: Date | null;
    refreshActivities: () => Promise<void>;
    reconnect: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const { user, loading: userLoading } = useCurrentUser();

    // Get company ID from user
    const companyId = useMemo(() => {
        if (!user) return null;
        return (user as any).company_id || (user as any).companyId || null;
    }, [user]);

    // WebSocket connection for real-time updates
    const {
        data: wsData,
        status: wsStatus,
        isConnected,
        reconnect,
    } = useActivityLogWS(companyId, '7d');

    // Handle WebSocket data updates
    useEffect(() => {
        if (wsData) {
            console.log('🟣 Activity WS - Received data:', wsData);
            
            // Handle different message types
            if (wsData.type === 'initial' || wsData.type === 'full') {
                // Full data load
                const newActivities = wsData.activities ?? wsData.data ?? [];
                setActivities(Array.isArray(newActivities) ? newActivities : []);
            } else if (wsData.type === 'update' || wsData.type === 'new') {
                // Single new activity - prepend to list
                const newActivity = wsData.activity ?? wsData.data;
                if (newActivity) {
                    setActivities(prev => [newActivity, ...prev].slice(0, 100)); // Keep max 100
                }
            } else if (wsData.type === 'batch') {
                // Batch update
                const newActivities = wsData.activities ?? wsData.data ?? [];
                if (Array.isArray(newActivities)) {
                    setActivities(prev => [...newActivities, ...prev].slice(0, 100));
                }
            } else if (Array.isArray(wsData)) {
                // Direct array
                setActivities(wsData);
            } else if (wsData.activities && Array.isArray(wsData.activities)) {
                // Object with activities array
                setActivities(wsData.activities);
            }
            
            setLastUpdate(new Date());
            setLoading(false);
        }
    }, [wsData]);

    // REST API fallback for initial load
    const fetchActivities = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !user) {
                console.log('🟣 fetchActivities - No token or user, skipping');
                setLoading(false);
                return;
            }

            console.log('🟣 fetchActivities - Making API call');
            const data = await getAllActivities(token);
            console.log('🟣 fetchActivities - API returned:', data?.length || 0, 'activities');
            
            // Handle different response formats
            if (Array.isArray(data)) {
                setActivities(data);
            } else if (data?.activities && Array.isArray(data.activities)) {
                setActivities(data.activities);
            } else if (data?.data && Array.isArray(data.data)) {
                setActivities(data.data);
            } else {
                console.warn('🟣 fetchActivities - Unexpected response format:', data);
                setActivities([]);
            }
            
            setLastUpdate(new Date());
        } catch (error) {
            console.error('🟣 fetchActivities - Error:', error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Initial fetch via REST (WebSocket will take over for updates)
    useEffect(() => {
        console.log('🟣 Activity context effect - user:', user?.id, 'userLoading:', userLoading);
        
        if (userLoading) {
            console.log('🟣 Still loading user, waiting...');
            return;
        }
        
        if (user) {
            console.log('🟣 Calling fetchActivities NOW');
            fetchActivities();
        } else {
            console.log('🟣 NOT calling fetchActivities - no user');
            setLoading(false);
        }
    }, [user, userLoading, fetchActivities]);

    // Manual refresh
    const refreshActivities = useCallback(async () => {
        console.log('🟣 refreshActivities called');
        
        // If WebSocket is connected, just trigger reconnect
        if (isConnected) {
            reconnect();
        } else {
            // Fall back to REST API
            await fetchActivities();
        }
    }, [isConnected, reconnect, fetchActivities]);

    const value = useMemo(() => ({
        activities,
        loading,
        wsStatus,
        isConnected,
        lastUpdate,
        refreshActivities,
        reconnect,
    }), [activities, loading, wsStatus, isConnected, lastUpdate, refreshActivities, reconnect]);

    return (
        <ActivityContext.Provider value={value}>
            {children}
        </ActivityContext.Provider>
    );
}

export const useActivities = () => {
    const context = useContext(ActivityContext);
    if (context === undefined) {
        throw new Error('useActivities must be used within an ActivityProvider');
    }
    return context;
};

export default ActivityContext;