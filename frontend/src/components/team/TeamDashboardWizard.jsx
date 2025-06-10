// Enhanced TeamDashboardWizard.jsx - Improved with Team Theme Integration
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Spinner,
  Stepper,
  Step,
  StepIndicator,
  StepTitle,
  StepSeparator,
  Icon,
  useColorModeValue,
  Fade,
  Flex,
  Container,
  VStack,
  HStack,
  Text,
  Progress,
  Badge,
  Alert,
  AlertIcon,
  ScaleFade,
  Heading,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CheckIcon, TimeIcon } from "@chakra-ui/icons";
import {
  FaLocationDot,
  FaHourglassStart,
  FaPlay,
  FaFlag,
  FaStar,
  FaRocket,
  FaTrophy,
  FaGem,
} from "react-icons/fa6";
import StageStep from "./StageStep";
import API from "../../config/api";
import { getStageName, isValidStageNumber } from "../../utils/helpers";
import { useTeamTheme } from "../../utils/TeamThemeContext";
import { color } from "framer-motion";

// Enhanced Animation keyframes
const pulse = keyframes`
  0% { 
    transform: scale(1); 
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3); 
  }
  70% { 
    transform: scale(1.05); 
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); 
  }
  100% { 
    transform: scale(1); 
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); 
  }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
`;

