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