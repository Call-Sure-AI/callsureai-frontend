// services/phone-number-service.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://beta.callsure.ai';

export type PhoneProvider = 'twilio' | 'plivo' | 'exotel';

export interface PhoneNumber {
    id: string;
    phone_number: string;
    provider: PhoneProvider;
    agent_id: string | null;
    agent_name: string | null;
    company_id: string;
    status: 'active' | 'inactive' | 'pending';
    created_at: string;
    updated_at: string;
    capabilities?: {
        voice: boolean;
        sms: boolean;
        mms: boolean;
    };
    monthly_cost?: number;
    country?: string;
    region?: string;
}

export interface TwilioCredentials {
    account_sid: string;
    auth_token: string;
    phone_number?: string;
    messaging_service_sid?: string;
}

export interface PlivoCredentials {
    auth_id: string;
    auth_token: string;
    phone_number?: string;
}

export interface ExotelCredentials {
    api_key: string;
    api_token: string;
    subdomain: string;
    phone_number?: string;
}

export interface AvailableNumber {
    phone_number: string;
    friendly_name: string;
    country: string;
    country_code: string;
    region: string;
    locality?: string;
    capabilities: {
        voice: boolean;
        sms: boolean;
        mms: boolean;
    };
    monthly_cost: number;
    setup_cost?: number;
    type: 'local' | 'toll-free' | 'mobile';
}

export interface SearchNumbersParams {
    country: string;
    type?: 'local' | 'toll-free' | 'mobile';
    area_code?: string;
    contains?: string;
    limit?: number;
}

// Helper to get auth token
const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
};

// Helper to get company ID from user
const getCompanyId = (): string | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        const user = JSON.parse(userStr);
        return user.company_id || user.companyId || null;
    } catch {
        return null;
    }
};

/**
 * Search available phone numbers from Twilio
 */
export const searchTwilioNumbers = async (
    credentials: TwilioCredentials,
    params: SearchNumbersParams
): Promise<AvailableNumber[]> => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required. Please log in.');

    const response = await fetch(`${API_BASE_URL}/api/phone-numbers/twilio/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            account_sid: credentials.account_sid,
            auth_token: credentials.auth_token,
            country: params.country,
            type: params.type || 'local',
            area_code: params.area_code,
            contains: params.contains,
            limit: params.limit || 20,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || error.detail || 'Failed to search phone numbers');
    }

    const data = await response.json();
    return data.available_numbers || data || [];
};

/**
 * Search available phone numbers from Plivo
 */
export const searchPlivoNumbers = async (
    credentials: PlivoCredentials,
    params: SearchNumbersParams
): Promise<AvailableNumber[]> => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required. Please log in.');

    const response = await fetch(`${API_BASE_URL}/api/phone-numbers/plivo/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            auth_id: credentials.auth_id,
            auth_token: credentials.auth_token,
            country: params.country,
            type: params.type || 'local',
            region: params.area_code,
            limit: params.limit || 20,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || error.detail || 'Failed to search phone numbers');
    }

    const data = await response.json();
    return data.available_numbers || data || [];
};

/**
 * Search available phone numbers from Exotel
 */
export const searchExotelNumbers = async (
    credentials: ExotelCredentials,
    params: SearchNumbersParams
): Promise<AvailableNumber[]> => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required. Please log in.');

    const response = await fetch(`${API_BASE_URL}/api/phone-numbers/exotel/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            api_key: credentials.api_key,
            api_token: credentials.api_token,
            subdomain: credentials.subdomain,
            country: params.country,
            type: params.type || 'local',
            limit: params.limit || 20,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || error.detail || 'Failed to search phone numbers');
    }

    const data = await response.json();
    return data.available_numbers || data || [];
};

/**
 * Purchase and connect a Twilio phone number
 */
export const purchaseTwilioNumber = async (params: {
    credentials: TwilioCredentials;
    phone_number: string;
    agent_id: string;
    agent_name: string;
}): Promise<PhoneNumber> => {
    const token = getAuthToken();
    const companyId = getCompanyId();

    if (!token) throw new Error('Authentication required. Please log in.');
    if (!companyId) throw new Error('Company ID not found. Please contact support.');

    const response = await fetch(`${API_BASE_URL}/api/agent-numbers/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            company_id: companyId,
            agent_id: params.agent_id,
            phone_number: params.phone_number,
            account_sid: params.credentials.account_sid,
            auth_token: params.credentials.auth_token,
            messaging_service_sid: params.credentials.messaging_service_sid || '',
            agent_name: params.agent_name,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || error.detail || 'Failed to purchase phone number');
    }

    return response.json();
};

/**
 * Purchase and connect a Plivo phone number
 */
