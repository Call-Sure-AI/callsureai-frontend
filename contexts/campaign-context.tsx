"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CampaignResponse, CampaignFormState, FormValidationErrors } from '@/types/campaign';
import { createCampaign, getAllCampaigns, updateCampaignStatus, updateCampaignDetails as updateCampaignDetailsService } from '@/services/campaign-service';
import { logCampaignActivity } from '@/services/activity-service';
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
    updateCampaignDetails: (id: string, formData: { campaign_name?: string; description?: string }) => Promise<boolean>;
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

    const fetchCampaigns = useCallback(async () => {
        try {
            // Get token from context or localStorage
            let authToken = token;
            if (!authToken) {
                authToken = localStorage.getItem('token');
            }
            
            if (!authToken || !user || !company?.id) {
                console.log('fetchCampaigns - Missing requirements:', { 
                    hasToken: !!authToken, 
                    hasUser: !!user, 
                    hasCompanyId: !!company?.id,
                    companyId: company?.id
                });
                return;
            }
            setLoading(true);
            setError(null);
            console.log('fetchCampaigns - Fetching campaigns for company:', company.id);
            const data = await getAllCampaigns(authToken, company.id);
            console.log('fetchCampaigns - Received campaigns:', data);
            console.log('fetchCampaigns - Campaign count:', data?.length || 0);
            setCampaigns(data || []);
        } catch (err: any) {
            console.error('fetchCampaigns - Error:', err);
            setError(err.message || 'Failed to fetch campaigns');
            setCampaigns([]);
        } finally {
            setLoading(false);
        }
    }, [token, user, company?.id]);

    const createNewCampaign = useCallback(async (formData: CampaignFormState): Promise<boolean> => {
        console.log('createNewCampaign - Starting with token:', !!token);
        
        // Try to get token from localStorage as fallback
        let authToken = token;
        if (!authToken) {
            authToken = localStorage.getItem('token');
            console.log('createNewCampaign - Using localStorage token:', !!authToken);
        }
        
        if (!authToken) {
            console.error('createNewCampaign - No token available');
            toast({
                title: "Error",
                description: "Please login to create a campaign.",
                variant: "destructive"
            });
            return false;
        }

        try {
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

            console.log('createNewCampaign - Calling API...');
            const result = await createCampaign(apiFormData, authToken);
            console.log('createNewCampaign - API Success, result:', result);

            // Log activity for campaign creation
            await logCampaignActivity(
                authToken,
                result.campaign_name || formData.campaign_name,
                result.id,
                'created'
            ).catch(err => console.error('Failed to log campaign activity:', err));

            toast({
                title: "Success",
                description: `Campaign "${result.campaign_name || formData.campaign_name}" created successfully!`,
            });

            // Refresh campaigns list - fetch directly here to ensure state updates
            console.log('createNewCampaign - Refreshing campaigns list...');
            if (company?.id) {
                try {
                    const freshCampaigns = await getAllCampaigns(authToken, company.id);
                    console.log('createNewCampaign - Fresh campaigns:', freshCampaigns?.length);
                    setCampaigns(freshCampaigns || []);
                    console.log('createNewCampaign - State updated with campaigns');
                } catch (refreshErr) {
                    console.error('createNewCampaign - Refresh error:', refreshErr);
                }
            }

            return true;
        } catch (err: any) {
            console.error('createNewCampaign - Error:', err);
            toast({
                title: "Error",
                description: err.message || "Failed to create campaign. Please try again.",
                variant: "destructive"
            });
            return false;
        }
    }, [token, company?.id]);

    const updateCampaign = useCallback(async (id: string, status: 'active' | 'paused' | 'stopped'): Promise<boolean> => {
        let authToken = token;
        if (!authToken) {
            authToken = localStorage.getItem('token');
        }
        
        if (!authToken) {
            toast({
                title: "Error",
                description: "Please login to update campaign.",
                variant: "destructive"
            });
            return false;
        }

        try {
            await updateCampaignStatus(id, status, authToken);

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
        } catch (err: any) {
            console.error('updateCampaign - Error:', err);
            toast({
                title: "Error",
                description: err.message || "Failed to update campaign. Please try again.",
                variant: "destructive"
            });
            return false;
        }
    }, [token]);

    const updateCampaignDetails = useCallback(async (id: string, formData: { campaign_name?: string; description?: string }): Promise<boolean> => {
        let authToken = token;
        if (!authToken) {
            authToken = localStorage.getItem('token');
        }
        
        if (!authToken) {
            toast({
                title: "Error",
                description: "Please login to update campaign.",
                variant: "destructive"
            });
            return false;
        }

        try {
            await updateCampaignDetailsService(id, formData, authToken);

            // Update local state
            setCampaigns(prev => prev.map(campaign =>
                campaign.id === id ? { ...campaign, ...formData } : campaign
            ));

            toast({
                title: "Success",
                description: "Campaign updated successfully!",
            });

            return true;
        } catch (err: any) {
            console.error('updateCampaignDetails - Error:', err);
            toast({
                title: "Error",
                description: err.message || "Failed to update campaign. Please try again.",
                variant: "destructive"
            });
            return false;
        }
    }, [token]);

    const validateForm = useCallback((formData: CampaignFormState): FormValidationErrors => {
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
    }, []);

    useEffect(() => {
        if (user && token && company?.id) {
            console.log('CampaignContext - useEffect triggered, fetching campaigns...');
            fetchCampaigns();
        }
    }, [user, token, company?.id, fetchCampaigns]);

    return (
        <CampaignContext.Provider value={{
            campaigns,
            loading,
            error,
            refreshCampaigns: fetchCampaigns,
            createNewCampaign,
            updateCampaign,
            updateCampaignDetails,
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