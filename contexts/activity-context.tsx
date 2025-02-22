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
    const { user } = useCurrentUser();

    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !user) return;

            const data = await getAllActivities(token);
            setActivities(data);
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchActivities();
        }
    }, [user]);

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