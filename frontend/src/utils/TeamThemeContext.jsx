// contexts/TeamThemeContext.jsx
import React, { createContext, useContext } from "react";
import { getStageColor, getTeamName } from "./stageNames";

const TeamThemeContext = createContext();
console.log("TeamThemeContext created:", TeamThemeContext);

export const useTeamTheme = () => {
  const context = useContext(TeamThemeContext);
  console.log("useTeamTheme context:", context);
  if (!context) {
    throw new Error("useTeamTheme must be used within TeamThemeProvider");
  }
  return context;
};

// Helper function to lighten/darken colors
const adjustColor = (color, amount) => {
  const usePound = color[0] === "#";
  const col = usePound ? color.slice(1) : color;
  const num = parseInt(col, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;
  r = r > 255 ? 255 : r < 0 ? 0 : r;
  g = g > 255 ? 255 : g < 0 ? 0 : g;
  b = b > 255 ? 255 : b < 0 ? 0 : b;
  return (
    (usePound ? "#" : "") +
    ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")
  );
};

// Convert hex to rgba
const hexToRgba = (hex, alpha = 1) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0, 0, 0, ${alpha})`;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const TeamThemeProvider = ({ children, teamId }) => {
  const teamColor = getStageColor(teamId);
  const teamName = getTeamName(teamId);

  // Generate color variations
  const lightColor = adjustColor(teamColor, 40);
  const darkColor = adjustColor(teamColor, -40);

  const theme = {
    teamId,
    teamName,
    colors: {
      primary: teamColor,
      light: lightColor,
      dark: darkColor,
      rgba: {
        primary: (alpha = 1) => hexToRgba(teamColor, alpha),
        light: (alpha = 1) => hexToRgba(lightColor, alpha),
        dark: (alpha = 1) => hexToRgba(darkColor, alpha),
      },
    },
    gradients: {
      primary: `linear-gradient(to right, ${teamColor}, ${lightColor})`,
      secondary: `linear-gradient(to bottom right, ${hexToRgba(
        teamColor,
        0.2
      )}, ${hexToRgba(teamColor, 0.1)})`,
      accent: `linear-gradient(45deg, ${teamColor}, transparent, ${teamColor})`,
      card: `linear-gradient(135deg, ${hexToRgba(teamColor, 0.05)}, ${hexToRgba(
        teamColor,
        0.15
      )})`,
      button: `linear-gradient(to bottom, ${teamColor}, ${darkColor})`,
    },
    shadows: {
      glow: `0 0 20px ${hexToRgba(teamColor, 0.4)}`,
      soft: `0 4px 12px ${hexToRgba(teamColor, 0.2)}`,
      medium: `0 8px 25px ${hexToRgba(teamColor, 0.15)}`,
      strong: `0 12px 35px ${hexToRgba(teamColor, 0.3)}`,
      inner: `inset 0 2px 4px ${hexToRgba(teamColor, 0.1)}`,
    },
    borders: {
      primary: `2px solid ${teamColor}`,
      accent: `3px solid ${teamColor}`,
      light: `1px solid ${hexToRgba(teamColor, 0.3)}`,
      gradient: `3px solid transparent`,
    },
    animations: {
      pulse: {
        "0%": {
          transform: "scale(1)",
          boxShadow: `0 0 0 0 ${hexToRgba(teamColor, 0.7)}`,
        },
        "70%": {
          transform: "scale(1.05)",
          boxShadow: `0 0 0 10px ${hexToRgba(teamColor, 0)}`,
        },
        "100%": {
          transform: "scale(1)",
          boxShadow: `0 0 0 0 ${hexToRgba(teamColor, 0)}`,
        },
      },
      glow: {
        "0%, 100%": {
          boxShadow: `0 0 5px ${hexToRgba(teamColor, 0.5)}`,
        },
        "50%": {
          boxShadow: `0 0 20px ${hexToRgba(
            teamColor,
            0.8
          )}, 0 0 30px ${hexToRgba(teamColor, 0.6)}`,
        },
      },
    },
    chakraColors: {
      // For Chakra UI components
      50: hexToRgba(teamColor, 0.05),
      100: hexToRgba(teamColor, 0.1),
      200: hexToRgba(teamColor, 0.2),
      300: hexToRgba(teamColor, 0.3),
      400: hexToRgba(teamColor, 0.4),
      500: teamColor,
      600: darkColor,
      700: adjustColor(teamColor, -60),
      800: adjustColor(teamColor, -80),
      900: adjustColor(teamColor, -100),
    },
  };

  return (
    <TeamThemeContext.Provider value={theme}>
      {children}
    </TeamThemeContext.Provider>
  );
};
