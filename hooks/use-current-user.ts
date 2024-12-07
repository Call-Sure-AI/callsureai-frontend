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
                }
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();

        window.addEventListener('storage', loadUser);
        return () => window.removeEventListener('storage', loadUser);
    }, []);

    return { user, loading, setUser };
};