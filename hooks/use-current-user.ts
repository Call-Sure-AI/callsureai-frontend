import { useState, useEffect, useCallback, startTransition } from 'react';

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

    useEffect(() => {
        const loadUser = () => {
            console.log('🔵 loadUser called');
            try {
                const userData = localStorage.getItem('user');
                const parsedUser = userData ? JSON.parse(userData) : null;
                console.log('🔵 loadUser result:', parsedUser);
                
                // ✅ Use startTransition for non-urgent updates
                startTransition(() => {
                    setUser(parsedUser);
                    setLoading(false);
                });
            } catch (error) {
                console.error('Error loading user:', error);
                startTransition(() => {
                    setUser(null);
                    setLoading(false);
                });
            }
        };

        loadUser();

        const handleAuthChange = () => {
            console.log('🟢 AUTH-CHANGE EVENT FIRED!');
            loadUser();
        };

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'user') {
                console.log('🔵 Storage event detected');
                loadUser();
            }
        };

        window.addEventListener('auth-change', handleAuthChange);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('auth-change', handleAuthChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const updateUser = useCallback((newUser: User | null) => {
        try {
            if (newUser) {
                localStorage.setItem('user', JSON.stringify(newUser));
            } else {
                localStorage.removeItem('user');
            }
            startTransition(() => {
                setUser(newUser);
            });
            window.dispatchEvent(new Event('auth-change'));
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }, []);

    return { user, loading, setUser: updateUser };
};