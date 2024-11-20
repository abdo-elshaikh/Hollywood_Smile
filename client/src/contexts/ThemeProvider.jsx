import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

// Define light and dark colors
const lightColors = {
  primary: "#1976d2",
  secondary: "#FAB12F",
  text: "#0D1321",
  title: "#2F89FC",
  background: "#F7F9FC",
  border: "#E3F2FD",
  shadow: "#E3F2FD",
  subtitle: "#575C66",
  default: '#f5f5f5'
};

const darkColors = {
  primary: "#1976d2",
  secondary: "#5F8487",
  text: "#E3F2FD",
  title: "#E3F2FD",
  background: "#31363F",
  border: "#2F89FC",
  shadow: "#2F89FC",
  subtitle: "#E3F2FD",
  default: '#222831'
};

// Create a context for theme management
const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  // Load initial theme settings from localStorage if available
  const localThemeSettings = JSON.parse(localStorage.getItem("themeSettings") || '{}');
  const initialMode = localThemeSettings.mode || "light";
  const initialColors = initialMode === "light" ? lightColors : darkColors;

  const [mode, setMode] = useState(initialMode);
  const [colors, setColors] = useState(localThemeSettings.colors || initialColors);

  // Color state management for light and dark modes
  const [lightModeColors, setLightModeColors] = useState(lightColors);
  const [darkModeColors, setDarkModeColors] = useState(darkColors);

  // Toggle between light and dark modes
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Update the active color palette whenever the mode changes
  useEffect(() => {
    setColors(mode === "light" ? lightModeColors : darkModeColors);
  }, [mode, lightModeColors, darkModeColors]);

  // Persist theme settings to localStorage when mode or colors change
  useEffect(() => {
    localStorage.setItem("themeSettings", JSON.stringify({ colors, mode }));
  }, [colors, mode]);

  // Function to update color palette for the current mode
  const updateColors = (newColors) => {
    if (mode === "light") {
      setLightModeColors(newColors);
    } else {
      setDarkModeColors(newColors);
    }
    setColors(newColors);
  };

  // Reset to initial theme settings
  const resetTheme = () => {
    setMode("light");
    setColors(lightColors);
    setLightModeColors(lightColors);
    setDarkModeColors(darkColors);
    localStorage.removeItem("themeSettings");
  };

  // Memoized MUI theme configuration based on active colors
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: colors.primary },
          secondary: { main: colors.secondary },
          text: { primary: colors.text },
          background: { default: colors.background },
        },
        typography: {
          h1: { color: colors.title },
          subtitle1: { color: colors.subtitle },
          subtitle2: { color: colors.subtitle },
          text: { color: colors.text },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: `0 4px 10px ${colors.shadow}`,
                border: `1px solid ${colors.border}`,
              },
            },
          },
        },
      }),
    [mode, colors]
  );

  const contextValue = useMemo(
    () => ({ mode, toggleMode, updateColors, colors, resetTheme }),
    [mode, colors]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useCustomTheme = () => useContext(ThemeContext);
