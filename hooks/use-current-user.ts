import { useState, useEffect, useCallback } from 'react';

interface User {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: "admin" | "manager" | "member";
}

export const useCurrentUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = useCallback(() => {
        try {
            const userData = localStorage.getItem('user');
            const parsedUser = userData ? JSON.parse(userData) : null;
            setUser(parsedUser);
            return parsedUser;
        } catch (error) {
            console.error('Error loading user:', error);
            setUser(null);
            return null;
        }
    }, []);

    useEffect(() => {
        loadUser();
        setLoading(false);

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'user') {
                loadUser();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [loadUser]);

    const updateUser = useCallback((newUser: User | null) => {
        try {
            if (newUser) {
                localStorage.setItem('user', JSON.stringify(newUser));
            } else {
                localStorage.removeItem('user');
            }
            setUser(newUser);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }, []);

    return { user, loading, setUser: updateUser };
};