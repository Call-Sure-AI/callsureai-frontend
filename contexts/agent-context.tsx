// contexts/agent-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AgentFormData } from '@/types';
import { getAllAgents } from '@/services/agent-service';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';

interface AgentContextType {
    agents: AgentFormData[];
    loading: boolean;
    refreshAgents: () => Promise<void>;
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
            const data = await getAllAgents(token);
            console.log("Fetched agents:", data);
            
            // Deduplicate agents by name (since your problem is showing two identical agents)
            const uniqueAgents: AgentFormData[] = [];
            const nameMap = new Map();
            
            data.forEach((agent: AgentFormData) => {
                if (!nameMap.has(agent.name)) {
                    nameMap.set(agent.name, agent);
                    uniqueAgents.push(agent);
                }
            });
            
            console.log("Filtered unique agents by name:", uniqueAgents);
            
            setAgents(uniqueAgents);
        } catch (error) {
            console.error('Failed to fetch agents:', error);
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
        <AgentContext.Provider value={{ agents, loading, refreshAgents: fetchAgents }}>
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