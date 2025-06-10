// frontend/src/components/TeamTimeReportTab.jsx
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
  Spinner,
  Alert,
  AlertIcon,
  Text,
} from '@chakra-ui/react';
import API from '../../config/api';

// Hàm chuyển đổi số giây sang chuỗi HH:MM:SS
const formatSeconds = (seconds) => {
  if (!seconds) return "00:00:00";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const pad = (num) => (num < 10 ? '0' + num : num);
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
};

const TeamTimeReportTab = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/api/admin/reports/team-time`);
      setReports(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <Box>
      <Heading size="md" mb={4}>Team Time Report</Heading>
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
              <Th>Team Name</Th>
              <Th>Total Time Completed</Th>
              <Th>Stages Details</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reports.map((report) => (
              <Tr key={report.team_id}>
                <Td>{report.team_id}</Td>
                <Td>{report.team_name}</Td>
                <Td>{formatSeconds(report.total_duration_sec)}</Td>
                <Td>
                  {report.stages && report.stages.length > 0 ? (
                    report.stages.map((stage, idx) => (
                      <Text key={idx} fontSize="sm">
                        Stage {stage.stage_number} - {stage.stage_name}: {formatSeconds(stage.duration_sec)}
                      </Text>
                    ))
                  ) : (
                    <Text fontSize="sm">No completed stages</Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default TeamTimeReportTab;
