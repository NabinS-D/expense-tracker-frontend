import React, { createContext, useState, useContext } from "react";

// Create a Context
const LoadingContext = createContext();

// Create a provider for the loading state
export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

// Create a custom hook to access the loading state
export const useLoading = () => useContext(LoadingContext);
