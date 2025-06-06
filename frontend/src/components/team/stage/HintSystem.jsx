// components/stage/HintSystem.jsx
import React from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { useTeamTheme } from "../../../utils/TeamThemeContext";

const HintSystem = ({
  hintData,
  hintTimers,
  hintEnabled,
  onFetchHint,
  isLoadingHint,
}) => {
  const { colors, shadows, borders } = useTeamTheme();
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <VStack spacing={4} w="100%">
      {/* Hint Buttons */}
      <HStack spacing={4} justify="center" flexWrap="wrap">
        <Button
          onClick={onFetchHint}
          bg={colors.rgba.primary(0.1)}
          color={colors.primary}
          border="2px solid"
          borderColor={colors.primary}
          isDisabled={!hintEnabled.hint1}
          isLoading={isLoadingHint}
          size="md"
          borderRadius="lg"
          _hover={{
            bg: colors.rgba.primary(0.2),
            transform: "translateY(-2px)",
            boxShadow: shadows.soft,
          }}
          _disabled={{
            transform: "none",
            opacity: 0.5,
          }}
          transition="all 0.2s"
        >
          💡 Hint 1 {hintTimers.hint1 > 0 ? `(${hintTimers.hint1}s)` : ""}
        </Button>

        <Button
          onClick={onFetchHint}
          bg={colors.rgba.primary(0.1)}
          color={colors.primary}
          border="2px solid"
          borderColor={colors.primary}
          isDisabled={!hintEnabled.hint2}
          isLoading={isLoadingHint}
          size="md"
          borderRadius="lg"
          _hover={{
            bg: colors.rgba.primary(0.2),
            transform: "translateY(-2px)",
            boxShadow: shadows.soft,
          }}
          _disabled={{
            transform: "none",
            opacity: 0.5,
          }}
          transition="all 0.2s"
        >
          🔍 Hint 2 {hintTimers.hint2 > 0 ? `(${hintTimers.hint2}s)` : ""}
        </Button>
      </HStack>

      {/* Hint Display */}
      {(hintData.hint1 || hintData.hint2) && (
        <VStack spacing={4} w="100%">
          {hintData.hint1 && (
            <Box
              bg={cardBg}
              borderRadius="xl"
              p={4}
              boxShadow={shadows.soft}
              border={borders.light}
              w="100%"
              transition="all 0.3s"
              _hover={{ transform: "translateY(-2px)" }}
            >
              <VStack spacing={3}>
                <Text fontWeight="bold" color={colors.primary} fontSize="lg">
                  💡 Hint 1
                </Text>
                <Box borderRadius="lg" overflow="hidden" boxShadow="md">
                  <Image
                    src={`data:image/png;base64,${hintData.hint1}`}
                    maxW="200px"
                    mx="auto"
                    alt="Hint 1"
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
              boxShadow={shadows.soft}
              border={borders.light}
              w="100%"
              transition="all 0.3s"
              _hover={{ transform: "translateY(-2px)" }}
            >
              <VStack spacing={3}>
                <Text fontWeight="bold" color={colors.primary} fontSize="lg">
                  🔍 Hint 2
                </Text>
                <Box borderRadius="lg" overflow="hidden" boxShadow="md">
                  <Image
                    src={`data:image/png;base64,${hintData.hint2}`}
                    maxW="200px"
                    mx="auto"
                    alt="Hint 2"
                  />
                </Box>
              </VStack>
            </Box>
          )}
        </VStack>
      )}
    </VStack>
  );
};

export default HintSystem;
