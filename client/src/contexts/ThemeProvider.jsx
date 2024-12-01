import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import axiosInstance from "../services/axiosInstance";

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
  const localThemeSettings = JSON.parse(localStorage.getItem("themeSettings") || '{}');
  const initialMode = localThemeSettings.mode || "light";
  const initialColors = localThemeSettings.colors || (initialMode === "light" ? lightColors : darkColors);

  const [mode, setMode] = useState(initialMode);
  const [colors, setColors] = useState(initialColors);
  const [lightModeColors, setLightModeColors] = useState(lightColors);
  const [darkModeColors, setDarkModeColors] = useState(darkColors);

  const fetchColors = async (mode) => {
    try {
      const res = await axiosInstance.get(`/theme/${mode}`);
      const data = res.data.colors;
      if (data) {
        mode === "light" ? setLightModeColors(data) : setDarkModeColors(data);
      } else {
        const defaultColors = mode === "light" ? lightColors : darkColors;
        mode === "light" ? setLightModeColors(defaultColors) : setDarkModeColors(defaultColors);
        await axiosInstance.post(`/theme/${mode}`, defaultColors);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchColors("light");
    fetchColors("dark");
  }, []);

  const updateColors = async (newColors) => {
    try {
      const res = await axiosInstance.put(`/theme/${mode}`, newColors);
      const data = res.data.colors;
      setColors(data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    setColors(newMode === "light" ? lightModeColors : darkModeColors);
  };

  useEffect(() => {
    localStorage.setItem("themeSettings", JSON.stringify({ colors, mode }));
  }, [colors, mode]);

  const theme = useMemo(() => createTheme({
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
  }), [mode, colors]);

  const contextValue = useMemo(() => ({
    mode,
    toggleMode,
    updateColors,
    colors,
    resetTheme: () => {
      setMode("light");
      setColors(lightColors);
      setLightModeColors(lightColors);
      setDarkModeColors(darkColors);
      localStorage.removeItem("themeSettings");
    }
  }), [mode, colors]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useCustomTheme = () => useContext(ThemeContext);
