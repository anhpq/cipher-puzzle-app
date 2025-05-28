// frontend/src/context/AuthProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null });
  const [loading, setLoading] = useState(true);

  // On mount, check if a user session already exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/current', {
          withCredentials: true,
        });
        // If a user exists, update the auth state accordingly
        setAuth({ user: response.data.user });
      } catch (error) {
        // No user session was found, or an error occurred
        console.error('Error checking auth session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      setAuth({ user: null });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    // Render a loading indicator until we know the session state.
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
