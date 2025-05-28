// frontend/src/pages/ManageStages.jsx
import React, { useState } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import StageForm from '../components/StageForm';
import StageList from '../components/StageList';

const ManageStages = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshStages = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Manage Stages</Heading>
      <StageForm refreshStages={refreshStages} />
      <StageList refreshTrigger={refreshTrigger} />
    </Box>
  );
};

export default ManageStages;
