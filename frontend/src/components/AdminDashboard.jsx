// frontend/src/components/AdminDashboard.jsx
import React, { useContext } from 'react';
import { Box, Heading, Button, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import các component khác
import StagesTab from './admin/StagesTab';
import QuestionsTab from './admin/QuestionsTab';
import TeamRoutesTab from './admin/TeamRoutesTab';
import AssignmentsTab from './admin/AssignmentsTab';
import TeamStatusSupportTab from './admin/TeamStatusSupportTab';
import TeamTimeReportTab from './admin/TeamTimeReportTab';
import AuthContext from '../context/AuthContext';
import API from '../api';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { auth } = useContext(AuthContext);
  if (auth.role !== 'admin') {
    navigate('/team');
  }

  const config = { withCredentials: true };

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/api/logout`, {}, config);
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
      <Tabs variant="enclosed" isFitted isLazy>
        <TabList mb="1em">
          <Tab>Team Status & Support</Tab>
          <Tab>Report</Tab>
          <Tab>Stages</Tab>
          <Tab>Questions</Tab>
          <Tab>Team Routes</Tab>
          <Tab>Assignments</Tab>
        </TabList>
        {/* unmountOnExit đảm bảo rằng mỗi tab khi không hiển thị sẽ bị unmount */}
        <TabPanels unmountOnExit>
          <TabPanel>
            <TeamStatusSupportTab config={config} />
          </TabPanel>
          <TabPanel>
            <TeamTimeReportTab config={config} />
          </TabPanel>
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
