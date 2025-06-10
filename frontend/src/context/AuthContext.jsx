// ==================== src/context/AuthContext.jsx ====================
import React, { createContext, useState, useEffect, useCallback } from "react";
import API from "../config/api";
import TokenUtils from "../utils/tokenUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
    loading: true,
    token: null,
    user: null,
    error: null,
  });

  // Set loading state
  const setLoading = useCallback((loading) => {
    setAuth((prev) => ({ ...prev, loading }));
  }, []);

  // Set error state
  const setError = useCallback((error) => {
    setAuth((prev) => ({ ...prev, error }));
  }, []);

  // Setup axios interceptors
  const setupAxiosInterceptors = useCallback(() => {
    // Request interceptor - add token to headers
    const requestInterceptor = API.interceptors.request.use(
      (config) => {
        const token = TokenUtils.getToken();
        if (token && !TokenUtils.isTokenExpired(token)) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token expiration
    const responseInterceptor = API.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 403 &&
          error.response?.data?.code === "TOKEN_EXPIRED" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return API(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      API.interceptors.request.eject(requestInterceptor);
      API.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Verify authentication
  const verifyAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = TokenUtils.getToken();
      console.log(82, token);
      if (!token) {
        setAuth({
          isAuthenticated: false,
          role: null,
          loading: false,
          token: null,
          user: null,
          error: null,
        });
        return;
      }

      // Check if token is expired
      if (TokenUtils.isTokenExpired(token)) {
        TokenUtils.removeToken();
        setAuth({
          isAuthenticated: false,
          role: null,
          loading: false,
          token: null,
          user: null,
          error: null,
        });
        return;
      }

      const response = await API.get("/api/verify");

      setAuth({
        isAuthenticated: response.data.isAuthenticated,
        role: response.data.role,
        loading: false,
        token,
        user: response.data.user,
        error: null,
      });
    } catch (error) {
      console.error("Error verifying authentication:", error);

      // If token is invalid, remove it
      TokenUtils.removeToken();
      setAuth({
        isAuthenticated: false,
        role: null,
        loading: false,
        token: null,
        user: null,
        error:
          error.response?.data?.error || "Authentication verification failed",
      });
    }
  }, []);

  // Login function
  const login = useCallback(async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.post("/api/login", { username, password });
      const { token, role, user } = response.data;

      // Save token
      TokenUtils.setToken(token);

      // Update auth state
      setAuth({
        isAuthenticated: true,
        role,
        loading: false,
        token,
        user,
        error: null,
      });

      return { success: true, role, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const token = TokenUtils.getToken();
      if (token) {
        await API.post("/api/logout");
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear token and reset state
      TokenUtils.removeToken();
      setAuth({
        isAuthenticated: false,
        role: null,
        loading: false,
        token: null,
        user: null,
        error: null,
      });
    }
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const response = await API.post("/api/refresh");
      const { token } = response.data;

      TokenUtils.setToken(token);
      setAuth((prev) => ({ ...prev, token }));

      return token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      throw error;
    }
  }, [logout]);

  // Auto refresh token
  useEffect(() => {
    if (auth.isAuthenticated && !auth.loading && auth.token) {
      const checkAndRefreshToken = () => {
        if (TokenUtils.isTokenExpiringSoon(auth.token, 30)) {
          // 30 minutes before expiry
          refreshToken().catch((error) => {
            console.error("Auto token refresh failed:", error);
          });
        }
      };

      // Check immediately
      checkAndRefreshToken();

      // Check every 15 minutes
      const interval = setInterval(checkAndRefreshToken, 15 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [auth.isAuthenticated, auth.loading, auth.token, refreshToken]);

  // Initialize auth and setup interceptors
  useEffect(() => {
    const cleanupInterceptors = setupAxiosInterceptors();
    verifyAuth();

    return cleanupInterceptors;
  }, [verifyAuth, setupAxiosInterceptors]);

  const contextValue = {
    auth,
    login,
    logout,
    refreshAuth: verifyAuth,
    refreshToken,
    setError,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
