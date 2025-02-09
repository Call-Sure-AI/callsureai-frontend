"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

interface UseAuthOptions {
    onLogoutSuccess?: () => void;
    onLogoutError?: (error: Error) => void;
    redirectPath?: string;
}

interface AuthState {
    isLoggingOut: boolean;
    error: Error | null;
}

export const useAuth = (options: UseAuthOptions = {}) => {
    const router = useRouter();
    const [state, setState] = useState<AuthState>({
        isLoggingOut: false,
        error: null,
    });

    const clearAuthData = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    const handleGoogleLogout = useCallback(async () => {
        try {
            const { googleLogout } = await import('@react-oauth/google');
            googleLogout();
        } catch (error) {
            console.error('Google logout error:', error);
        }
    }, []);

    const logout = useCallback(async () => {
        if (state.isLoggingOut) return;


        try {
            setState({ isLoggingOut: true, error: null });
            clearAuthData();

            await handleGoogleLogout();

            toast({
                title: "Logged out successfully",
                description: "You have been logged out of your account",
            });

            options.onLogoutSuccess?.();

            if (options.redirectPath) {
                router.push(options.redirectPath);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            console.error('Logout error:', error);

            setState(prev => ({ ...prev, error: error as Error }));

            toast({
                title: "Error",
                description: errorMessage ? errorMessage : "Failed to log out",
                variant: "destructive",
            });

            options.onLogoutError?.(error as Error);
        } finally {
            setState({
                isLoggingOut: false,
                error: null
            });
        }
    }, [router, clearAuthData, handleGoogleLogout, options]);

    return {
        logout,
        isLoggingOut: state.isLoggingOut,
        error: state.error,
    };
};