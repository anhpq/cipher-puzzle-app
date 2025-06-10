// ==================== src/components/PrivateRoute.jsx ====================
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { auth } = useAuth();

  if (auth.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && auth.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;