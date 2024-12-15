export const useIsAuthenticated = () => {
    if (typeof window === 'undefined') return { isAuthenticated: false, token: '' };
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;
    return { isAuthenticated, token };
};