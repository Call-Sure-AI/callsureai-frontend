// services/phone-number-service.ts
/**
 * Phone Number Service
 * Handles searching and purchasing phone numbers from Twilio and Exotel
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://beta.callsure.ai';

// ============== Types ==============

export type PhoneProvider = 'twilio' | 'exotel';

export interface PhoneNumber {
    id: string;
    phone_number: string;
    provider: PhoneProvider;
    agent_id: string | null;
    agent_name: string | null;
    company_id: string;
    status: 'active' | 'inactive' | 'pending' | 'deleted';
    monthly_cost: number;
    country?: string;
    region?: string;
    purchased_at: string;
    renews_at: string;
    created_at: string;
    updated_at?: string;
}

export interface AvailableNumber {
    phone_number: string;
    friendly_name: string;
    country: string;
    country_code: string;
    region?: string;
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

export interface SearchParams {
    country: string;
    type?: 'local' | 'toll-free' | 'mobile';
    area_code?: string;
    contains?: string;
    limit?: number;
}

export interface Country {
    code: string;
    name: string;
    flag: string;
    dialCode: string;
    providers: PhoneProvider[];
}

// ============== Helper Functions ==============

const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
};

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

// ============== Country Data ==============

export const COUNTRIES: Country[] = [
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', providers: ['twilio'] },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', providers: ['twilio'] },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', providers: ['twilio'] },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', providers: ['twilio'] },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', providers: ['twilio'] },
    { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', providers: ['twilio'] },
    { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', providers: ['twilio', 'exotel'] },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65', providers: ['twilio', 'exotel'] },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81', providers: ['twilio'] },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55', providers: ['twilio'] },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52', providers: ['twilio'] },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34', providers: ['twilio'] },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39', providers: ['twilio'] },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31', providers: ['twilio'] },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46', providers: ['twilio'] },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41', providers: ['twilio'] },
    { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353', providers: ['twilio'] },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64', providers: ['twilio'] },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60', providers: ['exotel'] },
    { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62', providers: ['exotel'] },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63', providers: ['exotel'] },
    { code: 'AE', name: 'UAE', flag: '🇦🇪', dialCode: '+971', providers: ['twilio', 'exotel'] },
];

export const getCountryByCode = (code: string): Country | undefined => {
    return COUNTRIES.find(c => c.code === code);
};

export const getCountriesForProvider = (provider: PhoneProvider): Country[] => {
    return COUNTRIES.filter(c => c.providers.includes(provider));
};

// ============== API Functions ==============

/**
 * Search available phone numbers
 */
export const searchNumbers = async (
    provider: PhoneProvider,
    params: SearchParams
): Promise<AvailableNumber[]> => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required. Please log in.');

    const response = await fetch(`${API_BASE_URL}/api/phone-numbers/${provider}/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
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
    return data.available_numbers || [];
};

/**
 * Purchase a phone number and connect to agent
 */
export const purchaseNumber = async (params: {
    phone_number: string;
    agent_id: string;
    agent_name?: string;
    provider?: PhoneProvider;
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
            agent_name: params.agent_name,
            phone_number: params.phone_number,
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
 * Update phone number agent assignment
 */
export const updatePhoneNumberAgent = async (
    numberId: string,
    agentId: string,
    agentName?: string
): Promise<PhoneNumber> => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required. Please log in.');

    const response = await fetch(`${API_BASE_URL}/api/agent-numbers/${numberId}`, {
        method: 'PUT',  // ✅ Changed from PATCH
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

export const unlinkAgent = async (numberId: string): Promise<PhoneNumber> => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required. Please log in.');

    const response = await fetch(`${API_BASE_URL}/api/agent-numbers/${numberId}`, {
        method: 'PUT',  // ✅ Changed from PATCH
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            agent_id: null,
            agent_name: null,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to unlink agent');
    }

    return response.json();
};

/**
 * Delete/release a phone number
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

// ============== Provider Info ==============

export const providerInfo = {
    twilio: {
        name: 'Twilio',
        description: 'Global cloud communications with worldwide coverage',
        color: 'red',
        website: 'https://console.twilio.com',
    },
    exotel: {
        name: 'Exotel',
        description: 'Leading telephony provider for India & Southeast Asia',
        color: 'blue',
        website: 'https://my.exotel.com',
    },
};

// ============== Number Types ==============

export const numberTypes = [
    { value: 'local', label: 'Local', description: 'Standard local numbers' },
    { value: 'toll-free', label: 'Toll-Free', description: 'Free for callers' },
    { value: 'mobile', label: 'Mobile', description: 'Mobile phone numbers' },
];

// ============== Pricing Helpers ==============

export const getEstimatedPrice = (country: string, type: string = 'local'): number => {
    const pricing: Record<string, Record<string, number>> = {
        US: { local: 1.15, 'toll-free': 2.15, mobile: 1.15 },
        GB: { local: 1.15, 'toll-free': 2.15, mobile: 1.15 },
        CA: { local: 1.15, 'toll-free': 2.15, mobile: 1.15 },
        AU: { local: 2.15, 'toll-free': 4.00, mobile: 2.15 },
        DE: { local: 1.15, 'toll-free': 3.00, mobile: 1.15 },
        IN: { local: 3.00, 'toll-free': 5.00, mobile: 3.00 },
        default: { local: 1.50, 'toll-free': 3.00, mobile: 1.50 },
    };

    const countryPricing = pricing[country] || pricing.default;
    return countryPricing[type] || countryPricing.local;
};