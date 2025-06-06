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

const VictoryScreen = ({ stage, totalTime }) => {
  const { colors, gradients, shadows, borders } = useTeamTheme();
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <ScaleFade in>
      <Container maxW="4xl" py={8}>
        <Box
          bg={gradients.secondary}
          borderRadius="3xl"
          boxShadow={shadows.strong}
          p={12}
          textAlign="center"
          position="relative"
          overflow="hidden"
          border="3px solid"
          borderColor="gold"
          _before={{
            content: '""',
            position: "absolute",
            top: "-3px",
            left: "-3px",
            right: "-3px",
            bottom: "-3px",
            borderRadius: "3xl",
            background: gradients.accent,
            zIndex: -1,
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
            opacity={0.7}
          />
          <Box
            position="absolute"
            top="20px"
            right="30px"
            w="30px"
            h="30px"
            borderRadius="full"
            bg={colors.light}
            animation={`${sparkle} 2s infinite 0.5s`}
            opacity={0.7}
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
            opacity={0.7}
          />

          <VStack spacing={8}>
            <Box animation={`${celebration} 3s infinite`}>
              <Icon
                as={FaTrophy}
                boxSize="80px"
                color="gold"
                filter="drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))"
              />
            </Box>

            <VStack spacing={4}>
              <Heading
                size="2xl"
                bgGradient={`linear(to-r, gold, ${colors.primary}, orange.400)`}
                bgClip="text"
                fontWeight="black"
                textShadow="2px 2px 4px rgba(0,0,0,0.3)"
              >
                🎉 VICTORY ACHIEVED! 🎉
              </Heading>

              <Text
                fontSize="xl"
                color={textColor}
                fontWeight="semibold"
                maxW="600px"
                lineHeight="tall"
              >
                You've conquered every challenge and unlocked every secret...
                Now, return to the place where your journey first began.
              </Text>
            </VStack>

            <Box
              bg={cardBg}
              borderRadius="xl"
              p={6}
              boxShadow={shadows.medium}
              border={borders.primary}
            >
              <HStack justify="center" spacing={6} flexWrap="wrap">
                <VStack>
                  <Icon as={FaGem} boxSize="30px" color={colors.primary} />
                  <Text fontSize="lg" fontWeight="bold" color={colors.primary}>
                    Stage Completed
                  </Text>
                  <Badge
                    bg={colors.primary}
                    color="white"
                    fontSize="md"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {getStageName(stage.stageNumber)}
                  </Badge>
                </VStack>

                {totalTime && (
                  <>
                    <Divider orientation="vertical" h="80px" />
                    <VStack>
                      <Icon
                        as={TimeIcon}
                        boxSize="30px"
                        color={colors.primary}
                      />
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={colors.primary}
                      >
                        Total Time
                      </Text>
                      <Badge
                        bg={colors.primary}
                        color="white"
                        fontSize="lg"
                        px={4}
                        py={2}
                        borderRadius="full"
                      >
                        {totalTime}
                      </Badge>
                    </VStack>
                  </>
                )}
              </HStack>
            </Box>

            <Flex wrap="wrap" justify="center" gap={2}>
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  as={FaStar}
                  color={colors.primary}
                  boxSize="20px"
                  animation={`${float} 2s infinite ${i * 0.2}s`}
                />
              ))}
            </Flex>
          </VStack>
        </Box>
      </Container>
    </ScaleFade>
  );
};

export default VictoryScreen;