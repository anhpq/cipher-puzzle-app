// frontend/src/components/EditQuestionModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, Button, FormControl, FormLabel, Input, Stack
} from '@chakra-ui/react';
import axios from 'axios';

const EditQuestionModal = ({ isOpen, onClose, question, fetchQuestions }) => {
  const [stageId, setStageId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answer, setAnswer] = useState('');
  const [hint, setHint] = useState('');

  useEffect(() => {
    if (question) {
      setStageId(question.stage_id);
      setQuestionText(question.question_text);
      setAnswer(question.answer);
      setHint(question.hint || '');
    }
  }, [question]);

  const handleHintChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setHint(reader.result.split(',')[1]);
      };
      reader.onerror = (error) => console.error("Error reading hint file: ", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/questions/${question.question_id}`,
        { stage_id: stageId, question_text: questionText, answer, hint },
        { withCredentials: true }
      );
      fetchQuestions();
      onClose();
    } catch (err) {
      console.error("Error updating question", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Question</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <FormControl isRequired>
              <FormLabel>Stage ID</FormLabel>
              <Input value={stageId} onChange={e => setStageId(e.target.value)} type="number" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Question Text</FormLabel>
              <Input value={questionText} onChange={e => setQuestionText(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Answer</FormLabel>
              <Input value={answer} onChange={e => setAnswer(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Hint Image</FormLabel>
              <Input type="file" onChange={handleHintChange} />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleUpdate} mr={3}>Update</Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditQuestionModal;
