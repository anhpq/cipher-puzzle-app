// components/stage/VictoryScreen.jsx
import React from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Badge,
  Flex,
  Divider,
  useColorModeValue,
  ScaleFade,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { TimeIcon } from "@chakra-ui/icons";
import {
  FaTrophy,
  FaStar,
  FaGem,
  FaCrown,
} from "react-icons/fa6";
import { getStageName } from "../../../utils/helpers";
import { useTeamTheme } from "../../../utils/TeamThemeContext";

// Animation keyframes
const celebration = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(5deg); }
  50% { transform: scale(1.2) rotate(-5deg); }
  75% { transform: scale(1.1) rotate(3deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
`;

const VictoryScreen = ({ stage, totalTime }) => {
  const { colors, gradients, shadows, borders, teamName } = useTeamTheme();
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");

  // Dynamic trophy color based on team theme
  const getTrophyColor = () => {
    // For yellow/light teams, use a contrasting color for better visibility
    if (colors.primary === "#fad02c" || colors.primary === "#f9943b") {
      return colors.veryDark; // Use very dark version of team color
    }
    return colors.primary; // Use primary color for other teams
  };

  const trophyColor = getTrophyColor();
  const accentColor = colors.light;

  return (
    <ScaleFade in>
      <Container maxW="4xl" py={8}>
        <Box
          bg={gradients.card}
          borderRadius="3xl"
          boxShadow={shadows.elevated}
          p={12}
          textAlign="center"
          position="relative"
          overflow="hidden"
          border="3px solid"
          borderColor={colors.primary}
          _before={{
            content: '""',
            position: "absolute",
            top: "-3px",
            left: "-3px",
            right: "-3px",
            bottom: "-3px",
            borderRadius: "3xl",
            background: gradients.primary,
            zIndex: -1,
            opacity: 0.3,
          }}
        >
          {/* Team-colored decorative elements */}
          <Box
            position="absolute"
            top="-20px"
            left="-20px"
            w="40px"
            h="40px"
            borderRadius="full"
            bg={colors.primary}
            animation={`${sparkle} 2s infinite`}
            opacity={0.8}
            boxShadow={shadows.glow}
          />
          <Box
            position="absolute"
            top="20px"
            right="30px"
            w="30px"
            h="30px"
            borderRadius="full"
            bg={accentColor}
            animation={`${sparkle} 2s infinite 0.5s`}
            opacity={0.7}
            boxShadow={shadows.soft}
          />
          <Box
            position="absolute"
            bottom="30px"
            left="40px"
            w="35px"
            h="35px"
            borderRadius="full"
            bg={colors.primary}
            animation={`${sparkle} 2s infinite 1s`}
            opacity={0.8}
            boxShadow={shadows.glow}
          />
          <Box
            position="absolute"
            bottom="-15px"
            right="-15px"
            w="45px"
            h="45px"
            borderRadius="full"
            bg={colors.light}
            animation={`${sparkle} 2s infinite 1.5s`}
            opacity={0.6}
          />

          <VStack spacing={8}>
            <Box
              animation={`${celebration} 3s infinite`}
              position="relative"
            >
              <Icon
                as={FaTrophy}
                boxSize="80px"
                color={trophyColor}
                filter={`drop-shadow(0 0 20px ${colors.rgba.primary(0.6)})`}
                animation={`${pulse} 2s infinite`}
              />
              <Box
                position="absolute"
                top="-10px"
                right="-10px"
                animation={`${float} 1.5s infinite`}
              >
                <Icon
                  as={FaCrown}
                  boxSize="25px"
                  color={accentColor}
                  filter={`drop-shadow(0 0 10px ${colors.rgba.light(0.8)})`}
                />
              </Box>
            </Box>

            <VStack spacing={4}>
              <Heading
                size="2xl"
                bgGradient={`linear(to-r, ${colors.primary}, ${colors.light}, ${colors.veryLight})`}
                bgClip="text"
                fontWeight="black"
                textShadow={`2px 2px 4px ${colors.rgba.primary(0.3)}`}
              >
                🎉 VICTORY ACHIEVED! 🎉
              </Heading>

              <Badge
                bg={gradients.button}
                color="white"
                fontSize="lg"
                px={6}
                py={2}
                borderRadius="full"
                boxShadow={shadows.medium}
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                {teamName} Team Champions
              </Badge>

              <Text
                fontSize="xl"
                color={textColor}
                fontWeight="semibold"
                maxW="600px"
                lineHeight="tall"
                bg={colors.rgba.primary(0.05)}
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor={colors.rgba.primary(0.2)}
              >
                You've conquered every challenge and unlocked every secret...
                <br />
                Now, return to the place where your journey first began.
              </Text>
            </VStack>

            {/* <Box
              bg={cardBg}
              borderRadius="xl"
              p={6}
              boxShadow={shadows.medium}
              border={borders.primary}
              position="relative"
              _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "xl",
                background: gradients.subtle,
                zIndex: -1,
              }}
            >
              <HStack justify="center" spacing={6} flexWrap="wrap">
                <VStack spacing={3}>
                  <Box
                    p={3}
                    borderRadius="full"
                    bg={colors.rgba.primary(0.1)}
                    border="2px solid"
                    borderColor={colors.primary}
                  >
                    <Icon as={FaGem} boxSize="30px" color={colors.primary} />
                  </Box>
                  <Text fontSize="lg" fontWeight="bold" color={colors.primary}>
                    Stage Completed
                  </Text>
                  <Badge
                    bg={gradients.button}
                    color="white"
                    fontSize="md"
                    px={4}
                    py={2}
                    borderRadius="full"
                    boxShadow={shadows.soft}
                  >
                    {getStageName(stage.stageNumber)}
                  </Badge>
                </VStack>
              </HStack>
            </Box> */}

            {/* Team-themed star animation */}
            <Flex wrap="wrap" justify="center" gap={3} mt={4}>
              {[...Array(5)].map((_, i) => (
                <Box
                  key={i}
                  p={1}
                  borderRadius="full"
                  bg={colors.rgba.primary(0.1)}
                  animation={`${float} 2s infinite ${i * 0.2}s`}
                >
                  <Icon
                    as={FaStar}
                    color={colors.primary}
                    boxSize="20px"
                    filter={`drop-shadow(0 0 5px ${colors.rgba.primary(0.4)})`}
                  />
                </Box>
              ))}
            </Flex>
          </VStack>
        </Box>
      </Container>
    </ScaleFade>
  );
};

export default VictoryScreen;