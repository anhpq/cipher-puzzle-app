// components/stage/LoadingState.jsx
import React from "react";
import {
  Box,
  Container,
  VStack,
  Text,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FaRocket } from "react-icons/fa6";
import { useTeamTheme } from "../../../utils/TeamThemeContext";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const LoadingState = ({ message = "Loading next stage..." }) => {
  const { colors, gradients, shadows, borders, teamName } = useTeamTheme();

  return (
    <Container maxW="4xl" py={6}>
      <Box
        bg={gradients.secondary}
        borderRadius="2xl"
        boxShadow={shadows.medium}
        p={8}
        border={borders.primary}
        textAlign="center"
      >
        <VStack spacing={6}>
          <Box position="relative">
            <Spinner 
              size="xl" 
              color={colors.primary} 
              thickness="4px"
              speed="0.8s"
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
            <Text fontSize="lg" fontWeight="semibold" color={colors.primary}>
              {message}
            </Text>
            <Text fontSize="sm" opacity={0.8} color={colors.dark}>
              {teamName} Team
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
};

export default LoadingState;