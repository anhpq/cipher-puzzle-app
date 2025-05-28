// frontend/src/components/Dashboard.jsx
import React from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const Dashboard = ({ teams }) => {
  // Always display a fixed number of stages
  const STAGE_COUNT = 6;

  return (
    <Box>
      <Heading size="md" mb={4}>
        Dashboard: Stage Completion Details
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Team Name</Th>
            {Array.from({ length: STAGE_COUNT }, (_, i) => (
              <React.Fragment key={`header-${i}`}>
                <Th textAlign="center">Stage {i + 1}</Th>
                <Th textAlign="center">Completion Time {i + 1}</Th>
              </React.Fragment>
            ))}
            <Th>Total Time</Th>
          </Tr>
        </Thead>
        <Tbody>
          {teams.map(team => (
            <Tr key={team.teamid}>
              <Td>{team.teamname}</Td>
              {Array.from({ length: STAGE_COUNT }, (_, i) => {
                const completion = team.completiontimes && team.completiontimes[i];
                return (
                  <React.Fragment key={`${team.teamid}-stage-${i}`}>
                    <Td textAlign="center">
                      {completion ? 'Completed' : ''}
                    </Td>
                    <Td textAlign="center">
                      {completion ? new Date(completion).toLocaleString() : 'N/A'}
                    </Td>
                  </React.Fragment>
                );
              })}
              <Td>{team.totalTime ? team.totalTime : 'N/A'}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Dashboard;
