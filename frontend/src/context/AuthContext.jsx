import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isAuthenticated: false, role: null, loading: true });

  const verifyAuth = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/verify', { withCredentials: true });
      setAuth({
        isAuthenticated: response.data.isAuthenticated,
        role: response.data.role,
        loading: false
      });
    } catch (error) {
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
