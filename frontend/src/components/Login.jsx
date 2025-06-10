// frontend/src/components/Login.jsx - Fixed version

import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Heading,
} from "@chakra-ui/react";
import { useNavigate, Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import API from "../api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { auth, refreshAuth } = useContext(AuthContext);

  // Nếu đã đăng nhập rồi, chuyển ngay về dashboard tương ứng
  if (!auth.loading && auth.isAuthenticated) {
    if (auth.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/team" replace />;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await API.post(`/api/login`, { username, password });
      console.log(42, API);

      // Không cần timeout, refresh auth ngay sau khi login thành công
      await refreshAuth();

      // Navigate dựa trên role từ response
      if (response.data.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/team", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="10">
      <Heading mb="6" textAlign="center">
        Welcome to the Game
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb="4">
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            disabled={isLoading}
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </FormControl>
        {error && (
          <Alert status="error" mb="4">
            <AlertIcon />
            {error}
          </Alert>
        )}
        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          isDisabled={!username || !password || isLoading}
          isLoading={isLoading}
          loadingText="Logging in..."
        >
          Login
        </Button>
      </form>
    </Box>
  );
}

export default Login;
