// frontend/src/pages/TeamPanel.jsx
import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

const TeamPanel = () => {
  return (
    <Box p={6}>
      <Heading mb={4}>Team Panel</Heading>
      <p>Welcome to your team dashboard, where you can view your current stage and update your progress.</p>
      {/* Add additional team-specific components here */}
    </Box>
  );
};

export default TeamPanel;
