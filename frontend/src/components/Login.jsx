// ==================== src/components/Login.jsx ====================
import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Heading,
  useToast,
  VStack,
  Text
} from "@chakra-ui/react";
import { useNavigate, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { auth, login } = useAuth();

  // Redirect if already authenticated
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

    try {
      const result = await login(username, password);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${username}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // Navigate based on role
      if (result.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/team", { replace: true });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login failed";
      
      toast({
        title: "Login failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (auth.loading) {
    return (
      <Box maxW="md" mx="auto" mt="10" textAlign="center">
        <Heading mb="6">Loading...</Heading>
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt="10" p="6" borderRadius="lg" boxShadow="lg">
      <VStack spacing="6">
        <Heading textAlign="center" color="blue.600">
          Welcome to the Game
        </Heading>
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing="4">
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={isLoading}
                autoComplete="username"
                size="lg"
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
                size="lg"
              />
            </FormControl>
            
            {auth.error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {auth.error}
              </Alert>
            )}
            
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              size="lg"
              isDisabled={!username || !password || isLoading}
              isLoading={isLoading}
              loadingText="Logging in..."
            >
              Login
            </Button>
          </VStack>
        </form>
        
        <Text fontSize="sm" color="gray.500" textAlign="center">
          Enter your team name as username and password
        </Text>
      </VStack>
    </Box>
  );
}

export default Login;