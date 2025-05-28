// frontend/src/components/admin/TeamList.jsx
import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, TableCaption, Spinner } from '@chakra-ui/react';
import axios from 'axios';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/teams', { withCredentials: true });
      setTeams(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching teams:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  if (loading) return <Spinner />;

  return (
    <Box>
      <Table variant="simple">
        <TableCaption>Team List</TableCaption>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Team Name</Th>
            <Th>Current Stage</Th>
          </Tr>
        </Thead>
        <Tbody>
          {teams.map(team => (
            <Tr key={team.teamid}>
              <Td>{team.teamid}</Td>
              <Td>{team.teamname}</Td>
              <Td>{team.currentstage}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TeamList;
