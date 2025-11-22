// contexts/agent-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AgentFormData } from '@/types';
import { getAgentsAction } from '@/lib/actions/agent-actions';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';

interface AgentContextType {
    agents: AgentFormData[];
    loading: boolean;
    refreshAgents: () => Promise<void>;
    totalAgents: number;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: React.ReactNode }) {
    const [agents, setAgents] = useState<AgentFormData[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: userLoading } = useCurrentUser(); // ✅ Get loading state
    // const { token } = useIsAuthenticated();

const fetchAgents = async () => {
    try {
        // ✅ Get token directly from localStorage
        const token = localStorage.getItem('token');
        if (!token || !user) return;
        
        setLoading(true);
        
        console.log('🔴 fetchAgents - Making API call with token:', token.substring(0, 20) + '...');
        const result = await getAgentsAction(token);
        console.log('🔴 fetchAgents - API result:', result);

        if (result.success && result.data) {
            console.log('🔴 fetchAgents - Setting agents:', result.data.length, 'agents');
            setAgents(result.data);
        } else {
            console.error('🔴 fetchAgents - Failed:', result.error);
            setAgents([]);
        }
    } catch (error: any) {
        console.error('🔴 fetchAgents - Exception:', error.message);
        setAgents([]);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        // ✅ Get token directly from localStorage
        const token = localStorage.getItem('token');
        console.log('🔴 Agent context effect - user:', user?.id, 'token:', !!token, 'userLoading:', userLoading);
        
        // ✅ Wait for user to finish loading
        if (userLoading) {
            console.log('🔴 Still loading user, waiting...');
            return;
        }
        
        if (user && token) {
            console.log('🔴 Calling fetchAgents NOW');
            fetchAgents();
        } else {
            console.log('🔴 NOT calling fetchAgents - user or token missing');
            setLoading(false);
        }
    }, [user, userLoading]); // ✅ Removed token from deps - we read it fresh each time

    return (
        <AgentContext.Provider value={{ agents, loading, refreshAgents: fetchAgents, totalAgents: agents.length ?? 0 }}>
            {children}
        </AgentContext.Provider>
    );
}

export const useAgents = () => {
    const context = useContext(AgentContext);
    if (context === undefined) {
        throw new Error('useAgents must be used within an AgentProvider');
    }
    return context;
};