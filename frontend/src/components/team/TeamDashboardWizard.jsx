// TeamDashboardWizard.jsx (enhanced UI + animation)
import React, { useState, useEffect } from 'react';
import {
  Box,
  Spinner,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepDescription,
  StepSeparator,
  Icon,
  useColorModeValue,
  Fade,
  Flex
} from '@chakra-ui/react';
import { CheckIcon, TimeIcon } from '@chakra-ui/icons';
import StageStep from './StageStep';
import axios from 'axios';

const TeamDashboardWizard = ({ config, teamId, onAdvance }) => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  const fetchStages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/team-progress/current-stages', config);
      setStages(response.data);
      const index = response.data.findIndex(s => s.open_code_verified === true);
      setActiveStep(index === -1 ? 0 : index);
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
    if (typeof onAdvance === 'function') {
      setAnimating(true);
      await onAdvance();
      await fetchStages();
      setTimeout(() => setAnimating(false), 300); // delay for fade effect
    }
  };

  if (loading) {
    return <Spinner size="xl" mt={10} />;
  }

  const currentStage = stages[activeStep];
  const visibleStages = stages.filter((_, index) =>
    index === activeStep - 1 || index === activeStep || index === activeStep + 1
  );

  const bg = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Box maxW="900px" mx="auto" p={6} bg={bg} borderRadius="lg" boxShadow="xl" mt={6}>
      <Flex justify="center" mb={6}>
        <Stepper index={activeStep} colorScheme="teal" size="lg" width="100%">
          {visibleStages.map((stage, index) => (
            <Step key={stage.stageId}>
              <StepIndicator>
                <StepStatus
                  complete={<Icon as={CheckIcon} color="green.500" />}
                  incomplete={<Icon as={TimeIcon} color="gray.400" />}
                  active={<Icon as={TimeIcon} color="blue.400" />}
                />
              </StepIndicator>
              <Box flexShrink="0">
                <StepTitle fontSize="sm">Stage {stage.stageNumber}</StepTitle>
                <StepDescription fontSize="xs" color="gray.500">{stage.stageName}</StepDescription>
              </Box>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
      </Flex>

      <Fade in={!animating} key={currentStage.stageId}>
        <Box p={6} bg={cardBg} borderRadius="md" boxShadow="md">
          <StageStep
            stage={currentStage}
            teamId={teamId}
            isStageOne={activeStep === 0}
            onAdvance={handleAdvance}
            config={config}
            initialVerified={currentStage.open_code_verified}
          />
        </Box>
      </Fade>
    </Box>
  );
};

export default TeamDashboardWizard;
