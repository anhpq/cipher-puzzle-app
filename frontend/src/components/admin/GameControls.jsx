import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, Stack } from '@chakra-ui/react';
import axios from 'axios';

const GameControls = () => {
  // State that tracks whether the game has started.
  const [gameStarted, setGameStarted] = useState(false);
  // State for the reset password input field.
  const [resetPassword, setResetPassword] = useState('');

  // Optionally, fetch the initial game state from the backend.
  useEffect(() => {
    const fetchGameState = async () => {
      try {
        // Example endpoint that returns: { game_state: "started" } or "not_started"
        const response = await axios.get('http://localhost:5000/api/admin/game-control/game-state', {
          withCredentials: true,
        });
        if (response.data.game_state === 'started') {
          setGameStarted(true);
        } else {
          setGameStarted(false);
        }
      } catch (error) {
        console.error('Error fetching game state:', error);
      }
    };

    fetchGameState();
  }, []);

  // Handler for starting the game.
  const handleStartGame = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/admin/game-control/start-game',
        {},
        { withCredentials: true }
      );
      setGameStarted(true); // Disable the button after a successful start.
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  // Handler for resetting the game.
  const handleResetGame = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/admin/game-control/reset-game',
        { resetPassword },
        { withCredentials: true }
      );
      setGameStarted(false); // Re-enable the Start Game button.
      setResetPassword(''); // Clear the reset password field.
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        Game Controls
      </Heading>
      <Stack spacing={4} maxW="sm">
        <Button
          colorScheme="teal"
          onClick={handleStartGame}
          isDisabled={gameStarted}
        >
          Start Game
        </Button>
        <FormControl>
          <FormLabel>Reset Password</FormLabel>
          <Input
            value={resetPassword}
            onChange={(e) => setResetPassword(e.target.value)}
            placeholder="Enter reset password"
          />
        </FormControl>
        <Button colorScheme="red" onClick={handleResetGame}>
          Reset Game
        </Button>
      </Stack>
    </Box>
  );
};

export default GameControls;
