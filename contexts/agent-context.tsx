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
    const { user } = useCurrentUser();
    const { token } = useIsAuthenticated();

    const fetchAgents = async () => {
        try {
            if (!token || !user) return;
            setLoading(true);
            const result = await getAgentsAction(token);

            if (result.success && result.data) {
                setAgents(result.data);
            } else {
                console.error('Failed to fetch agents:', result.error);
                setAgents([]);
            }
        } catch (error: any) {
            console.error('Failed to fetch agents:', error.message);
            setAgents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && token) {
            fetchAgents();
        }
    }, [user, token]);

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