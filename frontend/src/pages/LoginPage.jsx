// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { username, password },
        { withCredentials: true }
      );
      setAuth({ user: response.data.user });
      toast({
        title: "Login successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      if (response.data.user.role === 'admin') {
        navigate('/adminpanel');
      } else {
        navigate('/teampanel');
      }
    } catch (error) {
      console.error("Login error", error.response?.data);
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" p={6} borderWidth="1px" borderRadius="lg">
      <Heading mb={4} textAlign="center">Login</Heading>
      <FormControl mb={3}>
        <FormLabel>Username</FormLabel>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </FormControl>
      <Button colorScheme="blue" width="full" mt={4} onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
};

export default LoginPage;
