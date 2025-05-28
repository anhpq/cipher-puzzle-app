// frontend/src/components/StartTeamStageModal.jsx
import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, FormControl, FormLabel,
  Input, Select, useToast
} from '@chakra-ui/react';
import axios from 'axios';

const StartTeamStageModal = ({ isOpen, onClose, team, stages, onTeamStageUpdated }) => {
  const [selectedStageId, setSelectedStageId] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleSubmit = async () => {
    if (!selectedStageId || !password) {
      toast({
        title: "Error",
        description: "Please select a stage and enter the password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      const response = await axios.post(
        `http://localhost:5000/api/teams/${team.teamid}/stages/${selectedStageId}/start`,
        { password },
        { withCredentials: true }
      );
      
      toast({
        title: "Stage Started",
        description: "Stage has been started successfully for the team.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onTeamStageUpdated(response.data.team);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to start stage for team.",
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
        <ModalHeader>Start Stage for Team: {team.teamname}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3} isRequired>
            <FormLabel>Select Stage</FormLabel>
            <Select
              placeholder="Select stage"
              onChange={(e) => setSelectedStageId(e.target.value)}
              value={selectedStageId}
            >
              {stages.map((stage) => (
                <option key={stage.stage_id} value={stage.stage_id}>
                  {stage.stage_name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Stage Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>Start Stage</Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StartTeamStageModal;
