// frontend/src/components/UnlockStageForm.jsx
import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';

const UnlockStageForm = ({ stageId, onUnlocked }) => {
  const [openCode, setOpenCode] = useState('');
  const toast = useToast();

  const handleUnlock = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/admin/stages/${stageId}/unlock`,
        { open_code: openCode }
      );
      toast({
        title: "Stage unlocked",
        description: "Stage unlocked successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onUnlocked(response.data.stage);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to unlock stage",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" my={4}>
      <FormControl mb={2}>
        <FormLabel>Enter Stage Open Code</FormLabel>
        <Input value={openCode} onChange={(e) => setOpenCode(e.target.value)} placeholder="Enter open code" />
      </FormControl>
      <Button colorScheme="blue" onClick={handleUnlock}>Unlock Stage</Button>
    </Box>
  );
};

export default UnlockStageForm;
