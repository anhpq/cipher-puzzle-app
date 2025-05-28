// frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import TeamPanel from './pages/TeamPanel';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Admin Panel Route */}
      <Route
        path="/adminpanel"
        element={
          <PrivateRoute>
            <AdminPanel />
          </PrivateRoute>
        }
      />

      {/* Protected Team Panel Route */}
      <Route
        path="/teampanel"
        element={
          <PrivateRoute>
            <TeamPanel />
          </PrivateRoute>
        }
      />

      {/* Fallback - if no routes match, redirect to login */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
