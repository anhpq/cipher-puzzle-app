import React from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaQuestion } from "react-icons/fa6";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useTeamTheme } from "../../../utils/TeamThemeContext";

const QuestionDisplay = ({
  question,
  answer,
  onAnswerChange,
  onSubmit,
  isLoading,
  disabled = false
}) => {
  const { colors, shadows, borders } = useTeamTheme();
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue(
    colors.rgba.primary(0.3),
    colors.rgba.primary(0.6)
  );
  const questionBg = useColorModeValue(
    colors.rgba.primary(0.05),
    colors.rgba.primary(0.1)
  );

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && answer.trim() && !isLoading) {
      onSubmit();
    }
  };

  return (
    <Box
      bg={cardBg}
      borderRadius="xl"
      p={6}
      boxShadow={shadows.soft}
      border="2px solid"
      borderColor={borderColor}
      w="100%"
    >
      <VStack spacing={4}>
        <HStack spacing={3}>
          <Icon as={FaQuestion} color={colors.primary} boxSize="24px" />
          <Text fontSize="lg" fontWeight="semibold" color={colors.primary}>
            Challenge Question
          </Text>
        </HStack>

        <Text
          fontSize="md"
          fontWeight="medium"
          color={textColor}
          textAlign="center"
          bg={questionBg}
          p={4}
          borderRadius="lg"
          border="1px solid"
          borderColor={borderColor}
          lineHeight="tall"
        >
          {question}
        </Text>

        <Input
          placeholder="Enter your answer here"
          value={answer}
          onChange={onAnswerChange}
          onKeyPress={handleKeyPress}
          size="lg"
          variant="filled"
          bg={useColorModeValue("gray.50", "gray.700")}
          borderRadius="lg"
          disabled={disabled || isLoading}
          _focus={{
            bg: useColorModeValue("white", "gray.600"),
            borderColor: colors.primary,
            boxShadow: `0 0 0 1px ${colors.primary}`,
          }}
          _hover={{
            bg: useColorModeValue("gray.100", "gray.600")
          }}
        />

        <Button
          onClick={onSubmit}
          bg={colors.primary}
          color="white"
          size="lg"
          borderRadius="lg"
          leftIcon={<CheckCircleIcon />}
          isLoading={isLoading}
          loadingText="Submitting..."
          isDisabled={!answer.trim() || disabled}
          _hover={{
            bg: colors.dark,
            transform: "translateY(-2px)",
            boxShadow: shadows.medium
          }}
          _disabled={{
            transform: "none",
            boxShadow: "none",
            opacity: 0.6
          }}
          transition="all 0.2s"
          w="100%"
        >
          Submit Answer
        </Button>
      </VStack>
    </Box>
  );
};

export default QuestionDisplay;