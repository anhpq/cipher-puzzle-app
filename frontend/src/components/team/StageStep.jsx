// StageStep.jsx (updated UI, hint logic, game completion)
import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  Text,
  VStack,
  Alert,
  AlertIcon,
  useColorModeValue,
  Fade,
  Image,
  HStack
} from '@chakra-ui/react';
import axios from 'axios';
import API from '../../api';

const StageStep = ({
  stage,
  teamId,
  isStageOne,
  onAdvance,
  config,
  initialVerified = false,
}) => {
  const [verified, setVerified] = useState(initialVerified);
  const [openCodeInput, setOpenCodeInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [hintCountdown, setHintCountdown] = useState(null);
  const [hintData, setHintData] = useState({ hint1: null, hint2: null });
  const [hintTimers, setHintTimers] = useState({ hint1: 360, hint2: 720 });
  const [hintEnabled, setHintEnabled] = useState({ hint1: false, hint2: false });
  const [totalTime, setTotalTime] = useState(null);

  const cardBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    fetchHintTimers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHintTimers(prevTimers => {
        const updated = { ...prevTimers };
        if (updated.hint1 > 0) updated.hint1--;
        if (updated.hint2 > 0) updated.hint2--;

        if (updated.hint1 === 0) {
          setHintEnabled(prev => ({ ...prev, hint1: true }));
        }
        if (updated.hint2 === 0) {
          setHintEnabled(prev => ({ ...prev, hint2: true }));
        }

        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchHintTimers = async () => {
    try {
      const response = await API.get(`/api/team-progress/get-hint`, {
        ...config,
        params: {
          stage_id: stage.stageId,
          question_id: stage.questionId
        }
      });
      if (response.data.success) {
        const elapsed = response.data.hint.elapsedSeconds || 0;
        setHintTimers({
          hint1: Math.max(360 - elapsed, 0),
          hint2: Math.max(720 - elapsed, 0),
        });
        setHintEnabled({
          hint1: elapsed >= 360,
          hint2: elapsed >= 720
        });
      }

    } catch (err) {
    }
  };

  const handleVerifyOpenCode = async () => {
    try {
      const response = await API.post(
        `/api/team-progress/verify-open-code`,
        {
          stage_id: stage.stageId,
          open_code: openCodeInput,
        },
        config
      );
      if (response.data.success) {
        setVerified(true);
        setSubmitMessage("Valid open code! Please enter your answer.");
        if (isStageOne && typeof onAdvance === "function") {
          await API.put(`/api/team-progress/start-time`, {}, config);
          if (typeof onAdvance === "function") onAdvance();
        }
      }
    } catch (error) {
      setSubmitMessage(error.response?.data?.message || "Invalid open code. Please try again.");
    }
  };

  const handleSubmitAnswer = async () => {
    try {
      const response = await API.post(
        `/api/team-progress/submit-answer`,
        {
          stage_id: stage.stageId,
          question_id: stage.questionId,
          answer: answerInput,
        },
        config
      );
      if (response.data.success) {
        await API.put(`/api/team-progress/advance-stage`, { stage_id: stage.stageId }, config);
        setSubmitMessage("Correct answer! Stage completed.");
        if (typeof onAdvance === "function") onAdvance();
      }
    } catch (error) {
      setSubmitMessage(error.response?.data?.message || "Wrong answer.");
    }
  };

  const fetchHint = async () => {
    try {
      const response = await API.get(`/api/team-progress/get-hint`, {
        ...config,
        params: {
          stage_id: stage.stageId,
          question_id: stage.questionId
        }
      });
      if (response.data.success) {
        const available = response.data.hint || {};
        setHintData({
          hint1: available.hint1 || false,
          hint2: available.hint2 || false
        });
      } else {
        setSubmitMessage(response.data.message || "Hint not available yet.");
      }
    } catch (err) {
      setSubmitMessage("Error fetching hint.");
    }
  };

  const isFinalStage = stage.stageNumber === 7;

  useEffect(() => {
    if (isFinalStage && verified) {
      API.get(`/api/team-progress/total-time`, config)
        .then(res => {
          if (res.data && res.data.total_seconds != null) {
            const minutes = Math.floor(res.data.total_seconds / 60);
            const seconds = res.data.total_seconds % 60;
            setTotalTime(`${minutes}m ${seconds}s`);
          }
        })
        .catch(() => setTotalTime(null));
    }
  }, [isFinalStage, verified]);

  return (
    <Fade in>
      <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="md" textAlign="center" mb={6}>
        <Heading size="lg" mb={4} color="purple.600">
          Stage {stage.stageNumber}
        </Heading>

        {/* <Text mb={4} fontSize="md" color="gray.600">
          {stage.description}
        </Text> */}

        {!verified ? (
          <VStack spacing={4}>
            <Input
              placeholder="Enter open code"
              value={openCodeInput}
              onChange={(e) => setOpenCodeInput(e.target.value)}
              size="md"
              variant="filled"
            />
            <Button onClick={handleVerifyOpenCode} colorScheme="teal">
              Confirm Open Code
            </Button>
            {submitMessage && (
              <Alert status="info" borderRadius="md">
                <AlertIcon /> {submitMessage}
              </Alert>
            )}
            <Box mt={4}>
              <Text fontSize="large" mb={4} color="purple.600">Find the location</Text>
              <Image src={`data:image/png;base64,${stage.location_image}`} maxW="400px" mx="auto" />
            </Box>
          </VStack>
        ) : isFinalStage ? (
          <Alert status="success" mt={4} borderRadius="md">
            <AlertIcon />
            🎉 Congratulations! You have completed all stages in {totalTime || '...'}.
            Please return to the gathering point.
          </Alert>
        ) : (
          <VStack spacing={4}>
            <Text fontSize="md" fontWeight="semibold" color="blue.500">
              Question: {stage.question}
            </Text>
            <Input
              placeholder="Enter your answer"
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              size="md"
              variant="filled"
            />
            <Button onClick={handleSubmitAnswer} colorScheme="green">
              Submit Answer
            </Button>
            <HStack spacing={4} justify="center">
              <Button onClick={() => fetchHint('hint1')} colorScheme="orange" isDisabled={!hintEnabled.hint1}>
                Hint 1 {hintTimers.hint1 > 0 ? `(${hintTimers.hint1}s)` : ""}
              </Button>
              <Button onClick={() => fetchHint('hint2')} colorScheme="orange" isDisabled={!hintEnabled.hint2}>
                Hint 2 {hintTimers.hint2 > 0 ? `(${hintTimers.hint2}s)` : ""}
              </Button>
            </HStack>
            {(hintData.hint1 || hintData.hint2) && (
              <Box mt={4}>
                {hintData.hint1 && (
                  <Box>
                    <Text fontWeight="bold" mb={1}>Hint 1:</Text>
                    <Image src={`data:image/png;base64,${hintData.hint1}`} maxW="200px" mx="auto" />
                  </Box>
                )}
                {hintData.hint2 && (
                  <Box mt={4}>
                    <Text fontWeight="bold" mb={1}>Hint 2:</Text>
                    <Image src={`data:image/png;base64,${hintData.hint2}`} maxW="200px" mx="auto" />
                  </Box>
                )}
              </Box>
            )}
            {submitMessage && (
              <Alert status="info" borderRadius="md">
                <AlertIcon /> {submitMessage}
              </Alert>
            )}
          </VStack>
        )}
      </Box>
    </Fade>
  );
};

export default StageStep;