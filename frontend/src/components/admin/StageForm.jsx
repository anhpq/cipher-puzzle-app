// frontend/src/components/StageForm.jsx
import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, Heading } from '@chakra-ui/react';
import axios from 'axios';

const StageForm = ({ refreshStages }) => {
  const [stageName, setStageName] = useState('');
  const [description, setDescription] = useState('');
  const [openCode, setOpenCode] = useState('');
  const [locationImage, setLocationImage] = useState('');

  // Converts a file to a Base64 string (without the data URL prefix)
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
      } catch (err) {
        console.error("Error converting image:", err);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = { 
        stage_name: stageName,
        description,
        open_code: openCode,
        location_image: locationImage,
      };
      await axios.post('http://localhost:5000/api/admin/stages', payload, { withCredentials: true });
      // Clear fields
      setStageName('');
      setDescription('');
      setOpenCode('');
      setLocationImage('');
      refreshStages();
    } catch (error) {
      console.error("Error creating stage: ", error);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" mb={4}>
      <Heading size="md" mb={4}>Add New Stage</Heading>
      <FormControl mb={3} isRequired>
        <FormLabel>Stage Name</FormLabel>
        <Input value={stageName} onChange={(e) => setStageName(e.target.value)} placeholder="Stage name" />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Description</FormLabel>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      </FormControl>
      <FormControl mb={3} isRequired>
        <FormLabel>Open Code</FormLabel>
        <Input value={openCode} onChange={(e) => setOpenCode(e.target.value)} placeholder="Enter open code" />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Location Image</FormLabel>
        <Input type="file" onChange={handleImageChange} />
      </FormControl>
      <Button colorScheme="teal" onClick={handleSubmit}>Create Stage</Button>
    </Box>
  );
};

export default StageForm;
