// components/stage/CodeInput.jsx
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
import { FaLock, FaUnlock } from "react-icons/fa6";
import { useTeamTheme } from "../../../utils/TeamThemeContext";

const CodeInput = ({ 
  value, 
  onChange, 
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && value.trim() && !isLoading) {
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
          <Icon as={FaLock} color="red.500" boxSize="24px" />
          <Text fontSize="lg" fontWeight="semibold" color={textColor}>
            Enter Completion Code
          </Text>
        </HStack>
        
        <Text fontSize="sm" fontWeight="medium" color={textColor} textAlign="center">
          Complete all the games in this stage,<br />
          then ask the Station Chief for the code.
        </Text>

        <Input
          placeholder="Enter the code to complete this stage"
          value={value}
          onChange={onChange}
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
          leftIcon={<FaUnlock />}
          isLoading={isLoading}
          loadingText="Verifying..."
          isDisabled={!value.trim() || disabled}
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
          Unlock Next Stage
        </Button>
      </VStack>
    </Box>
  );
};

export default CodeInput;