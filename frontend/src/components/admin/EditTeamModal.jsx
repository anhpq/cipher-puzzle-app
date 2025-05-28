import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Stack 
} from '@chakra-ui/react';

const EditTeamModal = ({ isOpen, onClose, team, updateTeam, deleteTeam }) => {
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [routeStages, setRouteStages] = useState('');

  useEffect(() => {
    if (team) {
      setTeamName(team.teamname);
      // Depending on your security, you might not prefill the password.
      // Here we assume password is stored for editing convenience.
      setPassword(team.password || '');
      setRouteStages(team.routestages ? team.routestages.join(', ') : '');
    }
  }, [team]);

  const handleUpdate = () => {
    const updatedRouteStages = routeStages.split(',').map(str => parseInt(str.trim(), 10));
    updateTeam({ ...team, teamname: teamName, password, routestages: updatedRouteStages });
    onClose();
  };

  const handleDelete = () => {
    // You may add a confirmation prompt here if desired.
    deleteTeam(team.teamid);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Team</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <FormControl isRequired>
              <FormLabel>Team Name</FormLabel>
              <Input 
                value={teamName} 
                onChange={e => setTeamName(e.target.value)} 
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input 
                type="text" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Route Stages</FormLabel>
              <Input 
                value={routeStages} 
                onChange={e => setRouteStages(e.target.value)} 
                placeholder="Example: 1,2,3,4,5,6" 
              />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={handleDelete} mr={3}>
            Delete
          </Button>
          <Button colorScheme="blue" onClick={handleUpdate} mr={3}>
            Update
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTeamModal;
