// frontend/src/components/StageStep.jsx
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
} from '@chakra-ui/react';
import axios from 'axios';

const StageStep = ({
  stage,
  teamId,
  isStageOne,
  recordStartTime,
  onAdvance,
  wizardMethods,
  config,
  initialVerified = false,
}) => {
  // Use open_code_verified field from backend for initial state.
  const [verified, setVerified] = useState(initialVerified);
  const [openCodeInput, setOpenCodeInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [hintCountdown, setHintCountdown] = useState(null);
  const [waitingRemaining, setWaitingRemaining] = useState(0);

  // Timer for hint countdown (if provided by backend)
  useEffect(() => {
    let timer;
    if (hintCountdown > 0) {
      timer = setInterval(() => {
        setHintCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [hintCountdown]);

  const handleVerifyOpenCode = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/team/verify-open-code',
        {
          team_id: teamId,
          stage_id: stage.stageId,
          open_code: openCodeInput,
        },
        config
      );
      if (response.data.success) {
        setVerified(true);
        setSubmitMessage("Valid open code! Please enter your answer for the question.");
        if (isStageOne) {
          await axios.put(
            'http://localhost:5000/api/team/start-time',
            { team_id: teamId },
            config
          );
        }
      }
    } catch (error) {
      setSubmitMessage(error.response?.data?.message || "Invalid open code. Please try again.");
    }
  };

  const handleSubmitAnswer = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/team/submit-answer',
        {
          team_id: teamId,
          stage_id: stage.stageId,
          question_id: stage.questionId,
          answer: answerInput,
        },
        config
      );
      if (response.data.success) {
        setSubmitMessage("Correct answer! Stage completed.");
        setHintCountdown(null);
        wizardMethods.nextStep();
        onAdvance();
      }
    } catch (error) {
      const data = error.response?.data;
      if (data.hintCountdown !== undefined) {
        setHintCountdown(data.hintCountdown);
      }
      if (data.message) {
        setSubmitMessage(data.message);
      } else {
        setSubmitMessage("Wrong answer. Please try again later.");
      }
    }
  };

  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>
        Stage {stage.stageNumber} - {stage.stageName}
      </Heading>
      <Text mb={4}>{stage.description}</Text>
      {/* Show open code input if not verified */}
      {!verified ? (
        <VStack spacing={4}>
          <Text>Enter the open code to start:</Text>
          <Input
            placeholder="Enter open code"
            value={openCodeInput}
            onChange={(e) => setOpenCodeInput(e.target.value)}
          />
          <Button onClick={handleVerifyOpenCode} colorScheme="blue">
            Confirm open code
          </Button>
          {submitMessage && (
            <Alert status={submitMessage.includes("Invalid") ? "error" : "success"}>
              <AlertIcon />
              {submitMessage}
            </Alert>
          )}
        </VStack>
      ) : (
        <VStack spacing={4}>
          <Text mb={4}>Question: {stage.question}</Text>
          <Input
            placeholder="Enter your answer"
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
          />
          <Button onClick={handleSubmitAnswer} colorScheme="green">
            Submit Answer
          </Button>
          {waitingRemaining > 0 && (
            <Text>Please wait {waitingRemaining} seconds before trying again.</Text>
          )}
          {hintCountdown > 0 && (
            <Alert status="info">
              <AlertIcon />
              Hint will be displayed in {hintCountdown} seconds.
            </Alert>
          )}
          {submitMessage && (
            <Alert status={submitMessage.includes("Wrong") || submitMessage.includes("Error") ? "error" : "success"}>
              <AlertIcon />
              {submitMessage}
            </Alert>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default StageStep;
