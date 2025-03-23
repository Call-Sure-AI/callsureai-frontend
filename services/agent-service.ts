// services/agent-service.ts
import { AgentFormData } from "@/types";

/**
 * Creates an agent via the admin API
 */
export const createAdminAgent = async (params: AgentFormData, company_id: string, user_id: string) => {
    try {
        const formData = new FormData();
        formData.append('name', params.name);
        formData.append('user_id', user_id);
        formData.append('type', params.type);
        formData.append('prompt', params.prompt);
        formData.append('company_id', company_id);
        formData.append('additional_context', JSON.stringify(params.additional_context));
        formData.append('advanced_settings', JSON.stringify(params.advanced_settings));
        formData.append('is_active', JSON.stringify(params.is_active));

        formData.append('file_urls', JSON.stringify(params.files));

        const response = await fetch(`https://stage.callsure.ai/api/v1/admin/agents`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || result.message || 'Failed to create admin agent');
        }

        return result;
    } catch (error: any) {
        console.error('Error creating admin agent:', error);
        throw new Error(error?.message || 'Failed to create admin agent');
    }
}

export const createAgent = async (formData: AgentFormData, token: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create agent');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating agent:', error);
        throw error;
    }
};

export const getAllAgents = async (token: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get agents');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getAllAgents:', error);
        throw error;
    }
};

export const getAgentsByUserId = async (userId: string, token: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/user?user_id=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get agents');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getAgentsByUserId:', error);
        throw error;
    }
};

export const getAgentById = async (id: string, token: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent?id=${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get agent');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getAgentById:', error);
        throw error;
    }
};

export const updateAgent = async (id: string, formData: any, token: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ...formData,
                updated_at: new Date()
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update agent');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in updateAgent:', error);
        throw error;
    }
};

export const deleteAgent = async (id: string, token: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete agent');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in deleteAgent:', error);
        throw error;
    }
};