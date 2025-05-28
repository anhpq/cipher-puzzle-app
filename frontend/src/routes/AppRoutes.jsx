// frontend/src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard'; // Assume a Dashboard page exists.
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from '../context/AuthProvider';

const AppRoutes = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        {/* Add additional protected routes as needed */}
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default AppRoutes;
