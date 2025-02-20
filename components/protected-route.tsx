"use client";

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';

interface ProtectedRouteProps {
    children: ReactNode;
    fallback?: ReactNode;
    redirectTo?: string;
}

export const ProtectedRoute = ({
    children,
    fallback,
    redirectTo = '/auth',
}: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useIsAuthenticated();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, isLoading, redirectTo, router]);

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        if (fallback) {
            return <>{fallback}</>;
        }
        return null;
    }

    return <>{children}</>;
};