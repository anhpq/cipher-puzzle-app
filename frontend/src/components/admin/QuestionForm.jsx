// frontend/src/components/QuestionForm.jsx
import React, { useState, useEffect } from 'react';
import { Box, FormControl, FormLabel, Input, Button, Select, Heading, Stack } from '@chakra-ui/react';
import axios from 'axios';

const QuestionForm = ({ refreshQuestions }) => {
  const [stageId, setStageId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answer, setAnswer] = useState('');
  const [hint1, setHint1] = useState('');
  const [hint2, setHint2] = useState('');
  const [stages, setStages] = useState([]);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/stages', { withCredentials: true });
        setStages(res.data);
      } catch (err) {
        console.error("Error fetching stages for questions:", err);
      }
    };
    fetchStages();
  }, []);

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleHint1Change = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setHint1(base64);
      } catch (error) {
        console.error("Error converting hint1 file:", error);
      }
    }
  };

  const handleHint2Change = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setHint2(base64);
      } catch (error) {
        console.error("Error converting hint2 file:", error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        stage_id: stageId,
        question_text: questionText,
        answer: answer,
        hint1: hint1,
        hint2: hint2
      };
      await axios.post('http://localhost:5000/api/admin/questions', payload, { withCredentials: true });
      // Clear fields
      setStageId('');
      setQuestionText('');
      setAnswer('');
      setHint1('');
      setHint2('');
      refreshQuestions();
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" mb={4}>
      <Heading size="md" mb={3}>Add New Question</Heading>
      <Stack spacing={3}>
        <FormControl isRequired>
          <FormLabel>Stage</FormLabel>
          <Select placeholder="Select stage" value={stageId} onChange={(e) => setStageId(e.target.value)}>
            {stages.map((stage) => (
              <option key={stage.stage_id} value={stage.stage_id}>
                {stage.stage_name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Question Text</FormLabel>
          <Input value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Enter question" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Answer</FormLabel>
          <Input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Enter answer" />
        </FormControl>
        <FormControl>
          <FormLabel>Hint Image 1</FormLabel>
          <Input type="file" onChange={handleHint1Change} />
        </FormControl>
        <FormControl>
          <FormLabel>Hint Image 2</FormLabel>
          <Input type="file" onChange={handleHint2Change} />
        </FormControl>
        <Button colorScheme="teal" onClick={handleSubmit}>Create Question</Button>
      </Stack>
    </Box>
  );
};

export default QuestionForm;
