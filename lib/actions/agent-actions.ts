"use server";

import { getAllAgents, createAdminAgent } from '@/services/agent-service';
import { AgentFormData } from '@/types';

export async function getAgentsAction(token: string) {
    try {
        if (!token) {
            throw new Error('Authentication token is required');
        }
        console.log('Getting agents with token:', token.substring(0, 10) + '...');

        const agents = await getAllAgents(token);
        console.log('Agents fetched successfully:', agents?.length || 0);
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
    user_id: string,
    token: string // ADD TOKEN PARAMETER HERE
) {
    try {
        if (!formData || !companyId || !user_id || !token) {
            throw new Error('Missing required parameters');
        }

        console.log('Creating agent via server action with token:', token.substring(0, 10) + '...');
        
        // NOW PASS THE TOKEN TO createAdminAgent
        const result = await createAdminAgent(formData, companyId, user_id, token);
        
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