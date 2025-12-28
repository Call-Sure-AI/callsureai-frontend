// services/campaign-service.ts
import { CampaignFormData, CampaignResponse, defaultBookingConfig, DataMapping } from '@/types/campaign';

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://beta.callsure.ai';

// ============================================
// CAMPAIGN CRUD OPERATIONS
// ============================================

/**
 * Creates a new campaign via the API
 */
export const createCampaign = async (formData: CampaignFormData, token: string): Promise<CampaignResponse> => {
    try {
        const apiFormData = new FormData();

        apiFormData.append('campaign_name', formData.campaign_name);
        apiFormData.append('description', formData.description);
        apiFormData.append('agent_id', formData.agent_id);
        apiFormData.append('status', 'queued');
        apiFormData.append('data_mapping', JSON.stringify(formData.data_mapping));
        
        // Always send booking_config (API requires it)
        const bookingConfig = formData.booking_config || defaultBookingConfig;
        apiFormData.append('booking_config', JSON.stringify(bookingConfig));
        
        apiFormData.append('automation_config', JSON.stringify(formData.automation_config));

        if (formData.leads_csv) {
            apiFormData.append('leads_csv', formData.leads_csv);
        }

        const response = await fetch(`${getApiUrl()}/api/campaigns/create`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: apiFormData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(parseApiError(errorData) || 'Failed to create campaign');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error creating campaign:', error);
        throw new Error(error?.message || 'Failed to create campaign');
    }
};

/**
 * Gets all campaigns for the company
 */
export const getAllCampaigns = async (token: string, companyId: string, limit: number = 50, offset: number = 0): Promise<CampaignResponse[]> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/company/${companyId}?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to get campaigns');
    }

    const data = await response.json();
    console.log('getAllCampaigns - Raw API response:', data);
    
    // Handle different response formats
    if (Array.isArray(data)) {
        return data;
    }
    if (data?.campaigns && Array.isArray(data.campaigns)) {
        return data.campaigns;
    }
    if (data?.data && Array.isArray(data.data)) {
        return data.data;
    }
    if (data?.items && Array.isArray(data.items)) {
        return data.items;
    }
    
    console.warn('getAllCampaigns - Unexpected response format:', data);
    return [];
};

/**
 * Gets a specific campaign by ID
 */
export const getCampaignById = async (id: string, token: string): Promise<CampaignResponse> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to get campaign');
    }

    return await response.json();
};

/**
 * Updates campaign details (name, description, status, etc.)
 * Uses PUT /api/campaigns/{id} with JSON body
 */
export const updateCampaignDetails = async (
    id: string, 
    formData: { campaign_name?: string; description?: string; status?: string }, 
    token: string
): Promise<CampaignResponse> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to update campaign');
    }

    return await response.json();
};

/**
 * Updates campaign status using PUT /api/campaigns/{id}
 * Status can be: 'active' | 'inactive'
 */
export const updateCampaignStatus = async (
    id: string, 
    status: 'active' | 'inactive', 
    token: string
): Promise<CampaignResponse> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to update campaign status');
    }

    return await response.json();
};

// ============================================
// CAMPAIGN LIFECYCLE OPERATIONS
// ============================================

/**
 * Starts a campaign (sets status to 'active')
 */
export const startCampaign = async (campaignId: string, token: string): Promise<CampaignResponse> => {
    return await updateCampaignStatus(campaignId, 'active', token);
};

/**
 * Pauses a campaign (sets status to 'inactive')
 */
export const pauseCampaign = async (campaignId: string, token: string): Promise<CampaignResponse> => {
    return await updateCampaignStatus(campaignId, 'inactive', token);
};

/**
 * Resumes a paused campaign (sets status to 'active')
 */
export const resumeCampaign = async (campaignId: string, token: string): Promise<CampaignResponse> => {
    return await updateCampaignStatus(campaignId, 'active', token);
};

/**
 * Completes/stops a campaign (sets status to 'inactive')
 */
export const completeCampaign = async (campaignId: string, token: string): Promise<CampaignResponse> => {
    return await updateCampaignStatus(campaignId, 'inactive', token);
};

/**
 * Duplicates a campaign
 */
export const duplicateCampaign = async (campaignId: string, token: string): Promise<CampaignResponse> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/duplicate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to duplicate campaign');
    }

    return await response.json();
};

// ============================================
// CAMPAIGN AGENTS OPERATIONS
// ============================================

/**
 * Gets agents assigned to a campaign
 */
export const getCampaignAgents = async (campaignId: string, token: string): Promise<any[]> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/agents`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to get campaign agents');
    }

    return await response.json();
};

/**
 * Assigns agents to a campaign
 */
export const assignAgentsToCampaign = async (
    campaignId: string, 
    agentIds: string[], 
    token: string
): Promise<any> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/agents/assign`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ agent_ids: agentIds })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to assign agents');
    }

    return await response.json();
};

/**
 * Removes an agent from a campaign
 */
export const removeAgentFromCampaign = async (
    campaignId: string, 
    agentId: string, 
    token: string
): Promise<any> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/agents/${agentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to remove agent');
    }

    return await response.json();
};

