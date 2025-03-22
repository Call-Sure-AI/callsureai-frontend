// services/agent-service.ts
import { AgentFormData } from "@/types";

/**
 * Creates an agent via the admin API
 */
export const createAdminAgent = async (agentData: AgentFormData, companyId: string, userId: string) => {
    try {
      const formData = new FormData();
      console.log("Creating admin agent with ID:", agentData.id);

      // Add the agent ID if it exists
      if (agentData.id) {
        formData.append('id', agentData.id);
        console.log("Added ID to form data:", agentData.id);
      }
      
      // Add base agent data
      formData.append('name', agentData.name);
      formData.append('type', agentData.type);
      formData.append('company_id', companyId);
      formData.append('prompt', agentData.prompt);
      formData.append('is_active', String(agentData.is_active));
      formData.append('user_id', userId);
      
      // Add additional context if present
      if (agentData.additional_context) {
        formData.append('additional_context', JSON.stringify(agentData.additional_context));
      }
      
      // Add advanced settings if present
      if (agentData.advanced_settings) {
        formData.append('advanced_settings', JSON.stringify(agentData.advanced_settings));
      }
      
      // Add file URLs if present
      if (agentData.files && agentData.files.length > 0) {
        formData.append('file_urls', JSON.stringify(agentData.files));
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/api/v1/admin/agents`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create agent in admin API');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating admin agent:', error);
      throw error;
    }
  };

  export const createAgent = async (agentData: AgentFormData, token: string) => {
    try {
        console.log("PARAMS", agentData);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent`, {
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
    
        // Get the created agent
        const createdAgent = await response.json();
        console.log("Created agent:", createdAgent);
        
        // Check if this agent already exists (shouldn't happen, but checking)
        const allAgents = await getAllAgents(token);
        const matchingAgents = allAgents.filter(a => 
            a.name === createdAgent.name && a.id !== createdAgent.id
        );
        
        if (matchingAgents.length > 0) {
            console.warn("Warning: Found duplicate agents with same name but different IDs:", matchingAgents);
        }
    
        return createdAgent;
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