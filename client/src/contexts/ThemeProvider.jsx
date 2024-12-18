import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import axiosInstance from "../services/axiosInstance";
import { arEG, enUS } from "@mui/material/locale";
import { useTranslation } from "react-i18next";
import CssBaseline from "@mui/material/CssBaseline";


// Default theme colors
const defaultLightColors = {
  primary: "#1976d2",
  secondary: "#FAB12F",
  text: "#0D1321",
  title: "#2F89FC",
  background: "#F7F9FC",
  border: "#E3F2FD",
  shadow: "#E3F2FD",
  subtitle: "#575C66",
  default: "#f5f5f5",
  paper: "#FFFFFF",
};

const defaultDarkColors = {
  primary: "#1976d2",
  secondary: "#5F8487",
  text: "#E3F2FD",
  title: "#E3F2FD",
  background: "#31363F",
  border: "#2F89FC",
  shadow: "#2F89FC",
  subtitle: "#E3F2FD",
  default: "#222831",
  paper: "#333940",
};

// Theme context
const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  // Initialize theme settings from localStorage or use defaults
  const localThemeSettings = JSON.parse(localStorage.getItem("themeSettings") || "{}");
  const initialMode = localThemeSettings.mode || "light";
  const initialColors = localThemeSettings.colors || (initialMode === "light" ? defaultLightColors : defaultDarkColors);

  const [mode, setMode] = useState(initialMode);
  const [colors, setColors] = useState(initialColors);
  const [lightModeColors, setLightModeColors] = useState(defaultLightColors);
  const [darkModeColors, setDarkModeColors] = useState(defaultDarkColors);

  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Fetch theme colors from the backend
  const initializeColors = async () => {
    try {
      const [lightRes, darkRes] = await Promise.all([
        axiosInstance.get("/theme/light"),
        axiosInstance.get("/theme/dark"),
      ]);
      setLightModeColors(lightRes.data.colors || defaultLightColors);
      setDarkModeColors(darkRes.data.colors || defaultDarkColors);
      setColors(mode === "light" ? lightRes.data.colors : darkRes.data.colors);
    } catch (error) {
      console.error("Error fetching theme colors:", error);
      // Fallback to default colors
      setLightModeColors(defaultLightColors);
      setDarkModeColors(defaultDarkColors);
    }
  };

  // Update colors in the backend
  const updateColors = async (newColors) => {
    try {
      const res = await axiosInstance.put(`/theme/${mode}`, newColors);
      setColors(res.data.colors || newColors);
    } catch (error) {
      console.error("Error updating theme colors:", error);
    }
  };

  // Toggle between light and dark modes
  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    setColors(newMode === "light" ? lightModeColors : darkModeColors);
  };

  // Persist theme settings in localStorage
  useEffect(() => {
    localStorage.setItem("themeSettings", JSON.stringify({ mode, colors }));
  }, [mode, colors]);

  // Fetch colors on component mount
  useEffect(() => {
    initializeColors();
  }, []);

  // Create the MUI theme
  const theme = useMemo(
    () =>
      createTheme(
        {
          palette: {
            mode,
            primary: { main: colors.primary },
            secondary: { main: colors.secondary },
            text: { primary: colors.text },
            title: { main: colors.title },
            subtitle: { main: colors.subtitle },
            background: { default: colors.background, paper: colors.paper },
          },
          typography: {
            h1: { color: colors.title },
            subtitle1: { color: colors.subtitle },
            subtitle2: { color: colors.subtitle },
            body1: { color: colors.text },
            body2: { color: colors.text },
          },
          components: {
            MuiCard: {
              styleOverrides: {
                root: {
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  boxShadow: `0px 2px 4px ${colors.shadow}`,
                  borderRadius: 8,
                  color: colors.text,
                  direction: isArabic ? "rtl" : "ltr",
                },
              },
            },
          },
          shape: {
            borderRadius: 8,

          },
          direction: isArabic ? "rtl" : "ltr",
          locale: isArabic ? arEG : enUS,
        },
        isArabic ? arEG : enUS
      ),
    [mode, colors, isArabic]
  );

  const contextValue = useMemo(
    () => ({
      mode,
      toggleMode,
      updateColors,
      colors,
      resetTheme: () => {
        setMode("light");
        setColors(defaultLightColors);
        setLightModeColors(defaultLightColors);
        setDarkModeColors(defaultDarkColors);
        localStorage.removeItem("themeSettings");
      },
    }),
    [mode, colors]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {/* <div dir={isArabic ? "rtl" : "ltr"}>{children}</div> */}
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useCustomTheme = () => useContext(ThemeContext);
