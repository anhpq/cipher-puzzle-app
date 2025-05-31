// frontend/src/components/TeamPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Heading, Button, Spinner, Alert, AlertIcon, Input, FormControl, FormLabel } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeamPage = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const config = { withCredentials: true };

  const fetchCurrentPuzzle = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/team/current', config);
      setCurrentPuzzle(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching current puzzle.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentPuzzle();
  }, []);

  const handleSubmitCode = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/team/submit', { code: inputCode }, config);
      alert(response.data.message);
      fetchCurrentPuzzle(); // load next puzzle if applicable
    } catch (err) {
      alert(err.response?.data?.error || 'Submission failed.');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, config);
      localStorage.removeItem('teamLoggedIn');
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Team Dashboard</Heading>
      <Button colorScheme="red" mb={4} onClick={handleLogout}>
        Logout
      </Button>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      ) : currentPuzzle ? (
        <Box>
          <Heading size="md" mb={2}>Current Puzzle</Heading>
          <Box mb={4}>{currentPuzzle.question_text}</Box>
          <FormControl mb={4}>
            <FormLabel>Enter Open Code</FormLabel>
            <Input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Enter the code to unlock next stage"
            />
          </FormControl>
          <Button onClick={handleSubmitCode} colorScheme="blue">
            Submit
          </Button>
        </Box>
      ) : (
        <Box>No puzzle assigned yet.</Box>
      )}
    </Box>
  );
};

export default TeamPage;
