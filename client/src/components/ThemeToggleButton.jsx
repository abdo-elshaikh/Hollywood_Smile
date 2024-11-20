import React from "react";
import { IconButton, Box, Tooltip } from "@mui/material";
import { useCustomTheme } from "../contexts/ThemeProvider";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { motion } from "framer-motion"; // Import Framer Motion

const ThemeToggleButton = () => {
    const { mode, toggleMode } = useCustomTheme();

    // Determine colors based on theme
    const isDarkMode = mode === "dark";
    const backgroundColor = isDarkMode ? "#444" : "#eee";
    const circleColor = isDarkMode ? "#f5f5f5" : "#333";
    const iconColor = isDarkMode ? "#333" : "#f5f5f5";

    return (
        <Box
            onClick={toggleMode}
            sx={{
                position: "relative",
                width: 60,
                height: 30,
                borderRadius: "20px",
                backgroundColor: backgroundColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                boxShadow: isDarkMode ? "0 4px 12px rgba(255, 255, 255, 0.1)" : "0 4px 12px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                    backgroundColor: isDarkMode ? "#555" : "#ddd",
                },
            }}
        >
            {/* Toggle Circle with Motion Effect */}
            <motion.div
                animate={{ left: isDarkMode ? "4px" : "calc(100% - 28px)" }} // Motion animation for sliding
                transition={{ type: "spring", stiffness: 500, damping: 30 }} // Spring effect for smooth motion
                style={{
                    position: "absolute",
                    top: "50%",
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    backgroundColor: circleColor,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                    transform: "translateY(-50%)",
                }}
            />

            {/* Theme Icon with Smooth Transition */}
            <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                <IconButton
                    size="small"
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: isDarkMode ? "8px" : "calc(100% - 34px)",
                        transform: "translateY(-50%)",
                        color: iconColor,
                        pointerEvents: "none",
                    }}
                >
                    {isDarkMode ? (
                        <LightModeOutlinedIcon fontSize="small" />
                    ) : (
                        <DarkModeOutlinedIcon fontSize="small" />
                    )}
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default ThemeToggleButton;
