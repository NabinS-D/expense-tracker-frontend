import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Signin } from "./components/Signin";
import { Category } from "./Pages/Category";
import { Expense } from "./Pages/Expense";
import { Budget } from "./Pages/Budget";
import { CategoryDetails } from "./Pages/CategoryDetails";
import { ResponsiveDrawer } from "./layout/ResponsiveDrawer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./Pages/Dashboard";
import { LoadingProvider } from "./Context/LoadingContext";
import "./App.css";
import { SignUp } from "./components/SignUp";
import { PublicRoute } from "./components/PublicRoute";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <Signin />,
      },
      {
        path: "/register",
        element: <SignUp />,
      },
      {
        path: "/",
        element: <Signin />,
      },
    ],
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <ResponsiveDrawer />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "category",
        element: <Category />,
      },
      {
        path: "expense",
        element: <Expense />,
      },
      {
        path: "budget",
        element: <Budget />,
      },
      {
        path: "category-details",
        element: <CategoryDetails />,
      },
    ],
  },
]);

function App() {
  return (
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
  );
}

export default App;
