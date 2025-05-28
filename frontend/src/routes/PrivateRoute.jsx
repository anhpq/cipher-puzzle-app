// frontend/src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const PrivateRoute = ({ children }) => {
  // Get the entire auth context.
  const { auth } = useAuth();

  // Check if auth exists and that it has a user.
  if (!auth || !auth.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
