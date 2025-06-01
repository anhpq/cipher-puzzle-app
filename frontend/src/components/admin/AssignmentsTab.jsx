// frontend/src/components/AssignmentsTab.jsx
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
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

const AssignmentsTab = ({ config }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editAssignmentData, setEditAssignmentData] = useState({
    team_id: "",
    stage_id: "",
    question_id: "",
    attempts: ""
  });
  
  const toast = useToast();

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/assignments', config);
      setAssignments(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleEditClick = (assignment) => {
    setEditingAssignment(assignment);
    setEditAssignmentData({
      team_id: assignment.team_id,
      stage_id: assignment.stage_id,
      question_id: assignment.question_id,
      attempts: assignment.attempts
    });
    onOpen();
  };

  const handleEditChange = (e) => {
    setEditAssignmentData({ ...editAssignmentData, [e.target.name]: e.target.value });
  };

  const handleUpdateAssignment = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/assignments/${editingAssignment.assignment_id}`,
        editAssignmentData,
        config
      );
      const updatedAssignments = assignments.map(a =>
        a.assignment_id === editingAssignment.assignment_id ? response.data : a
      );
      setAssignments(updatedAssignments);
      toast({
        title: "Assignment updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      console.error("Error updating assignment:", err);
      toast({
        title: "Error updating assignment.",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/assignments/${assignmentId}`, config);
      setAssignments(assignments.filter(a => a.assignment_id !== assignmentId));
      toast({
        title: "Assignment deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error deleting assignment:", err);
      toast({
        title: "Error deleting assignment.",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Heading size="md" mb={2}>Assignments Management</Heading>
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
              <Th>Team ID</Th>
              <Th>Stage ID</Th>
              <Th>Question ID</Th>
              <Th>Attempts</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {assignments.map((a) => (
              <Tr key={a.assignment_id}>
                <Td>{a.assignment_id}</Td>
                <Td>{a.team_id}</Td>
                <Td>{a.stage_id}</Td>
                <Td>{a.question_id}</Td>
                <Td>{a.attempts}</Td>
                <Td>
                  <Button size="sm" colorScheme="blue" mr={2} onClick={() => handleEditClick(a)}>
                    Edit
                  </Button>
                  <Button size="sm" colorScheme="red" onClick={() => handleDeleteAssignment(a.assignment_id)}>
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Modal chỉnh sửa assignment */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Assignment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <FormControl>
                <FormLabel>Team ID</FormLabel>
                <Input
                  type="number"
                  name="team_id"
                  value={editAssignmentData.team_id}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Stage ID</FormLabel>
                <Input
                  type="number"
                  name="stage_id"
                  value={editAssignmentData.stage_id}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Question ID</FormLabel>
                <Input
                  type="number"
                  name="question_id"
                  value={editAssignmentData.question_id}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Attempts</FormLabel>
                <Input
                  type="number"
                  name="attempts"
                  value={editAssignmentData.attempts}
                  onChange={handleEditChange}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateAssignment}>
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

export default AssignmentsTab;
