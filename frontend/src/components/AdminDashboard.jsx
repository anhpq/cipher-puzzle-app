// frontend/src/components/AdminDashboard.jsx
import React, { useContext } from "react";
import {
  Box,
  Heading,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Api from "../api";
import AuthContext from "../context/AuthContext";

// Import các component khác
import StagesTab from "./admin/StagesTab";
import QuestionsTab from "./admin/QuestionsTab";
import TeamRoutesTab from "./admin/TeamRoutesTab";
import AssignmentsTab from "./admin/AssignmentsTab";
import TeamStatusSupportTab from "./admin/TeamStatusSupportTab";
import TeamTimeReportTab from "./admin/TeamTimeReportTab";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { auth, refreshAuth } = useContext(AuthContext);

  // Nếu auth.role không phải admin thì chuyển về trang team dashboard
  if (auth.role !== "admin") {
    navigate("/team");
  }

  const handleLogout = async () => {
    try {
      await Api.post("/api/logout", {});
      // Gọi refreshAuth để cập nhật trạng thái (isAuthenticated = false)
      await refreshAuth();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
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
        <TabPanels unmountOnExit>
          <TabPanel>
            <TeamStatusSupportTab />
          </TabPanel>
          <TabPanel>
            <TeamTimeReportTab />
          </TabPanel>
          <TabPanel>
            <StagesTab />
          </TabPanel>
          <TabPanel>
            <QuestionsTab />
          </TabPanel>
          <TabPanel>
            <TeamRoutesTab />
          </TabPanel>
          <TabPanel>
            <AssignmentsTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminDashboard;
