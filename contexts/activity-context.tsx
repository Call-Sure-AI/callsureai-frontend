"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getAllActivities } from '@/services/activity-service';
import { useCurrentUser } from '@/hooks/use-current-user';

// Activity type based on backend response
interface Activity {
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
    refreshActivities: () => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: userLoading } = useCurrentUser();

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
            console.log('🟣 fetchActivities - Sample activity:', data?.[0]);
            
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
        } catch (error) {
            console.error('🟣 fetchActivities - Error:', error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        console.log('🟣 Activity context effect - user:', user?.id, 'userLoading:', userLoading);
        
        // Wait for user to finish loading
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

    const refreshActivities = useCallback(async () => {
        console.log('🟣 refreshActivities called');
        await fetchActivities();
    }, [fetchActivities]);

    return (
        <ActivityContext.Provider value={{ activities, loading, refreshActivities }}>
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