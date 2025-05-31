// frontend/src/components/TeamDashboard.jsx
import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import TeamDashboardWizard from './team/TeamDashboardWizard';

const TeamDashboard = ({ config, teamId }) => {
  return (
    <Box p={4}>
      <Heading mb={6}>Cipher Puzzle Game - Dashboard</Heading>
      <TeamDashboardWizard config={config} teamId={teamId} />
    </Box>
  );
};

export default TeamDashboard;
