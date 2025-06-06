// Enhanced TeamThemeContext.jsx with better performance and utilities
import React, { createContext, useContext, useMemo } from "react";
import { getTeamColor, getTeamName, isValidTeamId } from "./helpers";

const TeamThemeContext = createContext();

export const useTeamTheme = () => {
  const context = useContext(TeamThemeContext);
  if (!context) {
    throw new Error("useTeamTheme must be used within TeamThemeProvider");
  }
  return context;
};

// Optimized color adjustment function
const adjustColor = (color, amount) => {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;
  
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

// Optimized hex to rgba conversion
const hexToRgba = (hex, alpha = 1) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  
  if (!result) return `rgba(0, 0, 0, ${alpha})`;
  
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
};

// Create color palette with better naming
const createColorPalette = (baseColor) => {
  const variations = [];
  for (let i = 0; i < 10; i++) {
    const lightness = -100 + (i * 22.5); // From -100 to +100
    variations.push(adjustColor(baseColor, lightness));
  }
  
  return {
    50: hexToRgba(variations[8], 0.05),
    100: hexToRgba(variations[7], 0.1),
    200: hexToRgba(variations[6], 0.2),
    300: hexToRgba(variations[5], 0.3),
    400: hexToRgba(variations[4], 0.4),
    500: baseColor,
    600: variations[3],
    700: variations[2],
    800: variations[1],
    900: variations[0],
  };
};

export const TeamThemeProvider = ({ children, teamId }) => {
  // Validate teamId
  if (!isValidTeamId(teamId)) {
    console.warn('Invalid teamId provided to TeamThemeProvider:', teamId);
  }
  
  const theme = useMemo(() => {
    const teamColor = getTeamColor(teamId);
    const teamName = getTeamName(teamId);
    const lightColor = adjustColor(teamColor, 40);
    const darkColor = adjustColor(teamColor, -40);
    const veryLightColor = adjustColor(teamColor, 80);
    const veryDarkColor = adjustColor(teamColor, -80);

    return {
      teamId,
      teamName,
      colors: {
        primary: teamColor,
        light: lightColor,
        dark: darkColor,
        veryLight: veryLightColor,
        veryDark: veryDarkColor,
        rgba: {
          primary: (alpha = 1) => hexToRgba(teamColor, alpha),
          light: (alpha = 1) => hexToRgba(lightColor, alpha),
          dark: (alpha = 1) => hexToRgba(darkColor, alpha),
          veryLight: (alpha = 1) => hexToRgba(veryLightColor, alpha),
          veryDark: (alpha = 1) => hexToRgba(veryDarkColor, alpha),
        },
      },
      gradients: {
        primary: `linear-gradient(135deg, ${teamColor}, ${lightColor})`,
        secondary: `linear-gradient(45deg, ${hexToRgba(teamColor, 0.2)}, ${hexToRgba(teamColor, 0.1)})`,
        accent: `linear-gradient(45deg, ${teamColor}, transparent, ${teamColor})`,
        card: `linear-gradient(135deg, ${hexToRgba(teamColor, 0.05)}, ${hexToRgba(teamColor, 0.15)})`,
        button: `linear-gradient(135deg, ${teamColor}, ${darkColor})`,
        hover: `linear-gradient(135deg, ${lightColor}, ${teamColor})`,
        subtle: `linear-gradient(180deg, ${hexToRgba(teamColor, 0.03)}, ${hexToRgba(teamColor, 0.08)})`,
      },
      shadows: {
        glow: `0 0 20px ${hexToRgba(teamColor, 0.4)}`,
        glowStrong: `0 0 30px ${hexToRgba(teamColor, 0.6)}`,
        soft: `0 4px 12px ${hexToRgba(teamColor, 0.2)}`,
        medium: `0 8px 25px ${hexToRgba(teamColor, 0.15)}`,
        strong: `0 12px 35px ${hexToRgba(teamColor, 0.3)}`,
        inner: `inset 0 2px 4px ${hexToRgba(teamColor, 0.1)}`,
        elevated: `0 20px 40px ${hexToRgba(teamColor, 0.1)}`,
      },
      borders: {
        primary: `2px solid ${teamColor}`,
        accent: `3px solid ${teamColor}`,
        light: `1px solid ${hexToRgba(teamColor, 0.3)}`,
        gradient: `3px solid transparent`,
        thick: `4px solid ${teamColor}`,
      },
      effects: {
        blur: 'blur(8px)',
        brightness: 'brightness(1.1)',
        contrast: 'contrast(1.1)',
        saturate: 'saturate(1.2)',
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
            boxShadow: `0 0 20px ${hexToRgba(teamColor, 0.8)}, 0 0 30px ${hexToRgba(teamColor, 0.6)}`,
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        bounce: {
          "0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0,0,0)" },
          "40%, 43%": { transform: "translate3d(0,-30px,0)" },
          "70%": { transform: "translate3d(0,-15px,0)" },
          "90%": { transform: "translate3d(0,-4px,0)" },
        },
      },
      chakraColors: createColorPalette(teamColor),
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        xxl: '24px',
        full: '9999px',
      },
    };
  }, [teamId]);

  return (
    <TeamThemeContext.Provider value={theme}>
      {children}
    </TeamThemeContext.Provider>
  );
};