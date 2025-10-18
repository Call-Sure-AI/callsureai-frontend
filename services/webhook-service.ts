// services/webhook-service.ts
import { DataMapping } from '@/types/campaign';

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
        delay_between_calls: 5,
        max_concurrent_calls: 3,
        file_url: fileUrl,
        data_mapping: phoneMapping
    };
};

/**
 * Triggers a campaign to start running via webhook
 */
export const triggerCampaign = async (payload: CampaignTriggerPayload): Promise<boolean> => {
    try {
        console.log('Triggering campaign with payload:', payload);

        const webhookUrl = 'https://stage.callsure.ai/campaign/trigger';

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('Campaign trigger response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: `Server returned ${response.status}: ${response.statusText}`
            }));
            throw new Error(errorData.error || errorData.message || 'Failed to trigger campaign');
        }

        const result = await response.json();
        console.log('Campaign trigger successful:', result);

        return true;
    } catch (error: any) {
        console.error('Error triggering campaign:', error);

        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            throw new Error('Network error: Could not connect to the webhook service. Please check your connection and try again.');
        }

        throw new Error(error?.message || 'Failed to trigger campaign');
    }
};
