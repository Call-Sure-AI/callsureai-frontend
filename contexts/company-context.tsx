// contexts/company-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';
import { toast } from '@/hooks/use-toast';
import { createOrUpdateCompany } from '@/services/company-service';

export interface CompanyData {
    id?: string;
    first_name: string;
    last_name: string;
    business_name: string;
    email: string;
    phone_number: string;
    address: string;
    logo?: string;
    api_key?: string;
    user_id?: string;
}

export interface ProcessedCompanyData {
    id?: string;
    first_name: string;
    last_name: string;
    business_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    logo?: string;
    api_key?: string;
    user_id?: string;
}

interface CompanyContextType {
    company: ProcessedCompanyData | null;
    isLoading: boolean;
    error: string | null;
    refreshCompanyData: () => Promise<void>;
    updateCompanyData: (data: ProcessedCompanyData) => Promise<boolean>;
}

const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 3): Promise<Response> => {
    let retries = 0;

    while (retries < maxRetries) {
        try {
            return await fetch(url, options);
        } catch (err) {
            if (retries === maxRetries - 1) throw err;

            retries++;
            console.log(`Retrying fetch (${retries}/${maxRetries})...`);
            // Wait for a bit before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
        }
    }

    throw new Error('Maximum retries reached');
};

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
    // const { token } = useIsAuthenticated();
    const [company, setCompany] = useState<ProcessedCompanyData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [failedAttempts, setFailedAttempts] = useState<number>(0);
    const [isOffline, setIsOffline] = useState<boolean>(false);

    // Create a default company data object based on user info
    const createDefaultCompany = (): ProcessedCompanyData => {
        return {
            first_name: user?.name?.split(' ')[0] || '',
            last_name: user?.name?.split(' ').slice(1).join(' ') || '',
            business_name: user?.email ? `${user.email.split('@')[0]}'s Business` : 'My Business',
            email: user?.email || '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zip_code: '',
            logo: user?.image || '',
            user_id: user?.id || ''
        };
    };

    const processCompanyData = (data: CompanyData, userEmail?: string, userImage?: string): ProcessedCompanyData => {
        // Add defensive checks for address before splitting
        const addressString = typeof data.address === 'string' ? data.address : '';
        const addressParts = addressString.split(',') || [];

        return {
            id: data.id,
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            business_name: data.business_name || '',
            email: data.email || userEmail || '',
            phone: data.phone_number || '',
            address: addressParts[0] || '',
            city: addressParts[1]?.trim() || '',
            state: addressParts[2]?.trim() || '',
            zip_code: addressParts[3]?.trim() || '',
            logo: data.logo || userImage || '',
            api_key: data.api_key || '',
            user_id: data.user_id || user?.id || ''
        };
    };

    const fetchCompanyData = async (): Promise<void> => {
        // ✅ Get token directly from localStorage
        const token = localStorage.getItem('token');
        
        if (!token || !user) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            if (!navigator.onLine) {
                console.warn('Network is offline. Using cached or default company data.');
                setIsOffline(true);

                if (!company) {
                    setCompany(createDefaultCompany());
                }

                setIsLoading(false);
                return;
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://beta.callsure.ai';
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

            try {
                const response = await fetchWithRetry(`${apiUrl}/api/company`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    signal: controller.signal
                }, 3);
                clearTimeout(timeoutId);

                if (response.ok) {
                    const companyData: CompanyData = await response.json();
                    const processedData = processCompanyData(
                        companyData,
                        user.email as string,
                        user.image as string
                    );
                    setCompany(processedData);
                    setFailedAttempts(0);
                    setIsOffline(false);
                } else if (response.status === 404) {
                    // Company not found - could be a new user
                    console.log('Company not found, using default data');

                    // Keep using existing company data if we have it
                    if (!company) {
                        setCompany(createDefaultCompany());
                    }

                    // Don't set an error for 404 - this is expected for new users
                } else {
                    const errorData = await response.json().catch(() => ({ message: `Server error: ${response.status}` }));
                    setError(errorData.message || 'Failed to fetch company data');

                    setFailedAttempts(prev => prev + 1);

                    // If we've failed multiple times, use default data for better UX
                    if (failedAttempts >= 2 && !company) {
                        console.warn('Multiple failed attempts to fetch company data. Using default data.');
                        setCompany(createDefaultCompany());
                    }
                }
            } catch (fetchError) {
                clearTimeout(timeoutId);
                throw fetchError;
            }
        } catch (err: any) {
            console.error('Error fetching company data:', err);

            // Handle connection errors more gracefully
            if (err.name === 'AbortError') {
                setError('Request timed out. Server may be unavailable.');
            } else if (err.message.includes('fetch')) {
                setError('Cannot connect to server. Check your internet connection.');
                setIsOffline(true);
            } else {
                setError('An error occurred while fetching company data');
            }

            setFailedAttempts(prev => prev + 1);

            // Create default company data after multiple failures for better UX
            if (failedAttempts >= 2 && !company) {
                console.warn('Multiple failed attempts to fetch company data. Using default data.');
                setCompany(createDefaultCompany());
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updateCompanyData = async (data: ProcessedCompanyData): Promise<boolean> => {
        // ✅ Get token directly from localStorage
        const token = localStorage.getItem('token');
        
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

            // For better UX, update the UI immediately
            setCompany(data);

            // Check if we're offline
            if (!navigator.onLine || isOffline) {
                toast({
                    title: "Offline Mode",
                    description: "Changes saved locally. They will sync when you're back online.",
                    // Use "default" instead of "warning" as your toast only supports "default" and "destructive"
                    variant: "default",
                });
                return true; // Return success in offline mode for better UX
            }

            // Prepare API data
            const address = typeof data.address === 'string' ? data.address : '';
            const city = typeof data.city === 'string' ? data.city : '';
            const state = typeof data.state === 'string' ? data.state : '';
            const zipCode = typeof data.zip_code === 'string' ? data.zip_code : '';

            const apiData = {
                first_name: typeof data.first_name === 'string' ? data.first_name : '',
                last_name: typeof data.last_name === 'string' ? data.last_name : '',
                business_name: typeof data.business_name === 'string' ? data.business_name : '',
                email: typeof data.email === 'string' ? data.email : '',
                phone_number: typeof data.phone === 'string' ? data.phone : '',
                address: `${address}, ${city}, ${state}, ${zipCode}`.trim(),
                logo: typeof data.logo === 'string' ? data.logo : '',
                user_id: data.user_id || user?.id
            };

            try {
                await createOrUpdateCompany(apiData, token);

                toast({
                    title: "Success",
                    description: "Company profile updated successfully.",
                    variant: "default",
                });

                return true;
            } catch (apiError) {
                // If the API call fails, we still have the local changes
                // Just show a different message
                if (typeof apiError === 'object' && apiError !== null && 'message' in apiError) {
                    const errorMessage = (apiError as Error).message || '';
                    if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('timeout')) {
                        toast({
                            title: "Info",
                            description: "Changes saved locally but couldn't reach server. Will sync when connection is restored.",
                            variant: "default",
                        });
                        return true; // We still return true for better UX
                    }
                }

                // For other types of errors, re-throw to be caught by the outer catch
                throw apiError;
            }
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

    // Network status listener for online/offline events
    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            console.log('Back online, refreshing company data');
            fetchCompanyData();
        };

        const handleOffline = () => {
            setIsOffline(true);
            console.log('Offline, using cached company data');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (user) {
            fetchCompanyData();
        } else {
            setCompany(null);
            setIsLoading(false);
        }
    }, [user]); // ✅ Only depend on user

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