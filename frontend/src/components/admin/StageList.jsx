// frontend/src/components/StageList.jsx
import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Heading, Image } from '@chakra-ui/react';
import axios from 'axios';
import EditStageModal from './EditStageModal';

const StageList = ({ refreshTrigger }) => {
  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchStages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stages', { withCredentials: true });
      setStages(res.data);
    } catch (error) {
      console.error("Error fetching stages:", error);
    }
  };

  useEffect(() => {
    fetchStages();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/stages/${id}`, { withCredentials: true });
      fetchStages();
    } catch (error) {
      console.error("Error deleting stage:", error);
    }
  };

  const openEditModal = (stage) => {
    setSelectedStage(stage);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setSelectedStage(null);
    setIsEditOpen(false);
    fetchStages();
  };

  return (
    <Box mt={4}>
      <Heading size="md" mb={4}>Stages List</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
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
              <Td>{stage.stage_name}</Td>
              <Td>{stage.description}</Td>
              <Td>{stage.open_code}</Td>
              <Td>
                {stage.location_image ? (
                  <Image
                    src={`data:image/png;base64,${stage.location_image}`}
                    alt="Location"
                    boxSize="100px"
                  />
                ) : 'No Image'}
              </Td>
              <Td>
                <Button size="sm" colorScheme="blue" mr={2} onClick={() => openEditModal(stage)}>Edit</Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(stage.stage_id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {selectedStage && (
        <EditStageModal isOpen={isEditOpen} onClose={closeEditModal} stage={selectedStage} />
      )}
    </Box>
  );
};

export default StageList;
