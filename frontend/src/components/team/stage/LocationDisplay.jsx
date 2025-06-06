// components/stage/LocationDisplay.jsx
import React from "react";
import {
  Box,
  Image,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaLocationDot } from "react-icons/fa6";
import { useTeamTheme } from "../../../utils/TeamThemeContext";

const LocationDisplay = ({ locationImage }) => {
  const { colors, shadows, borders } = useTeamTheme();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue(
    colors.rgba.primary(0.3),
    colors.rgba.primary(0.6)
  );

  if (!locationImage) return null;

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
          <Icon as={FaLocationDot} color={colors.primary} boxSize="24px" />
          <Text fontSize="lg" fontWeight="semibold" color={colors.primary}>
            Find This Location
          </Text>
        </HStack>

        <Box
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
          border="2px solid"
          borderColor={borderColor}
          transition="transform 0.2s"
          _hover={{ transform: "scale(1.02)" }}
        >
          <Image
            src={`data:image/png;base64,${locationImage}`}
            maxW="400px"
            w="100%"
            alt="Location to find"
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default LocationDisplay;