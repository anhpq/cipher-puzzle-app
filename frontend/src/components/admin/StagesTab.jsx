// frontend/src/components/StagesTab.jsx
import React, { useState, useEffect } from 'react';
import {
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
  VStack,
  Image
} from '@chakra-ui/react';
import axios from 'axios';

const StagesTab = ({ config }) => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newStage, setNewStage] = useState({
    stage_number: "",
    stage_name: "",
    description: "",
    open_code: ""
  });
  // Lưu file upload cho location_image
  const [newLocationImage, setNewLocationImage] = useState(null);

  // API call lấy danh sách stages
  const fetchStages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/stages', config);
      setStages(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching stages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  const handleNewStageChange = (e) => {
    setNewStage({ ...newStage, [e.target.name]: e.target.value });
  };

  // Lưu file location_image khi upload
  const handleLocationImageChange = (e) => {
    setNewLocationImage(e.target.files[0]);
  };

  // Khi nhấn Add Stage, tạo FormData và gửi kèm file location_image
  const handleAddStage = async () => {
    try {
      const formData = new FormData();
      formData.append("stage_number", newStage.stage_number);
      formData.append("stage_name", newStage.stage_name);
      formData.append("description", newStage.description);
      formData.append("open_code", newStage.open_code);
      if (newLocationImage) {
         formData.append("location_image", newLocationImage);
      }
      const response = await axios.post('http://localhost:5000/api/admin/stages', formData, {
        ...config,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStages([...stages, response.data]);
      // Reset form
      setNewStage({ stage_number: "", stage_name: "", description: "", open_code: "" });
      setNewLocationImage(null);
    } catch (err) {
      console.error("Error adding stage:", err);
    }
  };

  return (
    <Box>
      <Heading size="md" mb={2}>Stages Management</Heading>
      <VStack spacing={3} mb={4}>
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
          <FormLabel>Location Image</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handleLocationImageChange}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleAddStage}>
          Add Stage
        </Button>
      </VStack>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          {error}
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
              <Th>Location Image</Th>
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
                  {stage.location_image ? (
                    <Image
                      src={`data:image/png;base64,${stage.location_image}`}
                      alt="Location"
                      boxSize="50px"
                      objectFit="cover"
                    />
                  ) : (
                    "No Image"
                  )}
                </Td>
                <Td>
                  {/* Các nút Edit / Delete có thể thêm ở đây */}
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
    </Box>
  );
};

export default StagesTab;
