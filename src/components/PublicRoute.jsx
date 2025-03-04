import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth.js";
export const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  // If authenticated, redirect to the dashboard
  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return <Outlet />;
};
