// frontend/src/components/team/TeamDashboardWizard.jsx
import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CheckIcon } from "@chakra-ui/icons";
import {
  FaLocationDot,
  FaHourglassStart,
  FaPlay,
  FaFlag,
  FaStar,
  FaRocket,
} from "react-icons/fa6";
import StageStep from "./StageStep";
import API from "../../api";

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(51, 102, 234, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(147, 51, 234, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(147, 51, 234, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const TeamDashboardWizard = ({ teamId, onAdvance }) => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Enhanced color scheme
  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const stepperBg = useColorModeValue("white", "gray.700");
  const progressBg = useColorModeValue("blue.50", "blue.900");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const accentColor = useColorModeValue("blue.600", "blue.300");

  const fetchStages = async () => {
    try {
      const response = await API.get(`/api/team-progress/current-stages`);
      const data = response.data;
      setStages(data);

      const index = data.findIndex((stage) => stage.completed === false);
      setActiveStep(index === -1 ? data.length - 1 : index);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stages:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  const handleAdvance = async () => {
    if (typeof onAdvance === "function") {
      setAnimating(true);
      await onAdvance();
      await fetchStages();

      window.scrollTo(0, 0);
      setTimeout(() => setAnimating(false), 300);
    }
  };

  if (loading) {
    return (
      <Container maxW="4xl" py={20}>
        <VStack spacing={8}>
          <Box position="relative">
            <Spinner size="xl" color="blue.500" thickness="4px" speed="0.8s" />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
            >
              <Icon as={FaRocket} boxSize="20px" color="blue.500" />
            </Box>
          </Box>
          <VStack spacing={2}>
            <Text fontSize="xl" fontWeight="semibold" color={accentColor}>
              Loading Adventure...
            </Text>
            <Text color={textColor}>Preparing your quest</Text>
          </VStack>
        </VStack>
      </Container>
    );
  }

  const stagesToShow = stages.filter((s) => s.stageNumber !== 8);

  // Calculate progress
  const completedStages = stagesToShow.filter((s) => s.completed).length;
  const totalStages = stagesToShow.length;
  const progressPercentage = (completedStages / totalStages) * 100;

  // Calculate visible stages for stepper
  let visibleStages = [];
  if (activeStep === 0) {
    visibleStages =
      stagesToShow.length >= 3 ? stagesToShow.slice(0, 3) : stagesToShow;
  } else {
    const startIndex = Math.max(activeStep - 1, 0);
    const endIndex = Math.min(activeStep + 1, stagesToShow.length - 1);
    visibleStages = stagesToShow.slice(startIndex, endIndex + 1);
  }

  return (
    <Box bg={bg} minH="100vh">
      <Container maxW="6xl">
        <VStack>
          {/* Enhanced Stepper Section */}
          <Box
            bg={stepperBg}
            borderRadius="2xl"
            boxShadow="xl"
            p={4}
            w="100%"
            border="2px solid"
            borderColor={useColorModeValue("blue.200", "blue.600")}
          >
            <VStack spacing={1}>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={accentColor}
                textAlign="center"
              >
                🎯 Current Stage Path
              </Text>

              <Box w="100%" overflowX="auto" pt={3}>
                <Stepper
                  index={activeStep - (activeStep === 0 ? 0 : activeStep - 1)}
                  colorScheme="blue"
                  size="xs"
                  gap={4}
                >
                  {visibleStages.map((stage, idx) => {
                    const originalIndex =
                      activeStep === 0 ? idx : idx + (activeStep - 1);
                    const isActive = originalIndex === activeStep;
                    const isCompleted = stage.completed;

                    let icon;
                    let statusColor;
                    let statusText;

                    if (isCompleted) {
                      icon = (
                        <Icon as={CheckIcon} color="white" fontSize={"xs"} />
                      );
                      statusColor = "green";
                      statusText = "Completed";
                    } else if (isActive) {
                      icon = <Icon as={FaPlay} color="white" fontSize={"xs"} />;
                      statusColor = "blue";
                      statusText = "Active";
                    } else {
                      icon = (
                        <Icon
                          as={FaHourglassStart}
                          color="gray.400"
                          fontSize={"xs"}
                        />
                      );
                      statusColor = "gray";
                      statusText = "Pending";
                    }

                    return (
                      <Step key={stage.stageId}>
                        <Box textAlign="center">
                          <StepIndicator
                            bg={
                              isCompleted
                                ? "blue.500"
                                : isActive
                                ? "blue.500"
                                : "gray.300"
                            }
                            borderColor={
                              isCompleted
                                ? "blue.600"
                                : isActive
                                ? "blue.600"
                                : "gray.400"
                            }
                            color="white"
                            borderWidth="3px"
                            boxSize="40px"
                            animation={
                              isActive ? `${pulse} 2s infinite` : "none"
                            }
                            _hover={{ transform: "scale(1.1)" }}
                            transition="all 0.2s"
                            justifySelf={"center"}
                          >
                            {icon}
                          </StepIndicator>

                          <VStack spacing={1} mt={3}>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color={accentColor}
                            >
                              Stage {stage.stageNumber}
                            </Text>
                            <Badge
                              colorScheme={statusColor}
                              size="sm"
                              borderRadius="full"
                              px={2}
                            >
                              {statusText}
                            </Badge>
                          </VStack>
                        </Box>
                        <StepSeparator marginBottom={50}/>
                      </Step>
                    );
                  })}
                </Stepper>
              </Box>
            </VStack>
          </Box>

          {/* Stage Content */}
          <Fade in={!animating} key={stages[activeStep]?.stageId}>
            <Box w="100%">
              {stages[activeStep] && (
                <StageStep
                  stage={stages[activeStep]}
                  teamId={teamId}
                  isStageOne={stages[activeStep].stageNumber === 1}
                  onAdvance={handleAdvance}
                  initialVerified={stages[activeStep].open_code_verified}
                />
              )}
            </Box>
          </Fade>

          {/* Footer Info */}
          <Box
            bg={cardBg}
            borderRadius="xl"
            boxShadow="md"
            p={6}
            w="100%"
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.600")}
          >
            <HStack justify="center" spacing={8}>
              <VStack spacing={1}>
                <Icon as={FaLocationDot} color="blue.500" boxSize="20px" />
                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                  Find Locations
                </Text>
              </VStack>

              <VStack spacing={1}>
                <Text fontSize="lg">🔓</Text>
                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                  Enter Codes
                </Text>
              </VStack>

              <VStack spacing={1}>
                <Text fontSize="lg">🧩</Text>
                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                  Solve Puzzles
                </Text>
              </VStack>

              <VStack spacing={1}>
                <Icon as={FaFlag} color="red.500" boxSize="20px" />
                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                  Reach the End
                </Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default TeamDashboardWizard;
