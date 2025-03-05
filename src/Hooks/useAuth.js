import { useState, useCallback } from "react";

export const useAuth = () => {
  // Initialize state from localStorage just once
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("authToken");
  });

  const [user, setUser] = useState(() => {
    return localStorage.getItem("user") || "User";
  });

  // Create login and logout functions that handle both state and localStorage
  const login = useCallback((token, userData) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", userData);
    setIsAuthenticated(true);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser("User");
  }, []);

  return {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    login,
    logout,
  };
};
