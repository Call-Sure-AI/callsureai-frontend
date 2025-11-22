// hooks\use-is-authenticated.ts
import { useState, useEffect } from 'react';

export const useIsAuthenticated = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            if (typeof window === 'undefined') {
                setIsAuthenticated(false);
                setToken('');
                setIsLoading(false);
                return;
            }
            const storedToken = localStorage.getItem('token');
            setIsAuthenticated(!!storedToken);
            setToken(storedToken || '');
            setIsLoading(false);
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    return { isAuthenticated, token, isLoading };
};