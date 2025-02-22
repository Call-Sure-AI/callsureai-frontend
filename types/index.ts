// types.ts
import { LucideIcon } from 'lucide-react';
export interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    children: React.ReactNode;
}

export interface UserData {
    id: string;
    name: string;
    company: string;
    lastActivity: string;
    avatarUrl?: string;
}

export interface AnalyticMetric {
    label: string;
    value: number;
    trend: number;
    changePercentage: number;
}

export interface TransactionRecord {
    id: string;
    userId: string;
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
}

// Analytics feature data types
export interface FeatureMetrics {
    activeUsers: AnalyticMetric;
    newUsers: AnalyticMetric;
    transactions: AnalyticMetric;
}

export interface User {
    id: string;
    email: string;
}

export interface AccessLevel {
    name: AccessLevelName;
    icon: any;
}

export type AccessLevelName = 'Admin Access' | 'Projects Access' | 'Custom Projects Access';
export type SelectedAccessMap = Record<string, AccessLevelName>;

export interface AccessManagerProps {
    initialUsers?: User[];
    onInvite?: (users: User[]) => void;
    onCancel?: () => void;
}

export interface HistoryEntry {
    id: string;
    user: string;
    actionName: string;
    actionTime: string;
}

export interface AgentFormData {
    id?: string;
    user_id: string;
    name: string;
    type: string;
    prompt: string;
    is_active: boolean;
    additional_context: {
        gender: string;
        tone: string;
        language: string;
        roleDescription: string;
        businessContext: string;
    };
    advanced_settings: {
        authUrl: string;
        clientId: string;
        clientSecret: string;
        apis: string[];
    };
    files: string[];
    company_id?: string;
    confidence_threshold?: number;
    template_id?: string;
}

export interface ProfileFormData {
    first_name: string;
    last_name: string;
    business_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    image: string;
    logo?: string;
}

export interface Activity {
    id: string;
    user_id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    metadata?: Record<string, any>;
    created_at?: Date;
}