// frontend/src/components/admin/TeamForm.jsx
import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';

const TeamForm = ({ team, onSuccess }) => {
  // In create mode, team is undefined.
  const [teamname, setTeamname] = useState(team ? team.teamname : '');
  const [password, setPassword] = useState(team ? team.password : '');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (team) {
        // Update existing team
        response = await axios.put(
          `http://localhost:5000/api/admin/teams-crud/${team.teamid}`,
          { teamname, password },
          { withCredentials: true }
        );
      } else {
        // Create a new team
        response = await axios.post(
          'http://localhost:5000/api/admin/teams-crud',
          { teamname, password },
          { withCredentials: true }
        );
      }
      toast({
        title: "Success",
        description: team ? "Team updated." : "Team created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <FormControl mb={3}>
        <FormLabel>Team Name</FormLabel>
        <Input
          type="text"
          value={teamname}
          onChange={(e) => setTeamname(e.target.value)}
          placeholder="Enter team name"
        />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </FormControl>
      <Button type="submit" colorScheme="blue">
        {team ? 'Update Team' : 'Create Team'}
      </Button>
    </Box>
  );
};

export default TeamForm;
