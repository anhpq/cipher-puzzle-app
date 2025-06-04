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
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { FaLocationDot, FaHourglassStart } from "react-icons/fa6";
import StageStep from "./StageStep";
import API from "../../api";

const TeamDashboardWizard = ({ teamId, onAdvance }) => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  // activeStep: index của stage hiện hành trong mảng stages
  const [activeStep, setActiveStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  const fetchStages = async () => {
    try {
      const response = await API.get(`/api/team-progress/current-stages`);
      const data = response.data; // Giả sử backend trả về stage theo thứ tự route_order
      setStages(data);
      // Tìm index của stage đầu tiên chưa hoàn thành
      const index = data.findIndex((stage) => stage.completed === false);
      // Nếu không tìm thấy stage nào chưa hoàn thành, nghĩa là trò chơi đã kết thúc,
      // set activeStage thành stage cuối cùng trong danh sách
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

      // Reset scroll và input sau khi stage mới được load
      window.scrollTo(0, 0);
      setTimeout(() => setAnimating(false), 300);
    }
  };

  if (loading) {
    return <Spinner size="xl" mt={10} />;
  }

  // cập nhật đoạn Stepper
  const stagesToShow = stages.filter((s) => s.stageNumber !== 8);

  // Tính toán visibleStages:
  // Nếu activeStep > 0: hiển thị stage active - 1, active và active + 1.
  // Nếu activeStep bằng 0: nếu có ít nhất 3 stage, hiển thị 0, 1 và 2; nếu không, hiển thị tất cả.
  let visibleStages = [];
  if (activeStep === 0) {
    visibleStages =
      stagesToShow.length >= 3 ? stagesToShow.slice(0, 3) : stagesToShow;
  } else {
    const startIndex = Math.max(activeStep - 1, 0);
    const endIndex = Math.min(activeStep + 1, stagesToShow.length - 1);
    visibleStages = stagesToShow.slice(startIndex, endIndex + 1);
  }

  const bg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");

  return (
    <Box maxW="95vw" mx="auto" bg={bg} borderRadius="lg" boxShadow="xl" mt={6}>
      <Flex justify="center" mb={6} p={8}>
        <Stepper
          index={activeStep - (activeStep === 0 ? 0 : activeStep - 1)}
          colorScheme="teal"
          size="lg"
          width="100%"
        >
          {visibleStages.map((stage, idx) => {
            // Tính chỉ số gốc của stage
            const originalIndex =
              activeStep === 0 ? idx : idx + (activeStep - 1);
            let icon;
            if (stage.completed) {
              icon = <Icon as={CheckIcon} />;
            } else if (originalIndex === activeStep) {
              icon = <Icon as={FaLocationDot} color="green.500" />;
            } else {
              icon = <Icon as={FaHourglassStart} color="gray.400" />;
            }
            return (
              <Box>
                <Step key={stage.stageId}>
                  <StepIndicator>{icon}</StepIndicator>
                  <StepSeparator />
                </Step>
                <Box flexShrink="0">
                  <StepTitle fontSize="sm">Stage {stage.stageNumber}</StepTitle>
                </Box>
              </Box>
            );
          })}
        </Stepper>
      </Flex>

      <Fade in={!animating} key={stages[activeStep].stageId}>
        <Box p={6} bg={cardBg} borderRadius="md" boxShadow="md">
          <StageStep
            stage={stages[activeStep]}
            teamId={teamId}
            isStageOne={stages[activeStep].stageNumber === 1}
            onAdvance={handleAdvance}
            initialVerified={stages[activeStep].open_code_verified}
          />
        </Box>
      </Fade>
    </Box>
  );
};

export default TeamDashboardWizard;
