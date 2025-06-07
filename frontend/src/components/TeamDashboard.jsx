// frontend/src/components/TeamDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import TeamDashboardWizard from "./team/TeamDashboardWizard";
import API from "../api";
import { TeamThemeProvider } from "../utils/TeamThemeContext";

const TeamDashboard = () => {
  const [teamInfo, setTeamInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTeamInfo = async () => {
    try {
      const response = await API.get(`/api/team-info/info`);
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
    <Container maxW="container.lg" centerContent p={0}>
      {error ? (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <TeamThemeProvider teamId={teamInfo.team_id}>
          <TeamDashboardWizard
            teamId={teamInfo.team_id}
            onAdvance={fetchTeamInfo}
            startTime={teamInfo.start_time}
          />
        </TeamThemeProvider>
      )}
    </Container>
  );
};

export default TeamDashboard;