export const purchasePlivoNumber = async (params: {
    credentials: PlivoCredentials;
    phone_number: string;
    agent_id: string;
    agent_name: string;
}): Promise<PhoneNumber> => {
    const token = getAuthToken();
    const companyId = getCompanyId();

    if (!token) throw new Error('Authentication required. Please log in.');
    if (!companyId) throw new Error('Company ID not found. Please contact support.');

    const response = await fetch(`${API_BASE_URL}/api/agent-numbers/plivo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            company_id: companyId,
            agent_id: params.agent_id,
            phone_number: params.phone_number,
            auth_id: params.credentials.auth_id,
            auth_token: params.credentials.auth_token,
            agent_name: params.agent_name,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || error.detail || 'Failed to purchase phone number');
    }

    return response.json();
};

/**
 * Purchase and connect an Exotel phone number
 */
export const purchaseExotelNumber = async (params: {
    credentials: ExotelCredentials;
    phone_number: string;
    agent_id: string;
    agent_name: string;
}): Promise<PhoneNumber> => {
    const token = getAuthToken();
    const companyId = getCompanyId();

    if (!token) throw new Error('Authentication required. Please log in.');
    if (!companyId) throw new Error('Company ID not found. Please contact support.');

    const response = await fetch(`${API_BASE_URL}/api/agent-numbers/exotel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            company_id: companyId,
            agent_id: params.agent_id,
            phone_number: params.phone_number,
            api_key: params.credentials.api_key,
            api_token: params.credentials.api_token,
            subdomain: params.credentials.subdomain,
            agent_name: params.agent_name,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || error.detail || 'Failed to purchase phone number');
    }

    return response.json();
};

/**
 * Get all phone numbers for the company
 */
export const getPhoneNumbers = async (): Promise<PhoneNumber[]> => {
    const token = getAuthToken();
    const companyId = getCompanyId();

    if (!token) throw new Error('Authentication required. Please log in.');
    if (!companyId) throw new Error('Company ID not found.');

    const response = await fetch(`${API_BASE_URL}/api/agent-numbers/company/${companyId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        if (response.status === 404) return [];
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch phone numbers');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.phone_numbers || [];
};

/**
 * Delete/disconnect a phone number
 */
export const deletePhoneNumber = async (numberId: string): Promise<void> => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required. Please log in.');

    const response = await fetch(`${API_BASE_URL}/api/agent-numbers/${numberId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to delete phone number');
    }
};

/**
 * Update phone number assignment (change agent)
 */
export const updatePhoneNumberAgent = async (
    numberId: string,
    agentId: string,
    agentName: string
): Promise<PhoneNumber> => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required. Please log in.');

    const response = await fetch(`${API_BASE_URL}/api/agent-numbers/${numberId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            agent_id: agentId,
            agent_name: agentName,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to update phone number');
    }

    return response.json();
};

// Provider info for UI
export const providerInfo = {
    twilio: {
        name: 'Twilio',
        description: 'Global cloud communications platform with worldwide coverage',
        color: 'from-red-500 to-pink-600',
        bgColor: 'bg-red-50 dark:bg-red-500/10',
        borderColor: 'border-red-200 dark:border-red-500/20',
        textColor: 'text-red-700 dark:text-red-400',
        iconBg: 'bg-red-500',
        features: ['Voice', 'SMS', 'WhatsApp', 'Global Coverage'],
        docsUrl: 'https://console.twilio.com',
        countries: [
            { code: 'US', name: 'United States', flag: '🇺🇸' },
            { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
            { code: 'CA', name: 'Canada', flag: '🇨🇦' },
            { code: 'AU', name: 'Australia', flag: '🇦🇺' },
            { code: 'DE', name: 'Germany', flag: '🇩🇪' },
            { code: 'FR', name: 'France', flag: '🇫🇷' },
            { code: 'IN', name: 'India', flag: '🇮🇳' },
            { code: 'JP', name: 'Japan', flag: '🇯🇵' },
            { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
            { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
        ],
    },
    plivo: {
        name: 'Plivo',
        description: 'Affordable cloud communication APIs for voice and SMS',
        color: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-50 dark:bg-green-500/10',
        borderColor: 'border-green-200 dark:border-green-500/20',
        textColor: 'text-green-700 dark:text-green-400',
        iconBg: 'bg-green-500',
        features: ['Voice', 'SMS', 'Competitive Pricing', 'Global Numbers'],
        docsUrl: 'https://console.plivo.com',
        countries: [
            { code: 'US', name: 'United States', flag: '🇺🇸' },
            { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
            { code: 'CA', name: 'Canada', flag: '🇨🇦' },
            { code: 'AU', name: 'Australia', flag: '🇦🇺' },
            { code: 'IN', name: 'India', flag: '🇮🇳' },
            { code: 'DE', name: 'Germany', flag: '🇩🇪' },
        ],
    },
    exotel: {
        name: 'Exotel',
        description: 'Leading cloud telephony provider for India & Southeast Asia',
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-50 dark:bg-blue-500/10',
        borderColor: 'border-blue-200 dark:border-blue-500/20',
        textColor: 'text-blue-700 dark:text-blue-400',
        iconBg: 'bg-blue-500',
        features: ['Voice', 'IVR', 'India Focus', 'Call Recording'],
        docsUrl: 'https://my.exotel.com',
        countries: [
            { code: 'IN', name: 'India', flag: '🇮🇳' },
            { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
            { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
            { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
        ],
    },
};

// Number types
export const numberTypes = [
    { value: 'local', label: 'Local', description: 'Standard local numbers' },
    { value: 'toll-free', label: 'Toll-Free', description: 'Free for callers' },
    { value: 'mobile', label: 'Mobile', description: 'Mobile phone numbers' },
];