// ============================================
// CAMPAIGN METRICS & ANALYTICS
// ============================================

/**
 * Gets campaign metrics
 */
export const getCampaignMetrics = async (campaignId: string, token: string): Promise<CampaignMetrics> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/metrics`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to get campaign metrics');
    }

    return await response.json();
};

/**
 * Gets campaign metrics history
 */
export const getCampaignMetricsHistory = async (
    campaignId: string, 
    days: number = 30, 
    token: string
): Promise<CampaignMetricsHistory[]> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/metrics/history?days=${days}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to get metrics history');
    }

    return await response.json();
};

/**
 * Gets analytics summary across all campaigns
 */
export const getAnalyticsSummary = async (token: string): Promise<AnalyticsSummary> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/analytics/summary`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to get analytics summary');
    }

    return await response.json();
};

// ============================================
// CAMPAIGN CALL OPERATIONS
// ============================================

/**
 * Gets call logs for a campaign
 */
export const getCampaignCallLogs = async (
    campaignId: string, 
    token: string, 
    limit: number = 50
): Promise<CallLog[]> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/call-logs?limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to get call logs');
    }

    return await response.json();
};

/**
 * Gets call status for a campaign
 */
export const getCampaignCallStatus = async (campaignId: string, token: string): Promise<CallStatus> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/call-status`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to get call status');
    }

    return await response.json();
};

/**
 * Initiates calls to leads in a campaign
 */
export const initiateLeadCalls = async (
    campaignId: string, 
    callConfig: LeadCallConfig, 
    token: string
): Promise<any> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/leads/call`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(callConfig)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to initiate calls');
    }

    return await response.json();
};

// ============================================
// CAMPAIGN BOOKINGS
// ============================================

/**
 * Gets bookings for a campaign
 */
export const getCampaignBookings = async (campaignId: string, token: string): Promise<Booking[]> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/bookings`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to get bookings');
    }

    return await response.json();
};

// ============================================
// CAMPAIGN LEADS OPERATIONS
// ============================================

/**
 * Gets leads for a campaign
 */
export const getCampaignLeads = async (
    campaignId: string, 
    token: string, 
    limit: number = 50, 
    offset: number = 0
): Promise<LeadsResponse> => {
    const response = await fetch(
        `${getApiUrl()}/api/campaigns/${campaignId}/leads?offset=${offset}&limit=${limit}`, 
        {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to get leads');
    }

    return await response.json();
};

/**
 * Adds a single lead to a campaign
 */
export const addLeadToCampaign = async (
    campaignId: string, 
    lead: LeadInput, 
    token: string
): Promise<Lead> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/leads`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(lead)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to add lead');
    }

    return await response.json();
};

/**
 * Bulk updates leads in a campaign
 */
export const bulkUpdateLeads = async (
    campaignId: string, 
    leadIds: string[], 
    updates: Partial<Lead>, 
    token: string
): Promise<any> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/leads/bulk`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lead_ids: leadIds, updates })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to update leads');
    }

    return await response.json();
};

/**
 * Deletes a lead from a campaign
 */
export const deleteLeadFromCampaign = async (
    campaignId: string, 
    leadId: string, 
    token: string
): Promise<any> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/leads/${leadId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to delete lead');
    }

    return await response.json();
};

/**
 * Uploads leads CSV to a campaign
 */
export const uploadLeadsCsv = async (
    campaignId: string, 
    file: File, 
    token: string
): Promise<any> => {
    const formData = new FormData();
    formData.append('csv_file', file);

    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/leads/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to upload leads');
    }

    return await response.json();
};

/**
 * Exports leads from a campaign
 */
export const exportCampaignLeads = async (campaignId: string, token: string): Promise<Blob> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/leads/export`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to export leads');
    }

    return await response.blob();
};

// ============================================
// CSV OPERATIONS
// ============================================

/**
 * Parses a CSV file
 */
export const parseCsvFile = async (
    file: File, 
    previewRows: number = 10, 
    token: string
): Promise<CsvParseResult> => {
    const formData = new FormData();
    formData.append('csv_file', file);
    formData.append('preview_rows', previewRows.toString());

    const response = await fetch(`${getApiUrl()}/api/campaigns/csv/parse`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to parse CSV');
    }

    return await response.json();
};

/**
 * Validates CSV content
 */
export const validateCsv = async (
    csvContent: string, 
    expectedHeaders: string[], 
    requiredFields: string[], 
    token: string
): Promise<CsvValidationResult> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/csv/validate`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            csv_content: csvContent,
            expected_headers: expectedHeaders,
            required_fields: requiredFields
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to validate CSV');
    }

    return await response.json();
};

/**
 * Maps CSV fields to system fields
 */
export const mapCsvFields = async (
    csvHeaders: string[], 
    mappings: CsvFieldMapping[], 
    token: string
): Promise<any> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/csv/map-fields`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ csv_headers: csvHeaders, mappings })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to map CSV fields');
    }

    return await response.json();
};

// ============================================
// CAMPAIGN SETTINGS
// ============================================

