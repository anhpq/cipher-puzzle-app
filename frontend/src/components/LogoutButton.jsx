// frontend/src/components/LogoutButton.jsx
import React from 'react';
import { Button } from '@chakra-ui/react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Button colorScheme="red" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
