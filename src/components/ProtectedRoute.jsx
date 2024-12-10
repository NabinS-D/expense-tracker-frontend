import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};
