// frontend/src/components/StartStageModal.jsx
import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';

const StartStageModal = ({ isOpen, onClose, stage, onStageStarted }) => {
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/admin/stages/${stage.stage_id}/start`,
        { password },
        { withCredentials: true }
      );
      toast({
        title: "Stage Started",
        description: "Stage started successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Notify parent component for state refresh if needed
      onStageStarted(response.data.stage);
      onClose();
    } catch (error) {
      console.error("Error starting stage:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to start stage.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Start Stage: {stage?.stage_name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Enter Stage Password</FormLabel>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Start Stage
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StartStageModal;
