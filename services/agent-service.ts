// services/agent-service.ts
import { AgentFormData } from "@/types";

/**
 * Creates an agent via the admin API
 */
export const createAdminAgent = async (params: AgentFormData, company_id: string, user_id: string) => {
    try {
        console.log('Creating admin agent with data:', {
            name: params.name,
            type: params.type,
            company_id: company_id
        });

        const formData = new FormData();
        formData.append('name', params.name);
        formData.append('user_id', user_id);
        formData.append('type', params.type);
        formData.append('prompt', params.prompt);
        formData.append('company_id', company_id);
        formData.append('additional_context', JSON.stringify(params.additional_context));
        formData.append('advanced_settings', JSON.stringify(params.advanced_settings));
        formData.append('is_active', JSON.stringify(params.is_active));

        if (params.files && params.files.length > 0) {
            formData.append('file_urls', JSON.stringify(params.files));
        }

        // Get the token from localStorage (or wherever you store it)
        const token = localStorage.getItem('auth_token');

        // Log request info for debugging
        console.log('Request URL:', `${process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://stage.callsure.ai'}/api/v1/admin/agents`);
        console.log('FormData entries:', [...formData.entries()].map(e => e[0]));

        const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://stage.callsure.ai'}/api/v1/admin/agents`, {
            method: 'POST',
            body: formData,
            // headers: {
            //     // Don't set Content-Type with FormData, browser will set it with boundary
            //     'Authorization': token ? `Bearer ${token}` : '' 
            // },
            // Important for cross-origin requests with credentials
            credentials: 'include'
        });

        // Try to parse JSON response
        let result;
        try {
            const textResponse = await response.text();
            result = textResponse ? JSON.parse(textResponse) : {};
        } catch (parseError) {
            console.error('Error parsing response:', parseError);
            throw new Error('Invalid response format from server');
        }

        if (!response.ok) {
            throw new Error(result.error || result.message || `Failed to create admin agent (${response.status})`);
        }

        return result;
    } catch (error: any) {
        console.error('Error creating admin agent:', error);

        // Add more specific error messages based on the error type
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            throw new Error('Network error: Could not connect to the server. Please check your connection and try again.');
        }

        throw new Error(error?.message || 'Failed to create admin agent');
    }
};

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
        // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        // console.log('Using public API URL:', apiUrl);
        const response = await fetch(`https://beta.callsure.ai/api/agent`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get agents');
        }

        const data = await response.json();
        console.log('Agents data:', data);

        return data;
    } catch (error) {
        console.error('Error in getAllAgents:', error);
        throw error;
    }
};

export const getAgentsByUserId = async (userId: string, token: string) => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        const response = await fetch(`${apiUrl}/api/agent/user?user_id=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        const response = await fetch(`${apiUrl}/api/agent?id=${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        const response = await fetch(`${apiUrl}/api/agent/${id}`, {
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        const response = await fetch(`${apiUrl}/api/agent/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
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