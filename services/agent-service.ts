import { AgentFormData } from "@/types";

export const createAgent = async (formData: AgentFormData, token: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ...formData,
                created_at: new Date(),
                updated_at: new Date()
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create agent');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in createAgent:', error);
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/${id}`, {
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

export const updateAgent = async (id: string, formData: AgentFormData, token: string) => {
    try {
        console.log('Updating agent');
        console.log(formData);
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