// frontend/src/components/TeamRoutesTab.jsx
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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import API from '../../api';

const TeamRoutesTab = ({ config }) => {
  // State lưu trữ dữ liệu aggregated trả về từ endpoint GET /aggregate
  const [groupedRoutes, setGroupedRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State và modal cho chức năng chỉnh sửa aggregated team route
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingTeamRoute, setEditingTeamRoute] = useState(null);
  const [editRouteString, setEditRouteString] = useState("");

  // Gọi API để lấy danh sách team route đã được grouped từ backend
  const fetchAggregatedRoutes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/api/admin/team-routes/aggregate`, config);
      // Endpoint trả về dữ liệu dạng:
      // [
      //   { team_id: "1", routes: [ { team_route_id, team_id, stage_id, route_order, stage_name }, ... ] },
      //   { team_id: "2", routes: [ ... ] },
      //   ...
      // ]
      setGroupedRoutes(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching aggregated team routes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAggregatedRoutes();
  }, []);

  // Khi nhấn nút Edit cho 1 team, mở modal và chuyển các stage_id thành chuỗi (ví dụ "1, 2, 3")
  const handleEditClick = (teamAggregate) => {
    setEditingTeamRoute(teamAggregate);
    const routeStr = teamAggregate.routes.map((r) => r.stage_id).join(", ");
    setEditRouteString(routeStr);
    onOpen();
  };

  const handleEditChange = (e) => {
    setEditRouteString(e.target.value);
  };

  // Khi cập nhật, chuyển chuỗi nhập vào thành mảng số sau đó gọi API PUT aggregate endpoint
  const handleUpdateTeamRoute = async () => {
    const routeArray = editRouteString
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map(Number);
    try {
      // PUT /api/admin/team-routes/aggregate/:team_id với body { routes: routeArray }
      await axios.put(
        `${API}/api/admin/team-routes/aggregate/${editingTeamRoute.team_id}`,
        { routes: routeArray },
        config
      );
      fetchAggregatedRoutes();
      onClose();
    } catch (err) {
      console.error("Error updating aggregated team route:", err);
    }
  };

  const handleDeleteTeamRoute = async (team_id) => {
    try {
      // DELETE /api/admin/team-routes/aggregate/:team_id
      await axios.delete(`${API}/api/admin/team-routes/aggregate/${team_id}`, config);
      fetchAggregatedRoutes();
    } catch (err) {
      console.error("Error deleting aggregated team route:", err);
    }
  };

  return (
    <Box>
      <Heading size="md" mb={2}>Team Routes Management (Aggregated)</Heading>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Team ID</Th>
              <Th>Route</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {groupedRoutes.map((team) => (
              <Tr key={team.team_id}>
                <Td>{team.team_id}</Td>
                <Td>
                  {team.routes.map((r, index) => (
                    <span key={index}>
                      {r.stage_id} - ({r.stage_name})<br />
                    </span>
                  ))}
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    mr={2}
                    onClick={() => handleEditClick(team)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDeleteTeamRoute(team.team_id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Modal chỉnh sửa Aggregated Team Route */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Team Route</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Team ID</FormLabel>
              <Input type="text" value={editingTeamRoute ? editingTeamRoute.team_id : ""} readOnly />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Route (Comma separated Stage IDs)</FormLabel>
              <Input type="text" value={editRouteString} onChange={handleEditChange} />
            </FormControl>
            <Text mt={2} fontSize="sm" color="gray.500">
              (The stage names will be updated automatically based on your configuration.)
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateTeamRoute}>
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