const TeamDashboardWizard = ({ teamId, onAdvance, startTime }) => {
  // Team theme integration
  const { colors, gradients, shadows, borders, teamName } = useTeamTheme();

  // State management
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [error, setError] = useState(null);
  const [totalTime, setTotalTime] = useState(null);

  // Enhanced color scheme with team colors
  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const stepperBg = useColorModeValue(
    "white",
    colors.rgba.primary(0.05)
  );
  const textColor = useColorModeValue("gray.700", "gray.200");
  const accentColor = useColorModeValue(colors.primary, colors.light);

  // Memoized filtered stages to avoid recalculation
  const validStages = useMemo(() => {
    return stages.filter((s) => isValidStageNumber(s.stageNumber) && s.stageNumber !== 8);
  }, [stages]);

  // Visible stages for stepper optimization
  const visibleStages = useMemo(() => {
    if (validStages.length === 0) return [];

    if (activeStep === 0) {
      return validStages.length >= 2 ? validStages.slice(0, 2) : validStages;
    }

    const startIndex = Math.max(activeStep - 1, 0);
    const endIndex = Math.min(activeStep + 1, validStages.length - 1);
    return validStages.slice(startIndex, endIndex + 1);
  }, [validStages, activeStep]);

  // Enhanced fetch stages with better error handling
  const fetchStages = useCallback(async () => {
    try {
      setError(null);
      const response = await API.get(`/api/team-progress/current-stages`);
      const data = response.data;

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received");
      }

      setStages(data);

      // Filter valid stages for completion check
      const validStagesData = data.filter((s) =>
        isValidStageNumber(s.stageNumber) && s.stageNumber !== 8
      );

      // Check if game is finished
      const allCompleted = validStagesData.length > 0 &&
        validStagesData.every((stage) => stage.completed === true);

      setGameFinished(allCompleted);

      if (allCompleted) {
        // Fetch total time when game is finished
        try {
          const totalTimeResponse = await API.get(`/api/team-progress/total-time`);
          if (totalTimeResponse.data && totalTimeResponse.data.total_seconds != null) {
            const minutes = Math.floor(totalTimeResponse.data.total_seconds / 60);
            const seconds = totalTimeResponse.data.total_seconds % 60;
            setTotalTime(`${minutes}m ${seconds}s`);
          }
        } catch (timeError) {
          console.warn("Error fetching total time:", timeError);
          setTotalTime(null);
        }

        setActiveStep(validStagesData.length - 1);
      } else {
        // Find the first incomplete stage
        const index = validStagesData.findIndex((stage) => stage.completed === false);
        setActiveStep(index === -1 ? validStagesData.length - 1 : index);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching stages:", error);
      setError(error.message || "Failed to load stages");
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  // Enhanced advance handler with better animation
  const handleAdvance = useCallback(async () => {
    if (typeof onAdvance === "function") {
      setAnimating(true);

      try {
        await onAdvance();
        await fetchStages();

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error("Error advancing stage:", error);
        setError("Failed to advance to next stage");
      } finally {
        setTimeout(() => setAnimating(false), 300);
      }
    }
  }, [onAdvance, fetchStages]);

  // Enhanced loading state with team colors
  if (loading) {
    return (
      <Container maxW="4xl" py={20}>
        <VStack spacing={8}>
          <Box position="relative">
            <Spinner
              size="xl"
              color={colors.primary}
              thickness="4px"
              speed="0.8s"
              emptyColor={colors.rgba.primary(0.1)}
            />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              animation={`${float} 2s infinite`}
            >
              <Icon as={FaRocket} boxSize="20px" color={colors.primary} />
            </Box>
          </Box>

          <VStack spacing={2}>
            <Text fontSize="xl" fontWeight="semibold" color={accentColor}>
              Loading {teamName} Adventure...
            </Text>
            <Text color={textColor}>Preparing your quest</Text>

            {/* Team-themed loading bar */}
            <Box w="200px" mt={4}>
              <Box
                h="4px"
                bg={colors.rgba.primary(0.2)}
                borderRadius="full"
                overflow="hidden"
              >
                <Box
                  h="100%"
                  bg={gradients.primary}
                  borderRadius="full"
                  backgroundSize="200px 100%"
                  animation={`${shimmer} 1.5s infinite`}
                />
              </Box>
            </Box>
          </VStack>
        </VStack>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxW="4xl" py={20}>
        <Alert status="error" borderRadius="lg" boxShadow="md">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="semibold">Failed to Load Adventure</Text>
            <Text fontSize="sm">{error}</Text>
          </VStack>
        </Alert>
      </Container>
    );
  }

  // Current stage validation
  const currentStage = validStages[activeStep];
  if (!currentStage) {
    return (
      <Container maxW="4xl" py={20}>
        <VStack spacing={8}>
          <Icon as={FaHourglassStart} boxSize="40px" color={colors.primary} />
          <VStack spacing={2}>
            <Text fontSize="xl" fontWeight="semibold" color={accentColor}>
              No stages available for {teamName}
            </Text>
            <Text color={textColor}>Please contact admin for assistance</Text>
          </VStack>
        </VStack>
      </Container>
    );
  }

  // Enhanced stage status helper
  const getStageStatus = (stage, originalIndex) => {
    const isActive = originalIndex === activeStep;
    const isCompleted = stage.completed;

    if (isCompleted) {
      return {
        icon: CheckIcon,
        color: colors.primary,
        badgeColor: "green",
        text: "Completed",
        animation: "none"
      };
    } else if (isActive) {
      return {
        icon: FaPlay,
        color: colors.primary,
        badgeColor: "blue",
        text: "Active",
        animation: `${pulse} 2s infinite`
      };
    } else {
      return {
        icon: FaHourglassStart,
        color: "gray.400",
        badgeColor: "gray",
        text: "Pending",
        animation: "none"
      };
    }
  };

  return (
    <Box bg={bg} minH="100vh" w="100%" py={8}>
      <Heading as="h1" size="2xl" mb={2} color={colors.primary} textAlign="center">
        Welcome {teamName}!
      </Heading>
      {startTime && (
        <Text mb={1} fontSize="xs" color="gray.600" textAlign="center">
          Game started at: {new Date(startTime).toLocaleString()}
        </Text>
      )}
      <Container maxW="6xl" py={2} px={2}>
        <VStack spacing={2}>
          {/* Stage Content with enhanced transition */}
          <Box w="100%">
            <ScaleFade in={!animating} initialScale={0.9}>
              <StageStep
                stage={currentStage}
                teamId={teamId}
                isStageOne={currentStage.stageNumber === 1}
                onAdvance={handleAdvance}
                initialVerified={currentStage.open_code_verified}
              />
            </ScaleFade>
          </Box>

          {/* Enhanced Footer Info with team colors */}
          <Box
            bg={cardBg}
            borderRadius="2xl"
            boxShadow={shadows.soft}
            p={6}
            w="100%"
            border={borders.light}
            bgGradient={gradients.subtle}
          >
            <VStack spacing={4}>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={accentColor}
                textAlign="center"
              >
                🎮 How to Play
              </Text>

              <HStack justify="center" spacing={8} flexWrap="wrap">
                <VStack spacing={2}>
                  <Icon as={FaLocationDot} color={colors.primary} boxSize="24px" />
                  <Text fontSize="sm" fontWeight="medium" color={textColor} textAlign="center">
                    Find<br />Locations
                  </Text>
                </VStack>

                <VStack spacing={2}>
                  <Text fontSize="2xl">🔓</Text>
                  <Text fontSize="sm" fontWeight="medium" color={textColor} textAlign="center">
                    Enter<br />Codes
                  </Text>
                </VStack>

                <VStack spacing={2}>
                  <Text fontSize="2xl">🧩</Text>
                  <Text fontSize="sm" fontWeight="medium" color={textColor} textAlign="center">
                    Solve<br />Puzzles
                  </Text>
                </VStack>

                <VStack spacing={2}>
                  <Icon as={FaFlag} color="red.500" boxSize="24px" />
                  <Text fontSize="sm" fontWeight="medium" color={textColor} textAlign="center">
                    Reach<br />the End
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>

          {/* Team signature */}
          <Text
            fontSize="xs"
            color={colors.rgba.primary(0.6)}
            textAlign="center"
            fontWeight="medium"
          >
            Team {teamName} • Adventure Quest System
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default TeamDashboardWizard;