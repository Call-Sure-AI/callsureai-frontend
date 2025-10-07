// services/agent-service.ts
import { AgentFormData } from "@/types";

/**
 * Creates an agent via the admin API
 * IMPORTANT: When calling from server actions, you MUST pass the token parameter
 * The localStorage access only works in client-side code
 */
export const createAdminAgent = async (
    params: AgentFormData, 
    company_id: string, 
    user_id: string,
    token?: string
) => {
    try {
        console.log('Creating agent with data:', {
            name: params.name,
            type: params.type,
            company_id: company_id
        });

        // Only try to get token from localStorage if we're on the client AND no token was provided
        let authToken = token;
        if (!authToken && typeof window !== 'undefined') {
            authToken = localStorage.getItem('auth_token') || localStorage.getItem('token');
        }

        if (!authToken) {
            throw new Error('Authentication token not found. Please log in again.');
        }

        // Use the correct API endpoint from your routes/agent.py
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        
        // Create the agent data matching your backend schema (AgentCreate model)
        const agentData = {
            name: params.name,
            type: params.type,
            prompt: params.prompt,
            company_id: company_id,
            is_active: params.is_active !== undefined ? params.is_active : true,
            additional_context: params.additional_context || {},
            advanced_settings: params.advanced_settings || {},
            confidence_threshold: params.confidence_threshold || 0.7,
            files: params.files || [],
            template_id: params.template_id || null,
            knowledge_base_ids: params.knowledge_base_ids || [],
            database_integration_ids: params.database_integration_ids || [],
            search_config: params.search_config || null,
            max_response_tokens: params.max_response_tokens || null,
            temperature: params.temperature || null,
            image_processing_enabled: params.image_processing_enabled || null,
            image_processing_config: params.image_processing_config || null
        };

        // Use the correct endpoint: /api/agent/create
        console.log('Request URL:', `${apiUrl}/api/agent/create`);
        console.log('Agent data to send:', agentData);
        console.log('Has auth token:', !!authToken);

        const response = await fetch(`${apiUrl}/api/agent/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(agentData),
            credentials: 'include' // Include cookies if needed
        });

        // Try to parse JSON response
        let result;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            const textResponse = await response.text();
            try {
                result = textResponse ? JSON.parse(textResponse) : {};
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                throw new Error('Invalid response format from server');
            }
        }

        if (!response.ok) {
            console.error('API Error:', {
                status: response.status,
                statusText: response.statusText,
                result: result
            });
            throw new Error(result.error || result.message || result.detail || `Failed to create agent (${response.status})`);
        }

        console.log('Agent created successfully:', result);
        return result;
    } catch (error: any) {
        console.error('Error creating agent:', error);

        // Add more specific error messages based on the error type
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            throw new Error('Network error: Could not connect to the server. Please check your connection and try again.');
        }

        throw new Error(error?.message || 'Failed to create agent');
    }
};

/**
 * Creates an agent via the regular API
 * This uses the standard API endpoint and requires a token
 */
export const createAgent = async (formData: AgentFormData, token: string) => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        
        // Ensure company_id is included if not already present
        const agentData = {
            ...formData,
            company_id: formData.company_id // Ensure this is included
        };
        
        const response = await fetch(`${apiUrl}/api/agent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(agentData)
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        console.log('Using public API URL:', apiUrl);
        const response = await fetch(`${apiUrl}/api/agent/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Error data:', errorData);
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

/**
 * Helper function to get authentication token (client-side only)
 * Returns null if called on server-side
 */
export const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') {
        console.warn('getAuthToken called on server-side, returning null');
        return null;
    }
    // Try both possible token keys
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (!token) {
        console.warn('No authentication token found in localStorage');
    }
    return token;
};