import { useState, useEffect } from 'react';

interface User {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
}

export const useCurrentUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = () => {
            try {
                const userData = localStorage.getItem('user');
                if (userData) {
                    setUser(JSON.parse(userData));
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error loading user:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();

        // Listen for storage changes
        const handleStorageChange = () => {
            loadUser();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return { user, loading, setUser };
};