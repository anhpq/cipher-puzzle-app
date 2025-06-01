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
  Image,
  Text,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import API from '../../api';

const QuestionsTab = ({ config }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    stage_id: "",
    question_text: "",
    answer: ""
  });
  
  // State để lưu file cho hint1 và hint2 khi thêm mới
  const [newHint1, setNewHint1] = useState(null);
  const [newHint2, setNewHint2] = useState(null);

  // Modal chỉnh sửa câu hỏi
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editQuestionData, setEditQuestionData] = useState({
    stage_id: "",
    question_text: "",
    answer: ""
  });
  const [editHint1, setEditHint1] = useState(null);
  const [editHint2, setEditHint2] = useState(null);

  const toast = useToast();

  // Lấy danh sách câu hỏi từ backend
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/api/admin/questions`, config);
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

  const handleNewHint1Change = (e) => {
    setNewHint1(e.target.files[0]);
  };

  const handleNewHint2Change = (e) => {
    setNewHint2(e.target.files[0]);
  };

  // Thêm câu hỏi mới: sử dụng FormData để gửi kèm file upload
  const handleAddQuestion = async () => {
    try {
      const formData = new FormData();
      formData.append("stage_id", newQuestion.stage_id);
      formData.append("question_text", newQuestion.question_text);
      formData.append("answer", newQuestion.answer);
      if(newHint1) formData.append("hint1", newHint1);
      if(newHint2) formData.append("hint2", newHint2);
      
      const response = await axios.post(`${API}/api/admin/questions`, formData, {
        ...config,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setQuestions([...questions, response.data]);
      // Reset form
      setNewQuestion({ stage_id: "", question_text: "", answer: "" });
      setNewHint1(null);
      setNewHint2(null);
      toast({
        title: "Question added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error adding question:", err);
      toast({
        title: "Error adding question.",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Khi nhấn nút Edit, mở modal chỉnh sửa câu hỏi và set dữ liệu ban đầu
  const handleEditClick = (question) => {
    setEditingQuestion(question);
    setEditQuestionData({
      stage_id: question.stage_id,
      question_text: question.question_text,
      answer: question.answer,
    });
    setEditHint1(null);
    setEditHint2(null);
    onOpen();
  };

  const handleEditChange = (e) => {
    setEditQuestionData({ ...editQuestionData, [e.target.name]: e.target.value });
  };

  const handleEditHint1Change = (e) => {
    setEditHint1(e.target.files[0]);
  };

  const handleEditHint2Change = (e) => {
    setEditHint2(e.target.files[0]);
  };

  // Cập nhật câu hỏi từ modal sử dụng FormData để có thể gửi kèm file mới
  const handleUpdateQuestion = async () => {
    try {
      const formData = new FormData();
      formData.append("stage_id", editQuestionData.stage_id);
      formData.append("question_text", editQuestionData.question_text);
      formData.append("answer", editQuestionData.answer);
      // Nếu có file mới, append vào formData
      if(editHint1) formData.append("hint1", editHint1);
      if(editHint2) formData.append("hint2", editHint2);
      
      const response = await axios.put(
        `${API}/api/admin/questions/${editingQuestion.question_id}`,
        formData,
        { ...config, headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const updatedQuestions = questions.map(q =>
        q.question_id === editingQuestion.question_id ? response.data : q
      );
      setQuestions(updatedQuestions);
      toast({
        title: "Question updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      console.error("Error updating question:", err);
      toast({
        title: "Error updating question.",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Xoá câu hỏi
  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(`${API}/api/admin/questions/${questionId}`, config);
      setQuestions(questions.filter(q => q.question_id !== questionId));
      toast({
        title: "Question deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error deleting question:", err);
      toast({
        title: "Error deleting question.",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Heading size="md" mb={2}>Questions Management</Heading>
      {/* Form thêm mới câu hỏi */}
      <VStack spacing={3} mb={4}>
        <FormControl>
          <FormLabel>Stage ID</FormLabel>
          <Input 
            type="number" 
            name="stage_id" 
            value={newQuestion.stage_id} 
            onChange={handleNewQuestionChange} 
          />
        </FormControl>
        <FormControl>
          <FormLabel>Question Text</FormLabel>
          <Input 
            type="text" 
            name="question_text" 
            value={newQuestion.question_text} 
            onChange={handleNewQuestionChange} 
          />
        </FormControl>
        <FormControl>
          <FormLabel>Answer</FormLabel>
          <Input 
            type="text" 
            name="answer" 
            value={newQuestion.answer} 
            onChange={handleNewQuestionChange} 
          />
        </FormControl>
        <FormControl>
          <FormLabel>Hint 1 (Image)</FormLabel>
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleNewHint1Change} 
          />
        </FormControl>
        <FormControl>
          <FormLabel>Hint 2 (Image)</FormLabel>
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleNewHint2Change} 
          />
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
                <Td>
                  {q.hint1 ? (
                    <Image 
                      src={`data:image/png;base64,${q.hint1}`} 
                      alt="Hint1" 
                      boxSize="50px" 
                      objectFit="cover" 
                    />
                  ) : (
                    "No Image"
                  )}
                </Td>
                <Td>
                  {q.hint2 ? (
                    <Image 
                      src={`data:image/png;base64,${q.hint2}`} 
                      alt="Hint2" 
                      boxSize="50px" 
                      objectFit="cover" 
                    />
                  ) : (
                    "No Image"
                  )}
                </Td>
                <Td>
                  <Button 
                    size="sm" 
                    colorScheme="blue" 
                    mr={2} 
                    onClick={() => handleEditClick(q)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    colorScheme="red" 
                    onClick={() => handleDeleteQuestion(q.question_id)}
                  >
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
                <FormLabel>Hint 1 (Image)</FormLabel>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleEditHint1Change} 
                />
                {editingQuestion && editingQuestion.hint1 && !editHint1 && (
                  <Box mt={2}>
                    <Text fontSize="sm" color="gray.500">Current Hint 1:</Text>
                    <Image 
                      src={`data:image/png;base64,${editingQuestion.hint1}`} 
                      alt="Current Hint1" 
                      boxSize="50px" 
                      objectFit="cover" 
                    />
                  </Box>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Hint 2 (Image)</FormLabel>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleEditHint2Change} 
                />
                {editingQuestion && editingQuestion.hint2 && !editHint2 && (
                  <Box mt={2}>
                    <Text fontSize="sm" color="gray.500">Current Hint 2:</Text>
                    <Image 
                      src={`data:image/png;base64,${editingQuestion.hint2}`} 
                      alt="Current Hint2" 
                      boxSize="50px" 
                      objectFit="cover" 
                    />
                  </Box>
                )}
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
