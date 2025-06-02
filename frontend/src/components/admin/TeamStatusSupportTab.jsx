// frontend/src/components/TeamStatusSupportTab.jsx
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
  Text
} from '@chakra-ui/react';
import axios from 'axios';
import API from '../../api';

const TeamStatusSupportTab = ({ config }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Hàm tải dữ liệu trạng thái team từ endpoint của backend
  const fetchTeamStatus = async () => {
    setLoading(true);
    try {
      // Giả sử endpoint trả về mảng đối tượng gồm: team_id, team_name, current_stage_id, stage_name
      const response = await API.get(`/api/admin/teams/status`, config);
      setTeams(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi khi tải dữ liệu trạng thái team");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamStatus();
  }, []);

  // Xử lý Refresh Stage
  const handleRefresh = async (team_id, current_stage_id) => {
    try {
      await API.put(
        `/api/admin/support/refresh`,
        { team_id, stage_id: current_stage_id },
        config
      );
      alert(`Team ${team_id} đã được refresh lại stage ${current_stage_id}.`);
      fetchTeamStatus();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi refresh stage");
    }
  };

  // Xử lý Advance Stage (chuyển sang stage tiếp theo)
  const handleAdvance = async (team_id, current_stage_id) => {
    try {
      await API.put(
        `/api/admin/support/advance`,
        { team_id, stage_id: current_stage_id },
        config
      );
      alert(`Team ${team_id} chuyển từ stage ${current_stage_id} sang stage tiếp theo thành công.`);
      fetchTeamStatus();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi chuyển stage");
    }
  };

  return (
    <Box>
      <Heading size="md" mb={4}>Team Status & Support</Heading>
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
              <Th>Team Name</Th>
              <Th>Stage (ID)</Th>
              <Th>Stage Name</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {teams.map((team) => (
              <Tr key={team.team_id}>
                <Td>{team.team_name}</Td>
                <Td>
                  <Text isTruncated>
                    {team.route_order} <Text as="span" fontSize="xx-small" color="gray.500">({team.current_stage_id})</Text>
                  </Text>
                </Td>
                <Td>{team.stage_name}</Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    mr={2}
                    onClick={() => handleRefresh(team.team_id, team.current_stage_id)}
                  >
                    Refresh Stage
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => handleAdvance(team.team_id, team.current_stage_id)}
                  >
                    Next Stage
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

export default TeamStatusSupportTab;
