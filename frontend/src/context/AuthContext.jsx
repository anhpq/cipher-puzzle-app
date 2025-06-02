import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isAuthenticated: false, role: null, loading: true });

  const verifyAuth = async () => {
    try {
      const response = await axios.get(`${API}/api/verify`, {}, { withCredentials: true });
      console.log('Authentication verification response:', response.data);
      setAuth({
        isAuthenticated: response.data.isAuthenticated,
        role: response.data.role,
        loading: false
      });
    } catch (error) {
      console.log('Error verifying authentication:', error);
      setAuth({ isAuthenticated: false, role: null, loading: false });
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  const refreshAuth = async () => {
    await verifyAuth(); // đảm bảo gọi được await bên ngoài
  };

  return <AuthContext.Provider value={{ auth, refreshAuth }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
