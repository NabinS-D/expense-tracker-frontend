import { useState, useCallback } from "react";

export const useAuth = () => {
    // Initialize state from localStorage just once
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('authToken');
    });

    // Create login and logout functions that handle both state and localStorage
    const login = useCallback((token) => {
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
    }, []);

    return { 
        isAuthenticated, 
        setIsAuthenticated,
        login, 
        logout 
    };
};