/**
 * Gets campaign settings
 */
export const getCampaignSettings = async (campaignId: string, token: string): Promise<CampaignSettings> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/settings`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to get campaign settings');
    }

    return await response.json();
};

/**
 * Updates booking settings
 */
export const updateBookingSettings = async (
    campaignId: string, 
    settings: BookingSettings, 
    token: string
): Promise<any> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/settings/booking`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to update booking settings');
    }

    return await response.json();
};

/**
 * Updates email settings
 */
export const updateEmailSettings = async (
    campaignId: string, 
    settings: EmailSettings, 
    token: string
): Promise<any> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/settings/email`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to update email settings');
    }

    return await response.json();
};

/**
 * Updates call settings
 */
export const updateCallSettings = async (
    campaignId: string, 
    settings: CallSettings, 
    token: string
): Promise<any> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/settings/call`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to update call settings');
    }

    return await response.json();
};

/**
 * Updates schedule settings
 */
export const updateScheduleSettings = async (
    campaignId: string, 
    settings: ScheduleSettings, 
    token: string
): Promise<any> => {
    const response = await fetch(`${getApiUrl()}/api/campaigns/${campaignId}/settings/schedule`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseApiError(errorData) || 'Failed to update schedule settings');
    }

    return await response.json();
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Parses API error response
 */
const parseApiError = (errorData: any): string => {
    if (errorData.detail && Array.isArray(errorData.detail)) {
        return errorData.detail.map((err: any) => 
            `${err.loc?.join('.')}: ${err.msg}`
        ).join(', ');
    }
    return errorData.error || errorData.message || errorData.detail || '';
};

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface CampaignMetrics {
    total_leads: number;
    contacted: number;
    responded: number;
    booked: number;
    converted: number;
    response_rate: number;
    conversion_rate: number;
    avg_call_duration: number;
    total_calls: number;
    successful_calls: number;
    failed_calls: number;
}

export interface CampaignMetricsHistory {
    date: string;
    leads: number;
    contacted: number;
    booked: number;
    converted: number;
}

export interface AnalyticsSummary {
    total_campaigns: number;
    active_campaigns: number;
    total_leads: number;
    total_calls: number;
    total_bookings: number;
    avg_response_rate: number;
    avg_conversion_rate: number;
}

export interface CallLog {
    id: string;
    lead_id: string;
    lead_name: string;
    phone: string;
    status: string;
    duration: number;
    started_at: string;
    ended_at: string;
    recording_url?: string;
    transcript?: string;
    sentiment?: string;
}

export interface CallStatus {
    campaign_id: string;
    status: string;
    active_calls: number;
    queued_calls: number;
    completed_calls: number;
    failed_calls: number;
}

export interface LeadCallConfig {
    lead_filters: {
        max_call_attempts?: number;
        limit?: number;
        status?: string;
    };
    call_settings: {
        script_id?: string;
        voice?: string;
    };
    rate_limit_seconds?: number;
    max_concurrent_calls?: number;
}

export interface Booking {
    id: string;
    lead_id: string;
    lead_name: string;
    email: string;
    phone: string;
    scheduled_at: string;
    duration_minutes: number;
    status: string;
    meeting_link?: string;
    notes?: string;
}

export interface Lead {
    id: string;
    first_name: string;
    last_name?: string;
    email: string;
    phone: string;
    company?: string;
    status: string;
    call_attempts: number;
    last_called_at?: string;
    created_at: string;
}

export interface LeadInput {
    first_name: string;
    last_name?: string;
    email: string;
    phone: string;
    company?: string;
}

export interface LeadsResponse {
    leads: Lead[];
    total: number;
    offset: number;
    limit: number;
}

export interface CsvParseResult {
    headers: string[];
    preview_data: any[];
    total_rows: number;
}

export interface CsvValidationResult {
    is_valid: boolean;
    errors: string[];
    warnings: string[];
}

export interface CsvFieldMapping {
    csv_column: string;
    system_field: string;
    required: boolean;
    transform?: 'title' | 'lower' | 'upper';
}

export interface CampaignSettings {
    booking: BookingSettings;
    email: EmailSettings;
    call: CallSettings;
    schedule: ScheduleSettings;
}

export interface BookingSettings {
    meeting_duration_minutes: number;
    buffer_time_minutes: number;
    booking_window_days: number;
    team_email_addresses: string[];
}

export interface EmailSettings {
    template: string;
    subject_line: string;
    from_name: string;
    from_email: string;
    followup_delay_hours: number;
    max_followup_attempts: number;
}

export interface CallSettings {
    script: string;
    max_call_attempts: number;
    call_interval_hours: number;
    preferred_calling_hours: {
        start: string;
        end: string;
        timezone: string;
    };
    call_recording_enabled: boolean;
    voicemail_script?: string;
}

export interface ScheduleSettings {
    working_days: string[];
    working_hours_start: string;
    working_hours_end: string;
    timezone: string;
    max_concurrent_calls: number;
    pause_on_holidays: boolean;
}

export type Campaign = CampaignResponse;