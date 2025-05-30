// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
    loading: true,
  });

  // Hàm kiểm tra authentication từ backend
  const verifyAuth = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/verify', { withCredentials: true });
      // Giả sử endpoint trả về { isAuthenticated: true, role: 'admin' } hoặc { isAuthenticated: true, role: 'team' }
      setAuth({
        isAuthenticated: response.data.isAuthenticated,
        role: response.data.role,
        loading: false,
      });
    } catch (err) {
      setAuth({ isAuthenticated: false, role: null, loading: false });
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
