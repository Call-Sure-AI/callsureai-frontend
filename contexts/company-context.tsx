"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';
import { toast } from '@/hooks/use-toast';
import { createOrUpdateCompany } from '@/services/company-service';

export interface CompanyData {
    id?: string;
    business_name: string;
    email: string;
    phone_number: string;
    address: string;
    logo?: string;
    api_key?: string;
    userId?: string;
}

export interface ProcessedCompanyData {
    id?: string;
    business_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    logo?: string;
    api_key?: string;
    userId?: string;
}

interface CompanyContextType {
    company: ProcessedCompanyData | null;
    isLoading: boolean;
    error: string | null;
    refreshCompanyData: () => Promise<void>;
    updateCompanyData: (data: ProcessedCompanyData) => Promise<boolean>;
}

const CompanyContext = createContext<CompanyContextType>({
    company: null,
    isLoading: false,
    error: null,
    refreshCompanyData: async () => { },
    updateCompanyData: async () => false
});

export const useCompany = () => useContext(CompanyContext);

interface CompanyProviderProps {
    children: ReactNode;
}

export const CompanyProvider = ({ children }: CompanyProviderProps) => {
    const { user } = useCurrentUser();
    const { token } = useIsAuthenticated();
    const [company, setCompany] = useState<ProcessedCompanyData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const processCompanyData = (data: CompanyData, userEmail?: string, userImage?: string): ProcessedCompanyData => {
        // Add defensive checks for address before splitting
        const addressString = typeof data.address === 'string' ? data.address : '';
        const addressParts = addressString.split(',') || [];

        return {
            id: data.id,
            business_name: data.business_name || '',
            email: data.email || userEmail || '',
            phone: data.phone_number || '',
            address: addressParts[0] || '',
            city: addressParts[1]?.trim() || '',
            state: addressParts[2]?.trim() || '',
            zip_code: addressParts[3]?.trim() || '',
            logo: data.logo || userImage || '',
            api_key: data.api_key || '',
            userId: data.userId || user?.id || ''
        };
    };

    const fetchCompanyData = async (): Promise<void> => {
        if (!token || !user) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const companyData: CompanyData = await response.json();
                const processedData = processCompanyData(
                    companyData,
                    user.email as string,
                    user.image as string
                );
                setCompany(processedData);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to fetch company data');
            }
        } catch (err) {
            console.error('Error fetching company data:', err);
            setError('An error occurred while fetching company data');
        } finally {
            setIsLoading(false);
        }
    };

    const updateCompanyData = async (data: ProcessedCompanyData): Promise<boolean> => {
        if (!token) {
            toast({
                title: "Error",
                description: "Please login to update your company profile.",
                variant: "destructive",
            });
            return false;
        }

        try {
            setIsLoading(true);

            const address = typeof data.address === 'string' ? data.address : '';
            const city = typeof data.city === 'string' ? data.city : '';
            const state = typeof data.state === 'string' ? data.state : '';
            const zipCode = typeof data.zip_code === 'string' ? data.zip_code : '';

            const apiData = {
                name: user?.name || '',
                business_name: typeof data.business_name === 'string' ? data.business_name : '',
                email: typeof data.email === 'string' ? data.email : '',
                phone_number: typeof data.phone === 'string' ? data.phone : '',
                address: `${address}, ${city}, ${state}, ${zipCode}`.trim(),
                logo: typeof data.logo === 'string' ? data.logo : '',
                userId: data.userId || user?.id
            };

            await createOrUpdateCompany(apiData, token);

            await fetchCompanyData();

            toast({
                title: "Success",
                description: "Company profile updated successfully.",
                variant: "default",
            });

            return true;
        } catch (err: any) {
            console.error('Error updating company data:', err);
            setError(err.message || 'An error occurred while updating company data');
            toast({
                title: "Error",
                description: err.message || "Failed to update profile. Please try again.",
                variant: "destructive",
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user && token) {
            fetchCompanyData();
        } else {
            setCompany(null);
            setIsLoading(false);
        }
    }, [user, token]);

    const value = {
        company,
        isLoading,
        error,
        refreshCompanyData: fetchCompanyData,
        updateCompanyData
    };

    return (
        <CompanyContext.Provider value={value}>
            {children}
        </CompanyContext.Provider>
    );
};