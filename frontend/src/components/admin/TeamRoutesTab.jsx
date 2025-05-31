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

const TeamRoutesTab = ({ config }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal cho chỉnh sửa team route
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingRoute, setEditingRoute] = useState(null);
  const [editRouteData, setEditRouteData] = useState({
    team_id: "",
    stage_id: "",
    route_order: ""
  });

  const fetchTeamRoutes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/team-routes', config);
      setRoutes(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching team routes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamRoutes();
  }, []);

  const handleEditClick = (route) => {
    setEditingRoute(route);
    setEditRouteData(route);
    onOpen();
  };

  const handleEditChange = (e) => {
    setEditRouteData({ ...editRouteData, [e.target.name]: e.target.value });
  };

  const handleUpdateRoute = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/team-routes/${editingRoute.team_route_id}`,
        editRouteData,
        config
      );
      const updatedRoutes = routes.map(r =>
        r.team_route_id === editingRoute.team_route_id ? response.data : r
      );
      setRoutes(updatedRoutes);
      onClose();
    } catch (err) {
      console.error("Error updating team route:", err);
    }
  };

  const handleDeleteRoute = async (routeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/team-routes/${routeId}`, config);
      setRoutes(routes.filter(r => r.team_route_id !== routeId));
    } catch (err) {
      console.error("Error deleting team route:", err);
    }
  };

  return (
    <Box>
      <Heading size="md" mb={2}>Team Routes Management</Heading>
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
              <Th>Route Order</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {routes.map((r) => (
              <Tr key={r.team_route_id}>
                <Td>{r.team_route_id}</Td>
                <Td>{r.team_id}</Td>
                <Td>{r.stage_id}</Td>
                <Td>{r.route_order}</Td>
                <Td>
                  <Button size="sm" colorScheme="blue" mr={2} onClick={() => handleEditClick(r)}>
                    Edit
                  </Button>
                  <Button size="sm" colorScheme="red" onClick={() => handleDeleteRoute(r.team_route_id)}>
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Modal chỉnh sửa Team Route */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Team Route</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <FormControl>
                <FormLabel>Team ID</FormLabel>
                <Input
                  type="number"
                  name="team_id"
                  value={editRouteData.team_id}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Stage ID</FormLabel>
                <Input
                  type="number"
                  name="stage_id"
                  value={editRouteData.stage_id}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Route Order</FormLabel>
                <Input
                  type="number"
                  name="route_order"
                  value={editRouteData.route_order}
                  onChange={handleEditChange}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateRoute}>
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

export default TeamRoutesTab;
