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
    const { isAuthenticated } = useIsAuthenticated();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated && redirectTo) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, redirectTo, router]);


    if (!isAuthenticated) {
        if (fallback) {
            return <>{fallback}</>;
        }
        return null;
    }

    return <>{children}</>;
};