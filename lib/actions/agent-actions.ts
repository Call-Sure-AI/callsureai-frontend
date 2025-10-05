"use server";

import { getAllAgents, createAdminAgent } from '@/services/agent-service';
import { AgentFormData } from '@/types';

export async function getAgentsAction(token: string) {
    try {
        if (!token) {
            throw new Error('Authentication token is required');
        }
        console.log('Getting agents with token:', token);

        const agents = await getAllAgents(token);
        console.log('Agents:', agents);
        return {
            success: true,
            data: agents,
            error: null
        };
    } catch (error: any) {
        console.error('Server action error:', error);
        return {
            success: false,
            data: null,
            error: error.message || 'Failed to fetch agents'
        };
    }
}

export async function createAgentAction(
    formData: AgentFormData,
    companyId: string,
    userId: string
) {
    try {
        if (!formData || !companyId || !userId) {
            throw new Error('Missing required parameters');
        }

        const result = await createAdminAgent(formData, companyId, userId);
        return {
            success: true,
            data: result,
            error: null
        };
    } catch (error: any) {
        console.error('Server action error:', error);
        return {
            success: false,
            data: null,
            error: error.message || 'Failed to create agent'
        };
    }
}
