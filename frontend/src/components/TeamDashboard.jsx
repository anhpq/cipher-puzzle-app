// frontend/src/components/TeamDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Container, Heading, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import axios from 'axios';
import TeamDashboardWizard from './team/TeamDashboardWizard';
import API from '../api';

const TeamDashboard = () => {
  const [teamInfo, setTeamInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const config = { withCredentials: true };

  const fetchTeamInfo = async () => {
    try {
      const response = await API.get(`/api/team-info/info`, config);
      setTeamInfo(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching team info");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamInfo();
  }, []);

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Container maxW="container.lg" centerContent py={8}>
      {error ? (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <>
          <Heading as="h1" size="2xl" mb={2} color="teal.600">
            Welcome {teamInfo.team_name}!
          </Heading>
          {teamInfo.start_time && (
            <Text mb={6} fontSize="lg" color="gray.600">
              Game started at: {new Date(teamInfo.start_time).toLocaleString()}
            </Text>
          )}
          <TeamDashboardWizard config={config} teamId={teamInfo.team_id} onAdvance={fetchTeamInfo} />
        </>
      )}
    </Container>
  );
};

export default TeamDashboard;
