import { useState, useEffect } from "react";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Get initial state from localStorage
        return !!localStorage.getItem('authToken');
    });

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        setIsAuthenticated(!!storedToken); // Update state based on token presence
    }, []);

    return { isAuthenticated, setIsAuthenticated };
};
