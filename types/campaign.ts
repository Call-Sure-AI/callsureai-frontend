// types/campaign.ts

export interface DataMapping {
    csv_column: string;
    mapped_to: string;
    required: boolean;
}

export interface BookingConfig {
    calendar_type: 'google' | 'outlook' | 'calendly';
    meeting_duration_minutes: number;
    buffer_time_minutes: number;
    send_invite_to_lead: boolean;
    send_invite_to_team: boolean;
    team_email_addresses: string[];
}

export interface AutomationConfig {
    email_template: string;
    call_script: string;
    max_call_attempts: number;
    call_interval_hours: number;
    enable_followup_emails: boolean;
    delay_between_calls: number;
    max_concurrent_calls: number;
}

export interface CampaignFormData {
    campaign_name: string;
    description: string;
    agent_id: string;
    data_mapping: DataMapping[];
    booking_config?: BookingConfig;
    automation_config: AutomationConfig;
    leads_csv?: File;
}

export interface CampaignResponse {
    id: string;
    campaign_name: string;
    description: string;
    status: 'draft' | 'queued' | 'active' | 'paused' | 'completed' | 'stopped';
    agent_id: string;
    data_mapping: DataMapping[];
    booking_config?: BookingConfig;
    automation_config: AutomationConfig;
    file_url?: string;
    metrics: {
        total_leads: number;
        contacted: number;
        qualified: number;
        booked: number;
        completed: number;
        failed: number;
        response_rate: number;
        booking_rate: number;
    };
    created_at: string;
    updated_at: string;
}

export interface Lead {
    id: string;
    first_name: string;
    email: string;
    phone?: string;
    company?: string;
    location?: string;
    status: 'new' | 'contacted' | 'qualified' | 'booked' | 'completed' | 'failed';
    custom_fields?: Record<string, any>;
    campaign_id: string;
    created_at: string;
    updated_at: string;
}

// Form state interfaces
export interface CampaignFormState {
    campaign_name: string;
    description: string;
    agent_id: string;
    data_mapping: DataMapping[];
    booking_enabled: boolean;
    booking_config: BookingConfig;
    automation_config: AutomationConfig;
    csv_file: File | null;
    csv_headers: string[];
    csv_data: any[];
}

export interface FormValidationErrors {
    campaign_name?: string;
    description?: string;
    agent_id?: string;
    data_mapping?: string;
    booking_config?: string;
    automation_config?: string;
    csv_file?: string;
}

// Default values
export const defaultBookingConfig: BookingConfig = {
    calendar_type: 'google',
    meeting_duration_minutes: 30,
    buffer_time_minutes: 15,
    send_invite_to_lead: true,
    send_invite_to_team: true,
    team_email_addresses: []
};

export const defaultAutomationConfig: AutomationConfig = {
    email_template: 'Hi {{first_name}}, let\'s schedule a call!',
    call_script: 'Hello {{first_name}}, I\'m calling from {{company_name}}...',
    max_call_attempts: 3,
    call_interval_hours: 24,
    enable_followup_emails: true,
    delay_between_calls: 1,
    max_concurrent_calls: 3
};

export const defaultDataMapping: DataMapping[] = [
    { csv_column: '', mapped_to: 'first_name', required: true },
    { csv_column: '', mapped_to: 'email', required: true },
    { csv_column: '', mapped_to: 'phone', required: false },
    { csv_column: '', mapped_to: 'country_code', required: false },
    { csv_column: '', mapped_to: 'company', required: false },
    { csv_column: '', mapped_to: 'location', required: false }
];

export const fieldMappingOptions = [
    { value: 'first_name', label: 'First Name', type: 'text' },
    { value: 'last_name', label: 'Last Name', type: 'text' },
    { value: 'email', label: 'Email', type: 'email' },
    { value: 'phone', label: 'Phone', type: 'phone' },
    { value: 'country_code', label: 'Country Code', type: 'text' },
    { value: 'company', label: 'Company', type: 'text' },
    { value: 'location', label: 'Location', type: 'text' },
    { value: 'job_title', label: 'Job Title', type: 'text' },
    { value: 'industry', label: 'Industry', type: 'text' }
];
