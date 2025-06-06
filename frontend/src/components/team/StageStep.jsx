// StageStep.jsx - Updated with Team Theme
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
  Container,
  Badge,
  Flex,
  Icon,
  Divider,
  ScaleFade,
  Spinner,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
  FaLock,
  FaUnlock,
  FaLocationDot,
  FaQuestion,
  FaTrophy,
  FaStar,
  FaGem,
} from "react-icons/fa6";
import { CheckCircleIcon, TimeIcon } from "@chakra-ui/icons";
import API from "../../api";
import { getStageName } from "../../utils/stageNames";
import TeamBadge from "./TeamBadge";
import { useTeamTheme } from "../../utils/TeamThemeContext";

// Animation keyframes
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
`;

const celebration = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(5deg); }
  50% { transform: scale(1.2) rotate(-5deg); }
  75% { transform: scale(1.1) rotate(3deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

const StageStep = ({
  stage,
  teamId,
  isStageOne,
  onAdvance,
  initialVerified = false,
}) => {
  const HINT1_THRESHOLD = parseInt(import.meta.env.VITE_HINT_THRESHOLD);
  const HINT2_THRESHOLD = HINT1_THRESHOLD * 2;

  // Team theme
  const { colors, gradients, shadows, borders } = useTeamTheme();

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

  // Add loading states for each button to prevent disabled state
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  // Enhanced color scheme with team colors
  const cardBg = useColorModeValue("white", "gray.800");
  const gradientBg = useColorModeValue(
    gradients.secondary,
    `linear-gradient(to-br, ${colors.rgba.primary(0.1)}, ${colors.rgba.primary(
      0.05
    )})`
  );
  const borderColor = useColorModeValue(
    colors.rgba.primary(0.3),
    colors.rgba.primary(0.6)
  );
  const textColor = useColorModeValue("gray.700", "gray.200");
  const accentColor = useColorModeValue(colors.primary, colors.light);

  // [Keep all the existing useEffect and handler functions unchanged]
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

  // Show loading state during transition
  if (isTransitioning) {
    return (
      <Container maxW="4xl" py={6}>
        <Box
          bg={gradientBg}
          borderRadius="2xl"
          boxShadow={shadows.medium}
          p={8}
          border={borders.primary}
          textAlign="center"
        >
          <VStack spacing={6}>
            <Spinner size="xl" color={colors.primary} thickness="4px" />
            <Text fontSize="lg" color={textColor}>
              Loading next stage...
            </Text>
          </VStack>
        </Box>
      </Container>
    );
  }

  // Enhanced final congratulatory screen
  if (gameFinished) {
    return (
      <ScaleFade in>
        <Container maxW="4xl" py={8}>
          <Box
            bg={gradientBg}
            borderRadius="3xl"
            boxShadow={shadows.strong}
            p={12}
            textAlign="center"
            position="relative"
            overflow="hidden"
            border="3px solid"
            borderColor="gold"
            _before={{
              content: '""',
              position: "absolute",
              top: "-3px",
              left: "-3px",
              right: "-3px",
              bottom: "-3px",
              borderRadius: "3xl",
              background: gradients.accent,
              zIndex: -1,
            }}
          >
            {/* Team-colored decorative elements */}
            <Box
              position="absolute"
              top="-20px"
              left="-20px"
              w="40px"
              h="40px"
              borderRadius="full"
              bg={colors.primary}
              animation={`${sparkle} 2s infinite`}
              opacity={0.7}
            />
            <Box
              position="absolute"
              top="20px"
              right="30px"
              w="30px"
              h="30px"
              borderRadius="full"
              bg={colors.light}
              animation={`${sparkle} 2s infinite 0.5s`}
              opacity={0.7}
            />
            <Box
              position="absolute"
              bottom="30px"
              left="40px"
              w="35px"
              h="35px"
              borderRadius="full"
              bg={colors.primary}
              animation={`${sparkle} 2s infinite 1s`}
              opacity={0.7}
            />

            <VStack spacing={8}>
              <Box animation={`${celebration} 3s infinite`}>
                <Icon
                  as={FaTrophy}
                  boxSize="80px"
                  color="gold"
                  filter="drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))"
                />
              </Box>

              <VStack spacing={4}>
                <TeamBadge variant="gradient" size="lg" showIcon />

                <Heading
                  size="2xl"
                  bgGradient={`linear(to-r, gold, ${colors.primary}, orange.400)`}
                  bgClip="text"
                  fontWeight="black"
                  textShadow="2px 2px 4px rgba(0,0,0,0.3)"
                >
                  🎉 VICTORY ACHIEVED! 🎉
                </Heading>

                <Text
                  fontSize="xl"
                  color={textColor}
                  fontWeight="semibold"
                  maxW="600px"
                  lineHeight="tall"
                >
                  You've conquered every challenge and unlocked every secret...
                  Now, return to the place where your journey first began.
                </Text>
              </VStack>

              <Box
                bg={cardBg}
                borderRadius="xl"
                p={6}
                boxShadow={shadows.medium}
                border={borders.primary}
              >
                <HStack justify="center" spacing={6}>
                  <VStack>
                    <Icon as={FaGem} boxSize="30px" color={colors.primary} />
                    <Text fontSize="lg" fontWeight="bold" color={accentColor}>
                      Stage Completed
                    </Text>
                    <Badge
                      bg={colors.primary}
                      color="white"
                      fontSize="md"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {getStageName(stage.stageNumber)}
                    </Badge>
                  </VStack>

                  {false && totalTime && (
                    <>
                      <Divider orientation="vertical" h="80px" />
                      <VStack>
                        <Icon
                          as={TimeIcon}
                          boxSize="30px"
                          color={colors.primary}
                        />
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                          color={accentColor}
                        >
                          Total Time
                        </Text>
                        <Badge
                          bg={colors.primary}
                          color="white"
                          fontSize="lg"
                          px={4}
                          py={2}
                          borderRadius="full"
                        >
                          {totalTime}
                        </Badge>
                      </VStack>
                    </>
                  )}
                </HStack>
              </Box>

              <Flex wrap="wrap" justify="center" gap={2}>
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    as={FaStar}
                    color={colors.primary}
                    boxSize="20px"
                    animation={`${float} 2s infinite ${i * 0.2}s`}
                  />
                ))}
              </Flex>
            </VStack>
          </Box>
        </Container>
      </ScaleFade>
    );
  }

  // Enhanced main content
  let content;
  if (!verified) {
    content = (
      <VStack spacing={6}>
        {!isStageOne && stage.location_image && (
          <Box
            bg={cardBg}
            borderRadius="xl"
            p={6}
            boxShadow="lg"
            border="2px solid"
            borderColor={borderColor}
            w="100%"
          >
            <VStack spacing={4}>
              <HStack spacing={3}>
                <Icon as={FaLocationDot} color="blue.500" boxSize="24px" />
                <Text fontSize="lg" fontWeight="semibold" color={accentColor}>
                  Find This Location
                </Text>
              </HStack>

              <Box
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                border="2px solid"
                borderColor={useColorModeValue("gray.200", "gray.600")}
              >
                <Image
                  src={`data:image/png;base64,${stage.location_image}`}
                  maxW="400px"
                  w="100%"
                />
              </Box>
            </VStack>
          </Box>
        )}
        <Box
          bg={cardBg}
          borderRadius="xl"
          p={6}
          boxShadow="lg"
          border="2px solid"
          borderColor={borderColor}
          w="100%"
        >
          <VStack spacing={4}>
            <HStack spacing={3}>
              <Icon as={FaLock} color="red.500" boxSize="24px" />
              <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                Enter Completion Code
              </Text>
            </HStack>
            <HStack spacing={1}>
              <Text fontSize="xs" fontWeight="semibold" color={textColor}>
                Complete all the games in this stage,
                <br />
                then ask the Station Chief for the code.
              </Text>
            </HStack>

            <Input
              placeholder="Enter the code to complete this stage"
              value={openCodeInput}
              onChange={(e) => setOpenCodeInput(e.target.value)}
              size="lg"
              variant="filled"
              bg={useColorModeValue("gray.50", "gray.700")}
              borderRadius="lg"
              disabled={isSubmittingCode}
              _focus={{
                bg: useColorModeValue("white", "gray.600"),
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px #9F7AEA",
              }}
            />

            <Button
              onClick={handleVerifyOpenCode}
              colorScheme="blue"
              size="lg"
              borderRadius="lg"
              leftIcon={<FaUnlock />}
              isLoading={isSubmittingCode}
              loadingText="Verifying..."
              isDisabled={!openCodeInput.trim()}
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              _disabled={{ transform: "none", boxShadow: "none" }}
              transition="all 0.2s"
            >
              Unlock Next Stage
            </Button>
          </VStack>
        </Box>

        {submitMessage && (
          <Alert
            status={submitMessage.includes("verified") ? "success" : "error"}
            borderRadius="lg"
            boxShadow="md"
          >
            <AlertIcon />
            <Text fontWeight="medium">{submitMessage}</Text>
          </Alert>
        )}
      </VStack>
    );
  } else if (verified && nextStage) {
    content = (
      <VStack spacing={6}>
        <Box
          bg={cardBg}
          borderRadius="xl"
          p={6}
          boxShadow="lg"
          border="2px solid"
          borderColor="green.200"
          w="100%"
        >
          <VStack spacing={4}>
            <HStack spacing={3}>
              <Icon as={FaQuestion} color="green.500" boxSize="24px" />
              <Text fontSize="lg" fontWeight="semibold" color="green.600">
                Challenge Question
              </Text>
            </HStack>

            <Text
              fontSize="md"
              fontWeight="medium"
              color={textColor}
              textAlign="center"
              bg={useColorModeValue("green.50", "green.900")}
              p={4}
              borderRadius="lg"
              border="1px solid"
              borderColor="green.200"
            >
              {nextStage.question}
            </Text>

            <Input
              placeholder="Enter your answer here"
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              size="lg"
              variant="filled"
              bg={useColorModeValue("gray.50", "gray.700")}
              borderRadius="lg"
              disabled={isSubmittingAnswer}
              _focus={{
                bg: useColorModeValue("white", "gray.600"),
                borderColor: "green.400",
                boxShadow: "0 0 0 1px #48BB78",
              }}
            />

            <Button
              onClick={handleSubmitAnswer}
              colorScheme="green"
              size="lg"
              borderRadius="lg"
              leftIcon={<CheckCircleIcon />}
              isLoading={isSubmittingAnswer}
              loadingText="Submitting..."
              isDisabled={!answerInput.trim()}
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              _disabled={{ transform: "none", boxShadow: "none" }}
              transition="all 0.2s"
            >
              Submit Answer
            </Button>
          </VStack>
        </Box>

        <HStack spacing={4} justify="center">
          <Button
            onClick={fetchHint}
            colorScheme="orange"
            isDisabled={!hintEnabled.hint1}
            isLoading={isLoadingHint}
            size="md"
            borderRadius="lg"
            _hover={{ transform: "translateY(-2px)" }}
            _disabled={{ transform: "none" }}
            transition="all 0.2s"
          >
            💡 Hint 1 {hintTimers.hint1 > 0 ? `(${hintTimers.hint1}s)` : ""}
          </Button>
          <Button
            onClick={fetchHint}
            colorScheme="orange"
            isDisabled={!hintEnabled.hint2}
            isLoading={isLoadingHint}
            size="md"
            borderRadius="lg"
            _hover={{ transform: "translateY(-2px)" }}
            _disabled={{ transform: "none" }}
            transition="all 0.2s"
          >
            🔍 Hint 2 {hintTimers.hint2 > 0 ? `(${hintTimers.hint2}s)` : ""}
          </Button>
        </HStack>

        {(hintData.hint1 || hintData.hint2) && (
          <Box w="100%">
            <VStack spacing={4}>
              {hintData.hint1 && (
                <Box
                  bg={cardBg}
                  borderRadius="xl"
                  p={4}
                  boxShadow="md"
                  border="2px solid"
                  borderColor="orange.200"
                  w="100%"
                >
                  <VStack spacing={3}>
                    <Text fontWeight="bold" color="orange.600">
                      💡 Hint 1
                    </Text>
                    <Box borderRadius="lg" overflow="hidden">
                      <Image
                        src={`data:image/png;base64,${hintData.hint1}`}
                        maxW="200px"
                        mx="auto"
                      />
                    </Box>
                  </VStack>
                </Box>
              )}

              {hintData.hint2 && (
                <Box
                  bg={cardBg}
                  borderRadius="xl"
                  p={4}
                  boxShadow="md"
                  border="2px solid"
                  borderColor="orange.200"
                  w="100%"
                >
                  <VStack spacing={3}>
                    <Text fontWeight="bold" color="orange.600">
                      🔍 Hint 2
                    </Text>
                    <Box borderRadius="lg" overflow="hidden">
                      <Image
                        src={`data:image/png;base64,${hintData.hint2}`}
                        maxW="200px"
                        mx="auto"
                      />
                    </Box>
                  </VStack>
                </Box>
              )}
            </VStack>
          </Box>
        )}

        {submitMessage && (
          <Alert
            status={
              submitMessage.includes("Correct") ||
              submitMessage.includes("verified")
                ? "success"
                : "error"
            }
            borderRadius="lg"
            boxShadow="md"
          >
            <AlertIcon />
            <Text fontWeight="medium">{submitMessage}</Text>
          </Alert>
        )}
      </VStack>
    );
  } else {
    content = (
      <VStack spacing={4}>
        <Icon
          as={TimeIcon}
          boxSize="40px"
          color="blue.500"
          animation={`${float} 2s infinite`}
        />
        <Text fontSize="lg" color={textColor}>
          Loading next stage question...
        </Text>
      </VStack>
    );
  }

  return (
    <Fade in>
      <Container maxW="4xl" py={6}>
        <Box
          bgGradient={gradientBg}
          borderRadius="2xl"
          boxShadow="2xl"
          p={8}
          border="2px solid"
          borderColor={borderColor}
        >
          <VStack spacing={6}>
            <Box textAlign="center">
              <HStack justify="center" spacing={3} mb={3}>
                <TeamBadge teamId={teamId} size="md" />
                <Badge
                  colorScheme="blue"
                  fontSize="md"
                  px={4}
                  py={2}
                  borderRadius="full"
                >
                  Stage {stage.stageNumber}
                </Badge>
              </HStack>
              <Heading
                size="xl"
                color={accentColor}
                fontWeight="bold"
                bgGradient={`linear(to-r, ${teamColor}, blue.500)`}
                bgClip="text"
              >
                {getStageName(stage.stageNumber)}
              </Heading>
            </Box>
            {content}
          </VStack>
        </Box>
      </Container>
    </Fade>
  );
};

export default StageStep;
