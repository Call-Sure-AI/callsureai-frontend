// services/campaign-service.ts
import { CampaignFormData, CampaignResponse } from '@/types/campaign';

/**
 * Creates a new campaign via the API
 */
export const createCampaign = async (formData: CampaignFormData, token: string): Promise<CampaignResponse> => {
    try {
        console.log('Creating campaign with data:', {
            campaign_name: formData.campaign_name,
            description: formData.description,
            agent_id: formData.agent_id
        });

        const apiFormData = new FormData();

        // Add basic campaign info
        apiFormData.append('campaign_name', formData.campaign_name);
        apiFormData.append('description', formData.description);
        apiFormData.append('agent_id', formData.agent_id);

        // Add data mapping
        apiFormData.append('data_mapping', JSON.stringify(formData.data_mapping));

        // Add booking config if enabled
        if (formData.booking_config) {
            apiFormData.append('booking_config', JSON.stringify(formData.booking_config));
        }

        // Add automation config
        apiFormData.append('automation_config', JSON.stringify(formData.automation_config));

        // Add CSV file if provided
        if (formData.leads_csv) {
            apiFormData.append('leads_csv', formData.leads_csv);
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        const response = await fetch(`${apiUrl}/api/campaigns/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: apiFormData
        });

        console.log('Campaign creation response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: `Server returned ${response.status}: ${response.statusText}`
            }));
            throw new Error(errorData.error || errorData.message || 'Failed to create campaign');
        }

        const result = await response.json();

        return result;
    } catch (error: any) {
        console.error('Error creating campaign:', error);

        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            throw new Error('Network error: Could not connect to the server. Please check your connection and try again.');
        }

        throw new Error(error?.message || 'Failed to create campaign');
    }
};

/**
 * Gets all campaigns for the company
 */
export const getAllCampaigns = async (token: string, companyId: string, limit: number = 50, offset: number = 0): Promise<CampaignResponse[]> => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        const response = await fetch(`${apiUrl}/api/campaigns/company/${companyId}?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to get campaigns' }));
            throw new Error(errorData.error || 'Failed to get campaigns');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
    }
};

/**
 * Gets a specific campaign by ID
 */
export const getCampaignById = async (id: string, token: string): Promise<CampaignResponse> => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        const response = await fetch(`${apiUrl}/api/campaigns/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to get campaign' }));
            throw new Error(errorData.error || 'Failed to get campaign');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching campaign:', error);
        throw error;
    }
};

/**
 * Updates campaign status (start, pause, stop)
 */
export const updateCampaignStatus = async (id: string, status: 'active' | 'paused' | 'stopped', token: string): Promise<CampaignResponse> => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        const response = await fetch(`${apiUrl}/api/campaigns/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to update campaign status' }));
            throw new Error(errorData.error || 'Failed to update campaign status');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating campaign status:', error);
        throw error;
    }
};