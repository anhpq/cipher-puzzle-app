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
  Image,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import API from '../../api';

const StagesTab = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // State cho form thêm mới stage
  const [newStage, setNewStage] = useState({
    stage_number: "",
    stage_name: "",
    description: "",
    open_code: "",
  });
  const [newLocationImage, setNewLocationImage] = useState(null);

  // State cho modal chỉnh sửa stage
  const [editingStage, setEditingStage] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [editingLocationImage, setEditingLocationImage] = useState(null);
  
  // Modal dùng để xác nhận xoá stage
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [stageToDelete, setStageToDelete] = useState(null);

  // Modal cho chỉnh sửa stage
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const toast = useToast();

  // API call lấy danh sách stages
  const fetchStages = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/api/admin/stages`);
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

  const handleLocationImageChange = (e) => {
    setNewLocationImage(e.target.files[0]);
  };

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
      const response = await API.post(`/api/admin/stages`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStages([...stages, response.data]);
      setNewStage({ stage_number: "", stage_name: "", description: "", open_code: "" });
      setNewLocationImage(null);
      toast({
        title: "Stage added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error adding stage:", err);
      toast({
        title: "Error adding stage.",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Khi ấn Edit, mở modal và set dữ liệu cần chỉnh sửa
  const handleEditClick = (stage) => {
    setEditingStage(stage);
    setEditingData({
      stage_number: stage.stage_number,
      stage_name: stage.stage_name,
      description: stage.description,
      open_code: stage.open_code,
    });
    setEditingLocationImage(null);
    onEditOpen();
  };

  // Xử lý thay đổi dữ liệu trong modal chỉnh sửa
  const handleEditingChange = (e) => {
    setEditingData({ ...editingData, [e.target.name]: e.target.value });
  };

  // Xử lý upload file mới trong modal chỉnh sửa
  const handleEditingImageChange = (e) => {
    setEditingLocationImage(e.target.files[0]);
  };

  // Save dữ liệu chỉnh sửa tại modal, sử dụng FormData để có upload file
  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("stage_number", editingData.stage_number);
      formData.append("stage_name", editingData.stage_name);
      formData.append("description", editingData.description);
      formData.append("open_code", editingData.open_code);
      if (editingLocationImage) {
        formData.append("location_image", editingLocationImage);
      }
      const response = await API.put(
        `/api/admin/stages/${editingStage.stage_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // Cập nhật lại danh sách stage
      setStages(stages.map((s) => (s.stage_id === editingStage.stage_id ? response.data : s)));
      toast({
        title: "Stage updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onEditClose();
      setEditingStage(null);
      setEditingData({});
      setEditingLocationImage(null);
    } catch (err) {
      console.error("Error updating stage:", err);
      toast({
        title: "Error updating stage.",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Mở modal để xác nhận xóa
  const handleDeleteClick = (stage) => {
    setStageToDelete(stage);
    onDeleteOpen();
  };

  const handleConfirmDelete = async () => {
    try {
      await API.delete(`/api/admin/stages/${stageToDelete.stage_id}`);
      setStages(stages.filter((s) => s.stage_id !== stageToDelete.stage_id));
      toast({
        title: "Stage deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
    } catch (err) {
      console.error("Error deleting stage:", err);
      toast({
        title: "Error deleting stage.",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
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
                    onClick={() => handleDeleteClick(stage)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Modal for editing stage */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Stage</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingStage && (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Stage Number</FormLabel>
                  <Input
                    type="number"
                    name="stage_number"
                    value={editingData.stage_number}
                    onChange={handleEditingChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Stage Name</FormLabel>
                  <Input
                    type="text"
                    name="stage_name"
                    value={editingData.stage_name}
                    onChange={handleEditingChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input
                    type="text"
                    name="description"
                    value={editingData.description}
                    onChange={handleEditingChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Open Code</FormLabel>
                  <Input
                    type="text"
                    name="open_code"
                    value={editingData.open_code}
                    onChange={handleEditingChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Location Image</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleEditingImageChange}
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSaveEdit}>
              Save
            </Button>
            <Button variant="ghost" onClick={onEditClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal confirm deletion */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete stage "{stageToDelete?.stage_name}"?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleConfirmDelete}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onDeleteClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StagesTab;
