// frontend/src/components/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import API from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
    loading: true,
  });

  const verifyAuth = async () => {
    try {
      const response = await API.get(`/api/verify`);
      debugger;
      setAuth({
        isAuthenticated: response.data.isAuthenticated,
        role: response.data.role,
        loading: false,
      });
    } catch (error) {
      console.log("❌ Error verifying authentication:", error);
      setAuth({ isAuthenticated: false, role: null, loading: false });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      await verifyAuth();
    };
    checkAuth();
  }, []);

  const refreshAuth = async () => {
    await verifyAuth();
  };

  return (
    <AuthContext.Provider value={{ auth, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
