// contexts/campaign-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CampaignResponse, CampaignFormState, FormValidationErrors } from '@/types/campaign';
import { createCampaign, getAllCampaigns, updateCampaignStatus } from '@/services/campaign-service';
import { triggerCampaign, createCampaignTriggerPayload } from '@/services/webhook-service';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';
import { useCompany } from '@/contexts/company-context';
import { toast } from '@/hooks/use-toast';

interface CampaignContextType {
    campaigns: CampaignResponse[];
    loading: boolean;
    error: string | null;
    refreshCampaigns: () => Promise<void>;
    createNewCampaign: (formData: CampaignFormState) => Promise<boolean>;
    updateCampaign: (id: string, status: 'active' | 'paused' | 'stopped') => Promise<boolean>;
    validateForm: (formData: CampaignFormState) => FormValidationErrors;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: React.ReactNode }) {
    const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useCurrentUser();
    const { token } = useIsAuthenticated();
    const { company } = useCompany();

    const fetchCampaigns = async () => {
        try {
            if (!token || !user || !company?.id) return;
            setLoading(true);
            setError(null);
            const data = await getAllCampaigns(token, company.id);
            console.log('Fetched campaigns:', data);
            setCampaigns(data || []);
        } catch (error: any) {
            console.error('Failed to fetch campaigns:', error);
            setError(error.message || 'Failed to fetch campaigns');
            setCampaigns([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const createNewCampaign = async (formData: CampaignFormState): Promise<boolean> => {
        try {
            if (!token) {
                toast({
                    title: "Error",
                    description: "Please login to create a campaign.",
                    variant: "destructive"
                });
                return false;
            }

            // Convert form data to API format
            const apiFormData = {
                campaign_name: formData.campaign_name,
                description: formData.description,
                agent_id: formData.agent_id,
                data_mapping: formData.data_mapping,
                booking_config: formData.booking_enabled ? formData.booking_config : undefined,
                automation_config: formData.automation_config,
                leads_csv: formData.csv_file || undefined
            };

            const result = await createCampaign(apiFormData, token);

            // Trigger campaign webhook to start running
            try {
                if (!result.file_url) {
                    throw new Error('Campaign file URL not available');
                }

                const payload = createCampaignTriggerPayload(
                    result.id,
                    result.agent_id,
                    result.automation_config,
                    result.file_url,
                    result.data_mapping
                );

                await triggerCampaign(payload);
                console.log('Campaign webhook triggered successfully');
            } catch (webhookError: any) {
                console.error('Failed to trigger campaign webhook:', webhookError);
                // Don't fail the entire campaign creation if webhook fails
                toast({
                    title: "Warning",
                    description: "Campaign created but failed to start automatically. You can start it manually from the campaigns list.",
                    variant: "destructive"
                });
            }

            // Refresh campaigns list
            await fetchCampaigns();

            toast({
                title: "Success",
                description: `Campaign "${result.campaign_name}" created and started successfully!`,
            });

            return true;
        } catch (error: any) {
            console.error('Failed to create campaign:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to create campaign. Please try again.",
                variant: "destructive"
            });
            return false;
        }
    };

    const updateCampaign = async (id: string, status: 'active' | 'paused' | 'stopped'): Promise<boolean> => {
        try {
            if (!token) {
                toast({
                    title: "Error",
                    description: "Please login to update campaign.",
                    variant: "destructive"
                });
                return false;
            }

            await updateCampaignStatus(id, status, token);

            // Update local state
            setCampaigns(prev => prev.map(campaign =>
                campaign.id === id ? { ...campaign, status } : campaign
            ));

            const statusText = status === 'active' ? 'started' : status === 'paused' ? 'paused' : 'stopped';
            toast({
                title: "Success",
                description: `Campaign ${statusText} successfully!`,
            });

            return true;
        } catch (error: any) {
            console.error('Failed to update campaign:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to update campaign. Please try again.",
                variant: "destructive"
            });
            return false;
        }
    };

    const validateForm = (formData: CampaignFormState): FormValidationErrors => {
        const errors: FormValidationErrors = {};

        if (!formData.campaign_name.trim()) {
            errors.campaign_name = 'Campaign name is required';
        }

        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }

        if (!formData.agent_id) {
            errors.agent_id = 'Please select an agent';
        }

        if (!formData.csv_file) {
            errors.csv_file = 'CSV file is required';
        }

        // Validate data mapping
        const requiredMappings = formData.data_mapping.filter(m => m.required);
        const mappedRequired = requiredMappings.filter(m => m.csv_column);

        if (mappedRequired.length !== requiredMappings.length) {
            errors.data_mapping = 'Please map all required fields';
        }

        // Validate booking config if enabled
        if (formData.booking_enabled) {
            if (formData.booking_config.send_invite_to_team &&
                formData.booking_config.team_email_addresses.length === 0) {
                errors.booking_config = 'Team email addresses are required when sending invites to team';
            }
        }

        // Validate automation config
        if (!formData.automation_config.email_template.trim()) {
            errors.automation_config = 'Email template is required';
        }

        if (!formData.automation_config.call_script.trim()) {
            errors.automation_config = 'Call script is required';
        }

        return errors;
    };

    useEffect(() => {
        if (user && token && company?.id) {
            fetchCampaigns();
        }
    }, [user, token, company?.id]);

    return (
        <CampaignContext.Provider value={{
            campaigns,
            loading,
            error,
            refreshCampaigns: fetchCampaigns,
            createNewCampaign,
            updateCampaign,
            validateForm
        }}>
            {children}
        </CampaignContext.Provider>
    );
}

export const useCampaigns = () => {
    const context = useContext(CampaignContext);
    if (context === undefined) {
        throw new Error('useCampaigns must be used within a CampaignProvider');
    }
    return context;
};