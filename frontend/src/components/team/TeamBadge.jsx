// components/team/TeamBadge.jsx
import React from "react";
import { Badge, HStack, Text, Box, Icon } from "@chakra-ui/react";
import { FaUsers } from "react-icons/fa6";
import { useTeamTheme } from "../../utils/TeamThemeContext";

const TeamBadge = ({
  size = "md",
  showText = true,
  variant = "solid",
  showIcon = false,
  animate = false,
}) => {
  const { colors, teamName, shadows, gradients } = useTeamTheme();

  const sizeProps = {
    sm: { fontSize: "xs", px: 2, py: 1, iconSize: "12px" },
    md: { fontSize: "sm", px: 3, py: 1, iconSize: "14px" },
    lg: { fontSize: "md", px: 4, py: 2, iconSize: "16px" },
  };

  const props = sizeProps[size];

  if (variant === "dot") {
    return (
      <HStack spacing={2}>
        <Box
          w={size === "sm" ? "8px" : size === "md" ? "12px" : "16px"}
          h={size === "sm" ? "8px" : size === "md" ? "12px" : "16px"}
          borderRadius="full"
          bg={colors.primary}
          boxShadow={animate ? shadows.glow : shadows.soft}
          animation={animate ? "glow 2s infinite" : "none"}
          sx={{
            "@keyframes glow": {
              "0%, 100%": { boxShadow: shadows.soft },
              "50%": { boxShadow: shadows.glow },
            },
          }}
        />
        {showText && (
          <Text fontSize={props.fontSize} fontWeight="medium">
            {teamName}
          </Text>
        )}
      </HStack>
    );
  }

  if (variant === "outline") {
    return (
      <Badge
        variant="outline"
        borderColor={colors.primary}
        color={colors.primary}
        fontSize={props.fontSize}
        px={props.px}
        py={props.py}
        borderRadius="full"
        fontWeight="bold"
        borderWidth="2px"
        _hover={{
          bg: colors.rgba.primary(0.1),
          transform: "translateY(-1px)",
        }}
        transition="all 0.2s"
      >
        <HStack spacing={1}>
          {showIcon && <Icon as={FaUsers} boxSize={props.iconSize} />}
          {showText && <Text>{teamName}</Text>}
        </HStack>
      </Badge>
    );
  }

  if (variant === "gradient") {
    return (
      <Box
        bg={gradients.primary}
        color="white"
        fontSize={props.fontSize}
        px={props.px}
        py={props.py}
        borderRadius="full"
        fontWeight="bold"
        boxShadow={shadows.medium}
        textShadow="0 1px 2px rgba(0,0,0,0.3)"
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: shadows.strong,
        }}
        transition="all 0.2s"
        display="inline-flex"
        alignItems="center"
        gap={1}
      >
        {showIcon && <Icon as={FaUsers} boxSize={props.iconSize} />}
        {showText && teamName}
      </Box>
    );
  }

  // Default solid variant
  return (
    <Badge
      bg={colors.primary}
      color="white"
      fontSize={props.fontSize}
      px={props.px}
      py={props.py}
      borderRadius="full"
      fontWeight="bold"
      boxShadow={shadows.soft}
      textShadow="0 1px 2px rgba(0,0,0,0.3)"
      _hover={{
        bg: colors.dark,
        transform: "translateY(-1px)",
        boxShadow: shadows.medium,
      }}
      transition="all 0.2s"
    >
      <HStack spacing={1}>
        {showIcon && <Icon as={FaUsers} boxSize={props.iconSize} />}
        {showText && <Text>{teamName}</Text>}
      </HStack>
    </Badge>
  );
};

export default TeamBadge;
