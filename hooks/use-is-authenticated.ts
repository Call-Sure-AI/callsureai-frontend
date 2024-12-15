export const useIsAuthenticated = () => {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;
    return { isAuthenticated, token };
};