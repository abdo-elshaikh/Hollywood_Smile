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
    const backgroundColor = isDarkMode ? "#333" : "#f0f0f0";
    const circleColor = isDarkMode ? "#fff" : "#000";
    const iconColor = isDarkMode ? "#000" : "#fff";

    return (
        <Box
            onClick={toggleMode}
            sx={{
                position: "relative",
                width: 70,
                height: 35,
                borderRadius: "20px",
                backgroundColor: backgroundColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                boxShadow: isDarkMode ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "0 4px 10px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                    backgroundColor: isDarkMode ? "#444" : "#e0e0e0",
                },
            }}
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {/* Toggle Circle with Motion Effect */}
            <motion.div
                animate={{ left: isDarkMode ? "5px" : "calc(100% - 30px)" }} // Motion animation for sliding
                transition={{ type: "spring", stiffness: 500, damping: 30 }} // Spring effect for smooth motion
                style={{
                    position: "absolute",
                    top: "50%",
                    width: 30,
                    height: 30,
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
                        left: isDarkMode ? "10px" : "calc(100% - 36px)",
                        transform: "translateY(-50%)",
                        color: iconColor,
                        pointerEvents: "none",
                        transition: "color 0.2s ease",
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