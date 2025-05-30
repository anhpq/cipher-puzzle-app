// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  // For demonstration, check a flag in localStorage.
  // In a session-based system, you might check for an API response or similar.
  const isLoggedIn = localStorage.getItem('adminLoggedIn') || localStorage.getItem('teamLoggedIn');
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
