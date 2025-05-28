// frontend/src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  Text
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from '../components/admin/Dashboard';
import TeamManagement from '../components/admin/TeamManagement';
import GameControls from '../components/admin/GameControls';
import ContentManagement from '../components/admin/ContentManagement';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  // API call to load teams from the database.
  const loadTeams = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/teams', {
        withCredentials: true,
      });
      console.log("Fetched game state:", response.data);
      setGameStarted(response.data.game_state);
      setTeams(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching game state:", error);
      setLoading(false);
    }
  };

  // API call to fetch the current game state from the DB.
  const fetchGameState = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/admin/game-control/game-state',
        { withCredentials: true }
      );
      // Assuming your backend returns { game_state: "started" } or "not_started"
      setGameStarted(response.data.game_state);
    } catch (error) {
      console.error('Error fetching game state:', error);
    }
  };

  useEffect(() => {
    loadTeams();
    fetchGameState();
  }, []);

  // API wrappers for team operations
  const createTeam = async (teamData) => {
    try {
      await axios.post('http://localhost:5000/api/admin/teams', teamData, { withCredentials: true });
      loadTeams();
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const updateTeam = async (teamData) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/teams/${teamData.teamid}`, teamData, { withCredentials: true });
      loadTeams();
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const deleteTeam = async (teamId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/teams/${teamId}`, { withCredentials: true });
      loadTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  // New endpoints for resetting and advancing team stage
  const resetTeamStage = async (teamId) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/teams/${teamId}/reset-stage`, {}, { withCredentials: true });
      loadTeams();
    } catch (error) {
      console.error('Error resetting team stage:', error);
    }
  };

  const nextTeamStage = async (teamId) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/teams/${teamId}/next-stage`, {}, { withCredentials: true });
      loadTeams();
    } catch (error) {
      console.error('Error advancing team stage:', error);
    }
  };

  const startGame = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin/game-control/start-game', {}, { withCredentials: true });
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const resetGame = async (resetPassword) => {
    try {
      await axios.post('http://localhost:5000/api/admin/game-control/reset-game', { resetPassword }, { withCredentials: true });
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  // Logout functionality.
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <Box p={6}>
      <Button colorScheme="red" onClick={handleLogout} float="right" mb={4}>
        Logout
      </Button>
      <Heading textAlign="center" mb={4}>
        Admin Panel
      </Heading>
      <Stack spacing={4}>
        <Heading size="sm">Current Game State:</Heading>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <Text fontSize="lg">
            {gameStarted === 'started'
              ? 'Game has started!'
              : 'Game has not started yet.'}
          </Text>
        )}
        <Button onClick={fetchGameState} colorScheme="blue">
          Refresh Game State
        </Button>
      </Stack>
      <Tabs variant="enclosed" defaultIndex={0}>
        <TabList>
          <Tab>Dashboard</Tab>
          <Tab>Team Management</Tab>
          <Tab>Game Controls</Tab>
          <Tab>Content Management</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Dashboard teams={teams} />
          </TabPanel>
          <TabPanel>
            <TeamManagement
              teams={teams}
              createTeam={createTeam}
              updateTeam={updateTeam}
              deleteTeam={deleteTeam}
              resetTeamStage={resetTeamStage}
              nextTeamStage={nextTeamStage}
              isGameStarted={gameStarted === 'started'}
            />
          </TabPanel>
          <TabPanel>
            <GameControls
              startGame={startGame}
              resetGame={resetGame}
            />
          </TabPanel>
          <TabPanel>
            <ContentManagement />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminPanel;
