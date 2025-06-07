// components/stage/StageHeader.jsx
import React from "react";
import {
  Box,
  Heading,
  Badge,
  HStack,
  VStack,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FaFlag, FaRoute } from "react-icons/fa6";
import { useTeamTheme } from "../../../utils/TeamThemeContext";
import { getStageName } from "../../../utils/helpers";

// Animation for stage badge
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const StageHeader = ({ stage }) => {
  const { colors, gradients, shadows, borders, teamName } = useTeamTheme();
  const headerBg = useColorModeValue(
    colors.rgba.primary(0.05),
    colors.rgba.primary(0.1)
  );

  return (
    <Box 
      textAlign="center" 
      position="relative"
      py={6}
      px={4}
      bg={headerBg}
      borderRadius="2xl"
      border="2px solid"
      borderColor={colors.rgba.primary(0.2)}
      boxShadow={shadows.medium}
    >
      {/* Decorative background elements */}
      <Box
        position="absolute"
        top="10px"
        left="20px"
        opacity={0.3}
      >
        <Icon as={FaRoute} boxSize="24px" color={colors.primary} />
      </Box>
      <Box
        position="absolute"
        top="10px"
        right="20px"
        opacity={0.3}
      >
        <Icon as={FaFlag} boxSize="24px" color={colors.primary} />
      </Box>

      <VStack spacing={4}>
        {/* Team identification */}
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color={colors.primary}
          textTransform="uppercase"
          letterSpacing="wider"
          opacity={0.8}
        >
          {teamName} Team Journey
        </Text>

        {/* Stage number badge */}
        <HStack justify="center" spacing={3}>
          <Badge
            bg={gradients.button}
            color="white"
            fontSize="lg"
            px={6}
            py={3}
            borderRadius="full"
            boxShadow={shadows.glowStrong}
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="wide"
            position="relative"
            overflow="hidden"
            animation={`${pulse} 3s infinite`}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(90deg, transparent, ${colors.rgba.primary(0.3)}, transparent)`,
              backgroundSize: "200% 100%",
              animation: `${shimmer} 2s infinite`,
            }}
          >
            <HStack spacing={2}>
              <Icon as={FaFlag} boxSize="16px" />
              <Text>Stage {stage.stageNumber}</Text>
            </HStack>
          </Badge>
        </HStack>

        {/* Stage name */}
        <VStack spacing={2}>
          <Heading
            size="2xl"
            fontWeight="black"
            bgGradient={`linear(to-r, ${colors.primary}, ${colors.light}, ${colors.veryLight})`}
            bgClip="text"
            textShadow={`2px 2px 4px ${colors.rgba.primary(0.2)}`}
            lineHeight="shorter"
            maxW="600px"
          >
            {getStageName(stage.stageNumber)}
          </Heading>

          {/* Decorative underline */}
          <Box
            w="80px"
            h="4px"
            bg={gradients.primary}
            borderRadius="full"
            boxShadow={shadows.soft}
          />
        </VStack>

        {/* Progress indicator dots */}
        <HStack spacing={2} mt={2}>
          {[...Array(8)].map((_, i) => (
            <Box
              key={i}
              w="8px"
              h="8px"
              borderRadius="full"
              bg={
                i + 1 <= stage.stageNumber
                  ? colors.primary
                  : colors.rgba.primary(0.2)
              }
              boxShadow={
                i + 1 <= stage.stageNumber ? shadows.soft : "none"
              }
              transition="all 0.3s"
              _hover={{
                transform: i + 1 <= stage.stageNumber ? "scale(1.2)" : "none",
              }}
            />
          ))}
        </HStack>

        {/* Motivational text */}
        <Text
          fontSize="sm"
          color={colors.dark}
          fontStyle="italic"
          opacity={0.8}
          maxW="400px"
          lineHeight="relaxed"
        >
          Every step forward is a victory. Keep pushing boundaries!
        </Text>
      </VStack>
    </Box>
  );
};

export default StageHeader;