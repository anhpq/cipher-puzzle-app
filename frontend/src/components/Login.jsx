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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import API from "../api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refreshAuth } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API}/api/login`,
        { username, password },
        { withCredentials: true }
      );

      // ⚠️ Tạm hoãn verifyAuth() để chờ trình duyệt lưu cookie
      setTimeout(async () => {
        await refreshAuth();

        if (response.data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/team");
        }
      }, 100); // 100ms là đủ cho trình duyệt lưu cookie
    } catch (err) {
      setError(err.response?.data?.error || "Login error.");
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
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
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
          isDisabled={!username || !password}
        >
          Login
        </Button>
      </form>
    </Box>
  );
}

export default Login;
