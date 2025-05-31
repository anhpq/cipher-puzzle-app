// frontend/src/components/AdminDashboard.jsx
import React from 'react';
import { Box, Heading, Button, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import theo các file đã tạo
import StagesTab from './admin/StagesTab';
import QuestionsTab from './admin/QuestionsTab';
import TeamRoutesTab from './admin/TeamRoutesTab';
import AssignmentsTab from './admin/AssignmentsTab';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const config = { withCredentials: true };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, config);
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Admin Dashboard</Heading>
      <Button colorScheme="red" mb={4} onClick={handleLogout}>
        Logout
      </Button>
      <Tabs variant="enclosed" isFitted>
        <TabList mb="1em">
          <Tab>Stages</Tab>
          <Tab>Questions</Tab>
          <Tab>Team Routes</Tab>
          <Tab>Assignments</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <StagesTab config={config} />
          </TabPanel>
          <TabPanel>
            <QuestionsTab config={config} />
          </TabPanel>
          <TabPanel>
            <TeamRoutesTab config={config} />
          </TabPanel>
          <TabPanel>
            <AssignmentsTab config={config} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminDashboard;
