// frontend/src/components/QuestionList.jsx
import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Heading, Image } from '@chakra-ui/react';
import axios from 'axios';
import EditQuestionModal from './EditQuestionModal';

const QuestionList = ({ refreshTrigger }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/questions', { withCredentials: true });
      setQuestions(res.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/questions/${id}`, { withCredentials: true });
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const openEditModal = (question) => {
    setSelectedQuestion(question);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setSelectedQuestion(null);
    setIsEditOpen(false);
    fetchQuestions();
  };

  return (
    <Box mt={4}>
      <Heading size="md" mb={4}>Questions List</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Stage</Th>
            <Th>Question</Th>
            <Th>Answer</Th>
            <Th>Hint 1</Th>
            <Th>Hint 2</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {questions.map((q) => (
            <Tr key={q.question_id}>
              <Td>{q.question_id}</Td>
              <Td>{q.stage_id}</Td>
              <Td>{q.question_text}</Td>
              <Td>{q.answer}</Td>
              <Td>
                {q.hint1 ? (
                  <Image src={`data:image/png;base64,${q.hint1}`} alt="Hint 1" boxSize="80px" />
                ) : 'No Hint'}
              </Td>
              <Td>
                {q.hint2 ? (
                  <Image src={`data:image/png;base64,${q.hint2}`} alt="Hint 2" boxSize="80px" />
                ) : 'No Hint'}
              </Td>
              <Td>
                <Button size="sm" colorScheme="blue" mr={2} onClick={() => openEditModal(q)}>Edit</Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(q.question_id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {selectedQuestion && (
        <EditQuestionModal isOpen={isEditOpen} onClose={closeEditModal} question={selectedQuestion} />
      )}
    </Box>
  );
};

export default QuestionList;
