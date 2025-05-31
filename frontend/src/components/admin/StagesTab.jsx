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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
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
    open_code: "",
    location_image: ""
  });

  // Modal cho chỉnh sửa stage
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingStage, setEditingStage] = useState(null);
  const [editStageData, setEditStageData] = useState({
    stage_number: "",
    stage_name: "",
    description: "",
    open_code: "",
    location_image: ""
  });

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

  // Thêm mới stage
  const handleNewStageChange = (e) => {
    setNewStage({ ...newStage, [e.target.name]: e.target.value });
  };

  const handleAddStage = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/admin/stages', newStage, config);
      setStages([...stages, response.data]);
      setNewStage({
        stage_number: "",
        stage_name: "",
        description: "",
        open_code: "",
        location_image: ""
      });
    } catch (err) {
      console.error("Error adding stage:", err);
    }
  };

  // Edit: mở modal với dữ liệu stage cần chỉnh sửa
  const handleEditClick = (stage) => {
    setEditingStage(stage);
    setEditStageData(stage);
    onOpen();
  };

  const handleEditChange = (e) => {
    setEditStageData({ ...editStageData, [e.target.name]: e.target.value });
  };

  const handleUpdateStage = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/stages/${editingStage.stage_id}`,
        editStageData,
        config
      );
      const updatedStages = stages.map(s =>
        s.stage_id === editingStage.stage_id ? response.data : s
      );
      setStages(updatedStages);
      onClose();
    } catch (err) {
      console.error("Error updating stage:", err);
    }
  };

  // Delete stage
  const handleDeleteStage = async (stageId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/stages/${stageId}`, config);
      setStages(stages.filter(s => s.stage_id !== stageId));
    } catch (err) {
      console.error("Error deleting stage:", err);
    }
  };

  return (
    <Box>
      <Heading size="md" mb={2}>Stages Management</Heading>
      {/* Form thêm mới stage */}
      <VStack spacing={3} mb={4}>
        <FormControl>
          <FormLabel>Stage Number</FormLabel>
          <Input type="number" name="stage_number" value={newStage.stage_number} onChange={handleNewStageChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Stage Name</FormLabel>
          <Input type="text" name="stage_name" value={newStage.stage_name} onChange={handleNewStageChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input type="text" name="description" value={newStage.description} onChange={handleNewStageChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Open Code</FormLabel>
          <Input type="text" name="open_code" value={newStage.open_code} onChange={handleNewStageChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Location Image</FormLabel>
          <Input type="text" name="location_image" value={newStage.location_image} onChange={handleNewStageChange} />
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
                <Td>{stage.location_image}</Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    mr={2}
                    onClick={() => handleEditClick(stage)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDeleteStage(stage.stage_id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Modal chỉnh sửa Stage */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Stage</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <FormControl>
                <FormLabel>Stage Number</FormLabel>
                <Input
                  type="number"
                  name="stage_number"
                  value={editStageData.stage_number}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Stage Name</FormLabel>
                <Input
                  type="text"
                  name="stage_name"
                  value={editStageData.stage_name}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  name="description"
                  value={editStageData.description}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Open Code</FormLabel>
                <Input
                  type="text"
                  name="open_code"
                  value={editStageData.open_code}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Location Image</FormLabel>
                <Input
                  type="text"
                  name="location_image"
                  value={editStageData.location_image}
                  onChange={handleEditChange}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateStage}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StagesTab;
