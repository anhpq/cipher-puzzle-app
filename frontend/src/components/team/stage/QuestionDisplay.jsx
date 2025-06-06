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
            borderColor: "green.400",
            boxShadow: "0 0 0 1px #48BB78",
          }}
          _hover={{
            bg: useColorModeValue("gray.100", "gray.600")
          }}
        />

        <Button
          onClick={onSubmit}
          colorScheme="green"
          size="lg"
          borderRadius="lg"
          leftIcon={<CheckCircleIcon />}
          isLoading={isLoading}
          loadingText="Submitting..."
          isDisabled={!answer.trim() || disabled}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "lg"
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