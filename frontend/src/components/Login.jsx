// frontend/src/components/Login.jsx
import React, { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, Alert, AlertIcon } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', 
        { username, password },
        { withCredentials: true }  // Đảm bảo cookie session được gửi đi
      );

      if (response.data.role === 'admin') {
        navigate('/admin/dashboard');
      }
      else {
        // Nếu đăng nhập thành công, chuyển hướng đến trang team
        navigate('/team');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login error.');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="10">
      <form onSubmit={handleSubmit}>
        <FormControl mb="4">
          <FormLabel>Username</FormLabel>
          <Input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            placeholder="Enter your username or team name" />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Password</FormLabel>
          <Input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Enter your password" />
        </FormControl>
        {error && (
          <Alert status="error" mb="4">
            <AlertIcon />
            {error}
          </Alert>
        )}
        <Button type="submit" colorScheme="blue" width="full">
          Login
        </Button>
      </form>
    </Box>
  );
}

export default Login;
