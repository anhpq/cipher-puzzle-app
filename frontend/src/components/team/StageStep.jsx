// StageStep.jsx - Refactored with separate components
import React, { useState, useEffect } from "react";
import {
  Container,
  VStack,
  Alert,
  AlertIcon,
  Text,
  Fade,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

// Import separate components
import StageHeader from "./stage/StageHeader";
import LocationDisplay from "./stage/LocationDisplay";
import CodeInput from "./stage/CodeInput";
import QuestionDisplay from "./stage/QuestionDisplay";
import HintSystem from "./stage/HintSystem";
import VictoryScreen from "./stage/VictoryScreen";
import LoadingState from "./stage/LoadingState";
import { useTeamTheme } from "../../utils/TeamThemeContext";
import API from "../../config/api";

const StageStep = ({
  stage,
  teamId,
  isStageOne,
  onAdvance,
  initialVerified = false,
}) => {
  const HINT1_THRESHOLD = parseInt(import.meta.env.VITE_HINT_THRESHOLD);
  const HINT2_THRESHOLD = HINT1_THRESHOLD * 2;

  const { colors, gradients, shadows, borders } = useTeamTheme();

  // State management
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Loading states
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");

  // Effects
  useEffect(() => {
    checkGameStatus();
  }, []);

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

  // API Functions
  const checkGameStatus = async () => {
    try {
      const response = await API.get(`/api/team-progress/current-stages`);
      const stages = response.data;

      const allCompleted = stages.every((stage) => stage.completed === true);

      if (allCompleted) {
        setGameFinished(true);

        try {
          const totalTimeResponse = await API.get(
            `/api/team-progress/total-time`
          );
          if (
            totalTimeResponse.data &&
            totalTimeResponse.data.total_seconds != null
          ) {
            const minutes = Math.floor(
              totalTimeResponse.data.total_seconds / 60
            );
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
    if (isLoadingHint) return;

    setIsLoadingHint(true);
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
        setSubmitMessage("");
      } else {
        setSubmitMessage(response.data.message || "Hint not available yet.");
      }
    } catch (err) {
      setSubmitMessage("Error fetching hint.");
    } finally {
      setIsLoadingHint(false);
    }
  };

  // Event Handlers
  const handleVerifyOpenCode = async () => {
    if (isSubmittingCode || !openCodeInput.trim()) return;

    setIsSubmittingCode(true);
    setSubmitMessage("");

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
    } finally {
      setIsSubmittingCode(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (isSubmittingAnswer || !answerInput.trim()) return;

    setIsSubmittingAnswer(true);
    setSubmitMessage("");

    try {
      const response = await API.post(`/api/team-progress/submit-answer`, {
        answer: answerInput,
      });
      if (response.data.success) {
        setSubmitMessage("Correct answer!");

        if (nextStage && nextStage.isFinal) {
          setSubmitMessage(
            "Awesome job! You've completed all stages. Please head back to the starting area."
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
          setIsTransitioning(true);

          await API.put(`/api/team-progress/advance-stage`, {
            stage_id: stage.stageId,
          });

          setSubmitMessage("");
          setVerified(false);
          setNextStage(null);
          setOpenCodeInput("");
          setAnswerInput("");

          if (typeof onAdvance === "function") {
            await onAdvance();
          }

          setTimeout(() => {
            setIsTransitioning(false);
          }, 100);
        }
      }
    } catch (error) {
      setSubmitMessage(error.response?.data?.message || "Wrong answer.");
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleCodeInputChange = (e) => {
    setOpenCodeInput(e.target.value);
  };

  const handleAnswerInputChange = (e) => {
    setAnswerInput(e.target.value);
  };

  // Render Logic
  if (isTransitioning) {
    return <LoadingState message="Loading next stage..." />;
  }

  if (gameFinished) {
    return <VictoryScreen stage={stage} totalTime={totalTime} />;
  }

  const renderMainContent = () => {
    if (!verified) {
      return (
        <VStack spacing={6} w="100%">
          {!isStageOne && stage.location_image && (
            <LocationDisplay
              locationImage={stage.location_image}
              description={stage.description}
            />
          )}

          <CodeInput
            value={openCodeInput}
            onChange={handleCodeInputChange}
            onSubmit={handleVerifyOpenCode}
            isLoading={isSubmittingCode}
          />

          {submitMessage && (
            <Alert
              status={
                submitMessage.includes("verified") ||
                submitMessage.includes("Correct")
                  ? "success"
                  : "error"
              }
              borderRadius="lg"
              boxShadow="md"
              w="100%"
            >
              <AlertIcon />
              <Text fontWeight="medium">{submitMessage}</Text>
            </Alert>
          )}
        </VStack>
      );
    }

    if (verified && nextStage) {
      return (
        <VStack spacing={6} w="100%">
          <QuestionDisplay
            question={nextStage.question}
            answer={answerInput}
            onAnswerChange={handleAnswerInputChange}
            onSubmit={handleSubmitAnswer}
            isLoading={isSubmittingAnswer}
          />

          {submitMessage && (
            <Alert
              status={
                submitMessage.includes("verified") ||
                submitMessage.includes("Correct")
                  ? "success"
                  : "error"
              }
              borderRadius="lg"
              boxShadow="md"
              w="100%"
            >
              <AlertIcon />
              <Text fontWeight="medium">{submitMessage}</Text>
            </Alert>
          )}

          <HintSystem
            hintData={hintData}
            hintTimers={hintTimers}
            hintEnabled={hintEnabled}
            onFetchHint={fetchHint}
            isLoadingHint={isLoadingHint}
          />
        </VStack>
      );
    }

    return <LoadingState message="Loading next stage question..." />;
  };

  return (
    <Fade in>
      <Container maxW="6xl" py={0} px={0} centerContent>
        <VStack
          spacing={8}
          bg={gradients.secondary}
          borderRadius="2xl"
          boxShadow={shadows.strong}
          p={8}
          border="2px solid"
          borderColor={colors.rgba.primary(0.3)}
          w="100%"
        >
          <StageHeader stage={stage} />
          {renderMainContent()}
        </VStack>
      </Container>
    </Fade>
  );
};

export default StageStep;
