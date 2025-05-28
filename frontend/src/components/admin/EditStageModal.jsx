// frontend/src/components/EditStageModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, Button, FormControl, FormLabel, Input, Stack, useToast,
} from '@chakra-ui/react';
import axios from 'axios';

const EditStageModal = ({ isOpen, onClose, stage }) => {
  const [stageName, setStageName] = useState('');
  const [description, setDescription] = useState('');
  const [openCode, setOpenCode] = useState('');
  const [locationImage, setLocationImage] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (stage) {
      setStageName(stage.stage_name);
      setDescription(stage.description);
      setOpenCode(stage.open_code);
      setLocationImage(stage.location_image); // Base64 value
    }
  }, [stage]);

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setLocationImage(base64);
      } catch (error) {
        console.error("Error converting image:", error);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        stage_name: stageName,
        description,
        open_code: openCode,
        location_image: locationImage
      };
      await axios.put(`http://localhost:5000/api/admin/stages/${stage.stage_id}`, payload, { withCredentials: true });
      toast({
        title: 'Stage updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error("Error updating stage:", error);
      toast({
        title: 'Error updating stage',
        description: error.response?.data?.message || 'Operation failed.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Stage</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <FormControl isRequired>
              <FormLabel>Stage Name</FormLabel>
              <Input value={stageName} onChange={(e) => setStageName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Open Code</FormLabel>
              <Input value={openCode} onChange={(e) => setOpenCode(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Location Image</FormLabel>
              <Input type="file" onChange={handleImageChange} />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleUpdate}>Update</Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditStageModal;
