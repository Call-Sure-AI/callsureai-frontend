// services/webhook-service.ts
import { DataMapping } from '@/types/campaign';

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';

export interface CampaignTriggerPayload {
    campaign_id: string;
    agent_id: string;
    service: string;
    delay_between_calls: number;
    max_concurrent_calls: number;
    file_url: string;
    data_mapping: {
        phone_number_column: string;
        country_code_column: string;
    };
}

/**
 * Extracts phone number and country code columns from data mapping
 */
const extractPhoneMapping = (dataMapping: DataMapping[]): { phone_number_column: string; country_code_column: string } => {
    const phoneMapping = dataMapping.find(mapping => mapping.mapped_to === 'phone');
    const countryCodeMapping = dataMapping.find(mapping => mapping.mapped_to === 'country_code');

    return {
        phone_number_column: phoneMapping?.csv_column || '',
        country_code_column: countryCodeMapping?.csv_column || ''
    };
};

/**
 * Creates a campaign trigger payload from campaign data
 */
export const createCampaignTriggerPayload = (
    campaignId: string,
    agentId: string,
    automationConfig: any,
    fileUrl: string,
    dataMapping: DataMapping[]
): CampaignTriggerPayload => {
    const phoneMapping = extractPhoneMapping(dataMapping);

    return {
        campaign_id: campaignId,
        agent_id: agentId,
        service: "elevenlabs",
        delay_between_calls: automationConfig?.delay_between_calls || 5,
        max_concurrent_calls: automationConfig?.max_concurrent_calls || 3,
        file_url: fileUrl,
        data_mapping: phoneMapping
    };
};

/**
 * Starts a campaign using the proper API endpoint
 */
export const triggerCampaign = async (payload: CampaignTriggerPayload, token?: string): Promise<boolean> => {
    try {
        console.log('Starting campaign:', payload.campaign_id);

        // Use the proper API endpoint for starting campaigns
        const response = await fetch(`${getApiUrl()}/api/campaigns/${payload.campaign_id}/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        });

        console.log('Campaign start response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: `Server returned ${response.status}: ${response.statusText}`
            }));
            throw new Error(errorData.error || errorData.message || 'Failed to start campaign');
        }

        const result = await response.json();
        console.log('Campaign started successfully:', result);

        return true;
    } catch (error: any) {
        console.error('Error starting campaign:', error);

        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            throw new Error('Network error: Could not connect to the server. Please check your connection and try again.');
        }

        throw new Error(error?.message || 'Failed to start campaign');
    }
};

/**
 * Pauses a running campaign
 */
export const pauseCampaignWebhook = async (campaignId: string, token?: string): Promise<boolean> => {
    try {
        console.log('Pausing campaign:', campaignId);

        const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify({ status: 'paused' })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || 'Failed to pause campaign');
        }

        console.log('Campaign paused successfully');
        return true;
    } catch (error: any) {
        console.error('Error pausing campaign:', error);
        throw new Error(error?.message || 'Failed to pause campaign');
    }
};

/**
 * Resumes a paused campaign
 */
export const resumeCampaignWebhook = async (campaignId: string, token?: string): Promise<boolean> => {
    try {
        console.log('Resuming campaign:', campaignId);

        const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/resume`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || 'Failed to resume campaign');
        }

        console.log('Campaign resumed successfully');
        return true;
    } catch (error: any) {
        console.error('Error resuming campaign:', error);
        throw new Error(error?.message || 'Failed to resume campaign');
    }
};

/**
 * Completes/stops a campaign
 */
export const completeCampaignWebhook = async (campaignId: string, token?: string): Promise<boolean> => {
    try {
        console.log('Completing campaign:', campaignId);

        const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || 'Failed to complete campaign');
        }

        console.log('Campaign completed successfully');
        return true;
    } catch (error: any) {
        console.error('Error completing campaign:', error);
        throw new Error(error?.message || 'Failed to complete campaign');
    }
};

/**
 * Initiates calls to leads in a campaign
 */
export const initiateCallsWebhook = async (
    campaignId: string, 
    config: {
        leadFilters?: {
            max_call_attempts?: number;
            limit?: number;
        };
        callSettings?: {
            script_id?: string;
            voice?: string;
        };
        rateLimitSeconds?: number;
        maxConcurrentCalls?: number;
    },
    token?: string
): Promise<any> => {
    try {
        console.log('Initiating calls for campaign:', campaignId);

        const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/leads/call`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify({
                lead_filters: config.leadFilters || { max_call_attempts: 2, limit: 50 },
                call_settings: config.callSettings || { script_id: 'default', voice: 'professional' },
                rate_limit_seconds: config.rateLimitSeconds || 3,
                max_concurrent_calls: config.maxConcurrentCalls || 2
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || 'Failed to initiate calls');
        }

        const result = await response.json();
        console.log('Calls initiated successfully:', result);
        return result;
    } catch (error: any) {
        console.error('Error initiating calls:', error);
        throw new Error(error?.message || 'Failed to initiate calls');
    }
};

/**
 * Gets the current call status for a campaign
 */
export const getCampaignCallStatusWebhook = async (campaignId: string, token?: string): Promise<any> => {
    try {
        const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/call-status`, {
            method: 'GET',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || 'Failed to get call status');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error getting call status:', error);
        throw new Error(error?.message || 'Failed to get call status');
    }
};

/**
 * Duplicates a campaign
 */
export const duplicateCampaignWebhook = async (campaignId: string, token?: string): Promise<any> => {
    try {
        console.log('Duplicating campaign:', campaignId);

        const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/duplicate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || 'Failed to duplicate campaign');
        }

        const result = await response.json();
        console.log('Campaign duplicated successfully:', result);
        return result;
    } catch (error: any) {
        console.error('Error duplicating campaign:', error);
        throw new Error(error?.message || 'Failed to duplicate campaign');
    }
};