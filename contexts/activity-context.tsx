// contexts/activity-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Activity } from '@/types';
import { getAllActivities } from '@/services/activity-service';
import { useCurrentUser } from '@/hooks/use-current-user';

interface ActivityContextType {
    activities: Activity[];
    loading: boolean;
    refreshActivities: () => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: userLoading } = useCurrentUser(); // ✅ Get loading state

const fetchActivities = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token || !user) return;

        console.log('🟣 fetchActivities - Making API call');
        const data = await getAllActivities(token);
        console.log('🟣 fetchActivities - API returned:', data?.length || 0, 'activities');
        setActivities(data);
    } catch (error) {
        console.error('🟣 fetchActivities - Error:', error);
        setActivities([]);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        console.log('🟣 Activity context effect - user:', user?.id, 'userLoading:', userLoading);
        
        // ✅ Wait for user to finish loading
        if (userLoading) {
            console.log('🟣 Still loading user, waiting...');
            return;
        }
        
        if (user) {
            console.log('🟣 Calling fetchActivities NOW');
            fetchActivities();
        } else {
            console.log('🟣 NOT calling fetchActivities - no user');
            setLoading(false); // ✅ Set loading false if no user
        }
    }, [user, userLoading]); // ✅ Add userLoading to deps

    return (
        <ActivityContext.Provider value={{ activities, loading, refreshActivities: fetchActivities }}>
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