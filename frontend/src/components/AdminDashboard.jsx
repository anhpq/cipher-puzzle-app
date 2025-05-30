// frontend/src/components/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Input,
  FormControl,
  FormLabel,
  VStack
} from "@chakra-ui/react";
import axios from "axios";

// Cấu hình header để gửi x-admin-secret (lấy từ biến môi trường VITE_ADMIN_PASSWORD)
const config = {
  headers: {
    "x-admin-secret": import.meta.env.VITE_ADMIN_PASSWORD,
  },
};

const AdminDashboard = () => {
  /* --- STAGES --- */
  const [stages, setStages] = useState([]);
  const [loadingStages, setLoadingStages] = useState(false);
  const [errorStages, setErrorStages] = useState("");
  const [newStage, setNewStage] = useState({
    stage_number: "",
    stage_name: "",
    description: "",
    open_code: "",
    location_image: "",
  });

  const fetchStages = async () => {
    setLoadingStages(true);
    try {
      const response = await axios.get("http://localhost:5000/api/admin/stages", config);
      setStages(response.data);
    } catch (err) {
      setErrorStages(err.response?.data?.error || "Error fetching stages");
    } finally {
      setLoadingStages(false);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  const handleNewStageChange = (e) => {
    setNewStage({ ...newStage, [e.target.name]: e.target.value });
  };

  const handleAddStage = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/admin/stages", newStage, config);
      setStages([...stages, response.data]);
      setNewStage({
        stage_number: "",
        stage_name: "",
        description: "",
        open_code: "",
        location_image: "",
      });
    } catch (err) {
      setErrorStages(err.response?.data?.error || "Error adding stage");
    }
  };

  /* --- CÁC TAB KHÁC --- */
  // Phần quản lý Questions, Team Routes, Assignments có thể triển khai tương tự.
  // Ở đây chỉ đưa vào placeholder

  return (
    <Box p={4}>
      <Heading mb={4}>Admin Dashboard</Heading>
      <Tabs variant="enclosed" isFitted>
        <TabList mb="1em">
          <Tab>Stages</Tab>
          <Tab>Questions</Tab>
          <Tab>Team Routes</Tab>
          <Tab>Assignments</Tab>
        </TabList>
        <TabPanels>
          {/* STAGES TAB */}
          <TabPanel>
            <Box mb={4}>
              <Heading size="md" mb={2}>Add New Stage</Heading>
              <VStack spacing={3} align="stretch">
                <FormControl>
                  <FormLabel>Stage Number</FormLabel>
                  <Input
                    type="number"
                    name="stage_number"
                    value={newStage.stage_number}
                    onChange={handleNewStageChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Stage Name</FormLabel>
                  <Input
                    type="text"
                    name="stage_name"
                    value={newStage.stage_name}
                    onChange={handleNewStageChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input
                    type="text"
                    name="description"
                    value={newStage.description}
                    onChange={handleNewStageChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Open Code</FormLabel>
                  <Input
                    type="text"
                    name="open_code"
                    value={newStage.open_code}
                    onChange={handleNewStageChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Location Image (Base64)</FormLabel>
                  <Input
                    type="text"
                    name="location_image"
                    value={newStage.location_image}
                    onChange={handleNewStageChange}
                  />
                </FormControl>
                <Button colorScheme="blue" onClick={handleAddStage}>
                  Add Stage
                </Button>
              </VStack>
            </Box>
            {loadingStages ? (
              <Spinner />
            ) : errorStages ? (
              <Alert status="error">
                <AlertIcon />
                {errorStages}
              </Alert>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Stage Number</Th>
                    <Th>Stage Name</Th>
                    <Th>Description</Th>
                    <Th>Open Code</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stages.map((stage) => (
                    <Tr key={stage.stage_id}>
                      <Td>{stage.stage_id}</Td>
                      <Td>{stage.stage_number}</Td>
                      <Td>{stage.stage_name}</Td>
                      <Td>{stage.description}</Td>
                      <Td>{stage.open_code}</Td>
                      <Td>
                        <Button size="sm" colorScheme="blue" mr={2}>
                          Edit
                        </Button>
                        <Button size="sm" colorScheme="red">
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </TabPanel>
          
          {/* QUESTIONS TAB */}
          <TabPanel>
            <Box>Questions management section – triển khai tương tự như Stages.</Box>
          </TabPanel>
          
          {/* TEAM ROUTES TAB */}
          <TabPanel>
            <Box>Team Routes management section – triển khai theo yêu cầu của dự án.</Box>
          </TabPanel>
          
          {/* ASSIGNMENTS TAB */}
          <TabPanel>
            <Box>Assignments management section – chỉ hiển thị, dữ liệu được cập nhật tự động.</Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminDashboard;
