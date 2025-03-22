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
            
            // Check for duplicate IDs
            const ids = new Set();
            const duplicates = [];
            data.forEach(agent => {
                if (ids.has(agent.id)) {
                    duplicates.push(agent.id);
                }
                ids.add(agent.id);
            });
            
            if (duplicates.length > 0) {
                console.warn("Found duplicate agent IDs:", duplicates);
            }
            
            setAgents(data);
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