import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure
} from '@chakra-ui/react';
import EditTeamModal from './EditTeamModal';
import StartTeamStageModal from './StartTeamStageModal';

const TeamManagement = ({ teams,
  createTeam,
  updateTeam,
  deleteTeam,
  resetTeamStage,
  nextTeamStage,
  isGameStarted
}) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamPassword, setNewTeamPassword] = useState('');
  const [newTeamRoute, setNewTeamRoute] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCreateTeam = () => {
    // Convert the route stages string (e.g., "1,2,3,4,5,6") to an array of numbers.
    const routeStages = newTeamRoute.split(',').map(str => parseInt(str.trim(), 10));
    createTeam({ teamname: newTeamName, password: newTeamPassword, routestages: routeStages });
    setNewTeamName('');
    setNewTeamPassword('');
    setNewTeamRoute('');
  };

  const handleEditClick = (team) => {
    setSelectedTeam(team);
    onOpen();
  };

  return (
    <Box>
      <Heading size="md" mb={4}>Team Management</Heading>

      {/* New Team Create Form */}
      <Stack spacing={3} maxW="sm" mb={6}>
        <FormControl isRequired>
          <FormLabel>Team Name</FormLabel>
          <Input
            value={newTeamName}
            onChange={e => setNewTeamName(e.target.value)}
            placeholder="Enter team name"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="text"
            value={newTeamPassword}
            onChange={e => setNewTeamPassword(e.target.value)}
            placeholder="Enter password"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Route Stages</FormLabel>
          <Input
            value={newTeamRoute}
            onChange={e => setNewTeamRoute(e.target.value)}
            placeholder="Example: 1,2,3,4,5,6"
          />
        </FormControl>
        <Button colorScheme="teal" onClick={handleCreateTeam}>
          Create Team
        </Button>
      </Stack>

      {/* Teams Table */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Team Name</Th>
            <Th>Team Password</Th>
            <Th>Current Stage</Th>
            <Th>Route Stages</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {teams && teams.length > 0 ? teams.map(team => (
            <Tr key={team.teamid}>
              <Td>{team.teamid}</Td>
              <Td>{team.teamname}</Td>
              <Td>{team.password}</Td>
              <Td>{team.currentstage}</Td>
              <Td>
                {Array.isArray(team.routestages)
                  ? team.routestages.join(', ')
                  : team.routestages}
              </Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="blue"
                  mr={2}
                  onClick={() => handleEditClick(team)}
                  hidden={isGameStarted}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  mr={2}
                  onClick={() => deleteTeam(team.teamid)}
                  hidden={isGameStarted}
                >
                  Delete
                </Button>
                {/* New buttons for stage control */}
                <Button
                  size="sm"
                  colorScheme="orange"
                  mr={2}
                  onClick={() => resetTeamStage(team.teamid)}
                  display={isGameStarted && team.currentstage < team.routestages.length ? 'inline' : 'none'}
                >
                  Reset Stage
                </Button>
                <Button
                  size="sm"
                  colorScheme="teal"
                  onClick={() => nextTeamStage(team.teamid)}
                  display={isGameStarted && team.currentstage < team.routestages.length ? 'inline' : 'none'}
                >
                  Next Stage
                </Button>
              </Td>
            </Tr>
          )) : (
            <Tr>
              <Td colSpan="5">No teams found.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {/* Edit Modal for Selected Team */}
      {selectedTeam && (
        <EditTeamModal
          isOpen={isOpen}
          onClose={() => { setSelectedTeam(null); onClose(); }}
          team={selectedTeam}
          updateTeam={updateTeam}
          deleteTeam={deleteTeam}
        />
      )}
    </Box>
  );
};

export default TeamManagement;
