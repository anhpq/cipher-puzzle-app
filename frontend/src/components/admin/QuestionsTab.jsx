// frontend/src/components/QuestionsTab.jsx
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

const QuestionsTab = ({ config }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    stage_id: "",
    question_text: "",
    answer: "",
    hint1: "",
    hint2: ""
  });

  // Modal cho chỉnh sửa câu hỏi
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editQuestionData, setEditQuestionData] = useState({
    stage_id: "",
    question_text: "",
    answer: "",
    hint1: "",
    hint2: ""
  });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/questions', config);
      setQuestions(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleNewQuestionChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  const handleAddQuestion = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/admin/questions', newQuestion, config);
      setQuestions([...questions, response.data]);
      setNewQuestion({
        stage_id: "",
        question_text: "",
        answer: "",
        hint1: "",
        hint2: ""
      });
    } catch (err) {
      console.error("Error adding question:", err);
    }
  };

  const handleEditClick = (question) => {
    setEditingQuestion(question);
    setEditQuestionData(question);
    onOpen();
  };

  const handleEditChange = (e) => {
    setEditQuestionData({ ...editQuestionData, [e.target.name]: e.target.value });
  };

  const handleUpdateQuestion = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/questions/${editingQuestion.question_id}`,
        editQuestionData,
        config
      );
      const updatedQuestions = questions.map(q =>
        q.question_id === editingQuestion.question_id ? response.data : q
      );
      setQuestions(updatedQuestions);
      onClose();
    } catch (err) {
      console.error("Error updating question:", err);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/questions/${questionId}`, config);
      setQuestions(questions.filter(q => q.question_id !== questionId));
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  return (
    <Box>
      <Heading size="md" mb={2}>Questions Management</Heading>
      {/* Form thêm mới câu hỏi */}
      <VStack spacing={3} mb={4}>
        <FormControl>
          <FormLabel>Stage ID</FormLabel>
          <Input type="number" name="stage_id" value={newQuestion.stage_id} onChange={handleNewQuestionChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Question Text</FormLabel>
          <Input type="text" name="question_text" value={newQuestion.question_text} onChange={handleNewQuestionChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Answer</FormLabel>
          <Input type="text" name="answer" value={newQuestion.answer} onChange={handleNewQuestionChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Hint 1</FormLabel>
          <Input type="text" name="hint1" value={newQuestion.hint1} onChange={handleNewQuestionChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Hint 2</FormLabel>
          <Input type="text" name="hint2" value={newQuestion.hint2} onChange={handleNewQuestionChange} />
        </FormControl>
        <Button colorScheme="blue" onClick={handleAddQuestion}>
          Add Question
        </Button>
      </VStack>

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
              <Th>Stage</Th>
              <Th>Question Text</Th>
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
                <Td>{q.stage_id} ({q.stage_name})</Td>
                <Td>{q.question_text}</Td>
                <Td>{q.answer}</Td>
                <Td>{q.hint1}</Td>
                <Td>{q.hint2}</Td>
                <Td>
                  <Button size="sm" colorScheme="blue" mr={2} onClick={() => handleEditClick(q)}>
                    Edit
                  </Button>
                  <Button size="sm" colorScheme="red" onClick={() => handleDeleteQuestion(q.question_id)}>
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Modal chỉnh sửa câu hỏi */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Question</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <FormControl>
                <FormLabel>Stage ID</FormLabel>
                <Input
                  type="number"
                  name="stage_id"
                  value={editQuestionData.stage_id}
                  onChange={handleEditChange}
                />
                {/* Bạn có thể hiển thị stage name được lấy từ backend nếu cần thông tin tham khảo */}
                {editQuestionData.stage_name && (
                  <Box fontSize="sm" color="gray.500" mt={1}>
                    Stage Name: {editQuestionData.stage_name}
                  </Box>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Question Text</FormLabel>
                <Input
                  type="text"
                  name="question_text"
                  value={editQuestionData.question_text}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Answer</FormLabel>
                <Input
                  type="text"
                  name="answer"
                  value={editQuestionData.answer}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Hint 1</FormLabel>
                <Input
                  type="text"
                  name="hint1"
                  value={editQuestionData.hint1}
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Hint 2</FormLabel>
                <Input
                  type="text"
                  name="hint2"
                  value={editQuestionData.hint2}
                  onChange={handleEditChange}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateQuestion}>
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

export default QuestionsTab;
