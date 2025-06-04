// Solution 1: Add a transitioning state to prevent flickering
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
  
  // Add transitioning state to prevent flickering
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Enhanced color scheme
  const cardBg = useColorModeValue("white", "gray.800");
  const gradientBg = useColorModeValue(
    "linear(to-br, blue.50, blue.50, pink.50)",
    "linear(to-br, blue.900, blue.900, pink.900)"
  );
  const borderColor = useColorModeValue("blue.200", "blue.600");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const accentColor = useColorModeValue("blue.600", "blue.300");

  // All your existing useEffect hooks remain the same
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

  // Modified handleSubmitAnswer with transition state
  const handleSubmitAnswer = async () => {
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
          // Start transitioning before making state changes
          setIsTransitioning(true);
          
          await API.put(`/api/team-progress/advance-stage`, {
            stage_id: stage.stageId,
          });
          
          // Clear state first
          setSubmitMessage("");
          setVerified(false);
          setNextStage(null);
          setOpenCodeInput("");
          setAnswerInput("");
          
          // Call onAdvance and wait for it to complete
          if (typeof onAdvance === "function") {
            await onAdvance();
          }
          
          // Small delay to ensure parent component updates
          setTimeout(() => {
            setIsTransitioning(false);
          }, 100);
        }
      }
    } catch (error) {
      setSubmitMessage(error.response?.data?.message || "Wrong answer.");
    }
  };

  // Show loading state during transition
  if (isTransitioning) {
    return (
      <Container maxW="4xl" py={6}>
        <Box
          bgGradient={gradientBg}
          borderRadius="2xl"
          boxShadow="2xl"
          p={8}
          border="2px solid"
          borderColor={borderColor}
          textAlign="center"
        >
          <VStack spacing={6}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
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
            bgGradient={gradientBg}
            borderRadius="3xl"
            boxShadow="2xl"
            p={12}
            textAlign="center"
            position="relative"
            overflow="hidden"
            border="3px solid"
            borderColor="gold"
          >
            {/* Decorative elements */}
            <Box
              position="absolute"
              top="-20px"
              left="-20px"
              w="40px"
              h="40px"
              borderRadius="full"
              bg="yellow.400"
              animation={`${sparkle} 2s infinite`}
            />
            <Box
              position="absolute"
              top="20px"
              right="30px"
              w="30px"
              h="30px"
              borderRadius="full"
              bg="pink.400"
              animation={`${sparkle} 2s infinite 0.5s`}
            />
            <Box
              position="absolute"
              bottom="30px"
              left="40px"
              w="35px"
              h="35px"
              borderRadius="full"
              bg="blue.400"
              animation={`${sparkle} 2s infinite 1s`}
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
                <Heading
                  size="2xl"
                  bgGradient="linear(to-r, gold, yellow.400, orange.400)"
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
                  Outstanding! You've conquered every challenge, solved every
                  puzzle, and emerged as true champions of this adventure!
                </Text>
              </VStack>

              <Box
                bg={cardBg}
                borderRadius="xl"
                p={6}
                boxShadow="lg"
                border="2px solid"
                borderColor={borderColor}
              >
                <HStack justify="center" spacing={6}>
                  <VStack>
                    <Icon as={FaGem} boxSize="30px" color="blue.500" />
                    <Text fontSize="lg" fontWeight="bold" color={accentColor}>
                      Stage Completed
                    </Text>
                    <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                      {getStageName(stage.stageNumber)}
                    </Badge>
                  </VStack>

                  {totalTime && (
                    <>
                      <Divider orientation="vertical" h="80px" />
                      <VStack>
                        <Icon as={TimeIcon} boxSize="30px" color="blue.500" />
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                          color={accentColor}
                        >
                          Total Time
                        </Text>
                        <Badge colorScheme="blue" fontSize="lg" px={4} py={2}>
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
                    color="gold"
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
                Enter Access Code
              </Text>
            </HStack>

            <Input
              placeholder="Enter open code to unlock this stage"
              value={openCodeInput}
              onChange={(e) => setOpenCodeInput(e.target.value)}
              size="lg"
              variant="filled"
              bg={useColorModeValue("gray.50", "gray.700")}
              borderRadius="lg"
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
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              transition="all 0.2s"
            >
              Unlock Stage
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
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
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
            size="md"
            borderRadius="lg"
            _hover={{ transform: "translateY(-2px)" }}
            transition="all 0.2s"
          >
            💡 Hint 1 {hintTimers.hint1 > 0 ? `(${hintTimers.hint1}s)` : ""}
          </Button>
          <Button
            onClick={fetchHint}
            colorScheme="orange"
            isDisabled={!hintEnabled.hint2}
            size="md"
            borderRadius="lg"
            _hover={{ transform: "translateY(-2px)" }}
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
            status={submitMessage.includes("Correct") || submitMessage.includes("verified") ? "success" : "error"}
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
              <Badge
                colorScheme="blue"
                fontSize="md"
                px={4}
                py={2}
                borderRadius="full"
                mb={2}
              >
                Stage {stage.stageNumber}
              </Badge>
              <Heading size="xl" color={accentColor} fontWeight="bold">
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