// components/stage/StageHeader.jsx
import React from "react";
import {
  Box,
  Heading,
  Badge,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useTeamTheme } from "../../../utils/TeamThemeContext";
import { getStageName } from "../../../utils/helpers";

const StageHeader = ({ stage }) => {
  const { colors } = useTeamTheme();

  return (
    <Box textAlign="center">
      <HStack justify="center" spacing={3} mb={3}>
        <Badge
          bg={colors.primary}
          color="white"
          fontSize="md"
          px={4}
          py={2}
          borderRadius="full"
          boxShadow="md"
        >
          Stage {stage.stageNumber}
        </Badge>
      </HStack>
      <Heading
        size="xl"
        fontWeight="bold"
        bgGradient={`linear(to-r, ${colors.primary}, ${colors.light})`}
        bgClip="text"
        textShadow="2px 2px 4px rgba(0,0,0,0.1)"
      >
        {getStageName(stage.stageNumber)}
      </Heading>
    </Box>
  );
};

export default StageHeader;