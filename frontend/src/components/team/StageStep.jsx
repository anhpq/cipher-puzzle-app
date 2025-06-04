import React, { useState, useEffect } from "react";
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
  HStack,
} from "@chakra-ui/react";
import API from "../../api";
import { getStageName } from "../../utils/stageNames";

const StageStep = ({
  stage, // info about the current stage (for open code verification)
  teamId,
  isStageOne,
  onAdvance,
  initialVerified = false,
}) => {
  const HINT1_THRESHOLD = parseInt(import.meta.env.HINT_THRESHOLD);
  const HINT2_THRESHOLD = HINT1_THRESHOLD * 2;

  const [verified, setVerified] = useState(initialVerified);
  const [gameFinished, setGameFinished] = useState(false);
  const [nextStage, setNextStage] = useState(null);
  const [openCodeInput, setOpenCodeInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [hintData, setHintData] = useState({ hint1: null, hint2: null });
  const [hintTimers, setHintTimers] = useState({
    hint1: HINT1_THRESHOLD,
    hint2: HINT2_THRESHOLD,
  });
  const [hintEnabled, setHintEnabled] = useState({
    hint1: false,
    hint2: false,
  });
  const [totalTime, setTotalTime] = useState(null);

  const cardBg = useColorModeValue("gray.50", "gray.700");

  // Check if game is already finished when component mounts
  useEffect(() => {
    checkGameStatus();
  }, []);

  // When open code is verified for the current stage, fetch info about the next stage.
  useEffect(() => {
    if (verified) {
      fetchNextStage();
      fetchHint();
    }
  }, [verified]);

  useEffect(() => {
    if (verified) fetchHint();
    const interval = setInterval(() => {
      setHintTimers((prev) => {
        const updated = { ...prev };
        if (updated.hint1 > 0) updated.hint1--;
        if (updated.hint2 > 0) updated.hint2--;
        setHintEnabled({
          hint1: updated.hint1 === 0,
          hint2: updated.hint2 === 0,
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkGameStatus = async () => {
    try {
      // Check if all stages are completed by fetching current stages
      const response = await API.get(`/api/team-progress/current-stages`);
      const stages = response.data;
      
      // If all stages are completed, the game is finished
      const allCompleted = stages.every(stage => stage.completed === true);
      
      if (allCompleted) {
        setGameFinished(true);
        // Fetch total time
        try {
          const totalTimeResponse = await API.get(`/api/team-progress/total-time`);
          if (totalTimeResponse.data && totalTimeResponse.data.total_seconds != null) {
            const minutes = Math.floor(totalTimeResponse.data.total_seconds / 60);
            const seconds = totalTimeResponse.data.total_seconds % 60;
            setTotalTime(`${minutes}m ${seconds}s`);
          }
        } catch (error) {
          console.error("Error fetching total time:", error);
          setTotalTime(null);
        }
      }
    } catch (error) {
      console.error("Error checking game status:", error);
    }
  };

  const fetchNextStage = async () => {
    try {
      const response = await API.get(`/api/team-progress/next-stage`);
      if (response.data.success) {
        setNextStage(response.data.nextStage);
      } else {
        setNextStage(null);
      }
    } catch (err) {
      console.error("Error fetching next stage:", err);
    }
  };

  const fetchHint = async () => {
    try {
      const response = await API.get(`/api/team-progress/get-hint`);
      if (response.data.success) {
        const { elapsedSeconds, hint1, hint2 } = response.data.hint;
        setHintTimers({
          hint1: Math.max(HINT1_THRESHOLD - elapsedSeconds, 0),
          hint2: Math.max(HINT2_THRESHOLD - elapsedSeconds, 0),
        });
        setHintData({
          hint1: hint1 || null,
          hint2: hint2 || null,
        });
      } else {
        setSubmitMessage(response.data.message || "Hint not available yet.");
      }
    } catch (err) {
      setSubmitMessage("Error fetching hint.");
    }
  };

  const handleVerifyOpenCode = async () => {
    try {
      const response = await API.post(`/api/team-progress/verify-open-code`, {
        stage_id: stage.stageId,
        open_code: openCodeInput,
      });
      if (response.data.success) {
        setVerified(true);
        setSubmitMessage(
          "Open code verified! Now, please answer the question for the next stage."
        );
        if (isStageOne) {
          await API.put(`/api/team-progress/start-time`, {});
        }
      }
    } catch (error) {
      setSubmitMessage(
        error.response?.data?.message || "Invalid open code. Please try again."
      );
    }
  };

  const handleSubmitAnswer = async () => {
    try {
      const response = await API.post(`/api/team-progress/submit-answer`, {
        answer: answerInput,
      });
      if (response.data.success) {
        setSubmitMessage("Correct answer!");
        if (nextStage && nextStage.isFinal) {
          // If nextStage is final, then upon correct answer, finish the game.
          setSubmitMessage(
            "Correct answer! Congratulations, you have completed all stages!"
          );
          API.get(`/api/team-progress/total-time`)
            .then((res) => {
              if (res.data && res.data.total_seconds != null) {
                const minutes = Math.floor(res.data.total_seconds / 60);
                const seconds = res.data.total_seconds % 60;
                setTotalTime(`${minutes}m ${seconds}s`);
              }
            })
            .catch(() => setTotalTime(null));
          setGameFinished(true);
        } else {
          // Otherwise, advance normally.
          await API.put(`/api/team-progress/advance-stage`, {
            stage_id: stage.stageId,
          });
          setVerified(false);
          setNextStage(null);
          setOpenCodeInput("");
          setAnswerInput("");
          if (typeof onAdvance === "function") onAdvance();
        }
      }
    } catch (error) {
      setSubmitMessage(error.response?.data?.message || "Wrong answer.");
    }
  };

  // Render final congratulatory screen if the game is finished.
  if (gameFinished) {
    return (
      <Fade in>
        <Box
          p={6}
          bg={cardBg}
          borderRadius="lg"
          boxShadow="md"
          textAlign="center"
          mb={6}
        >
          <Heading size="lg" color="purple.600">
            {getStageName(stage.stageNumber)}
          </Heading>
          <VStack spacing={4}>
            <Alert status="success" borderRadius="md">
              <AlertIcon /> Congratulations! You completed all stages!
            </Alert>
            {totalTime && (
              <Text fontSize="xl" color="purple.700">
                Total time: {totalTime}
              </Text>
            )}
          </VStack>
        </Box>
      </Fade>
    );
  }

  // Decide what to show:
  // If not verified → show open code form for current stage.
  // If verified and nextStage exists → show form to submit answer for the next stage.
  // (Note: Even if nextStage.isFinal is true, the question form is shown so the team can answer; then upon correct answer, game finishes.)
  let content;
  if (!verified) {
    content = (
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
        {!isStageOne && (
          <Box mt={4}>
            <Text fontSize="large" mb={4} color="purple.600">
              Find the location
            </Text>
            <Image
              src={`data:image/png;base64,${stage.location_image}`}
              maxW="400px"
              mx="auto"
            />
          </Box>
        )}
      </VStack>
    );
  } else if (verified && nextStage) {
    content = (
      <VStack spacing={4}>
        <Text fontSize="md" fontWeight="semibold" color="blue.500">
          Question: {nextStage.question}
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
          <Button
            onClick={fetchHint}
            colorScheme="orange"
            isDisabled={!hintEnabled.hint1}
          >
            Hint 1 {hintTimers.hint1 > 0 ? `(${hintTimers.hint1}s)` : ""}
          </Button>
          <Button
            onClick={fetchHint}
            colorScheme="orange"
            isDisabled={!hintEnabled.hint2}
          >
            Hint 2 {hintTimers.hint2 > 0 ? `(${hintTimers.hint2}s)` : ""}
          </Button>
        </HStack>
        {(hintData.hint1 || hintData.hint2) && (
          <Box mt={4}>
            {hintData.hint1 && (
              <Box>
                <Text fontWeight="bold" mb={1}>
                  Hint 1:
                </Text>
                <Image
                  src={`data:image/png;base64,${hintData.hint1}`}
                  maxW="200px"
                  mx="auto"
                />
              </Box>
            )}
            {hintData.hint2 && (
              <Box mt={4}>
                <Text fontWeight="bold" mb={1}>
                  Hint 2:
                </Text>
                <Image
                  src={`data:image/png;base64,${hintData.hint2}`}
                  maxW="200px"
                  mx="auto"
                />
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
    );
  } else {
    content = <Text>Loading next stage question...</Text>;
  }

  return (
    <Fade in>
      <Box
        p={6}
        bg={cardBg}
        borderRadius="lg"
        boxShadow="md"
        textAlign="center"
        mb={6}
      >
        <Heading size="lg" mb={4} color="purple.600">
          Stage {stage.stageNumber}: {getStageName(stage.stageNumber)}
        </Heading>
        {content}
      </Box>
    </Fade>
  );
};

export default StageStep;