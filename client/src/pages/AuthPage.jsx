import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Container,
    Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { useCustomTheme } from "../contexts/ThemeProvider";
import { useTranslation } from 'react-i18next';

const AuthPage = () => {
    const { mode, toggleTheme } = useCustomTheme();
    const isDarkMode = mode === "dark";
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                background: isDarkMode
                    ? "linear-gradient(45deg, #121212, #282828)"
                    : "linear-gradient(45deg, #e3f2fd, #bbdefb)",
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    px: { xs: 2, sm: 3 },
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    {/* Left Section */}
                    <Grid item xs={12} md={6}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems={{ xs: "center", md: "flex-start" }}
                            textAlign={{ xs: "center", md: "left" }}
                            component={motion.div}
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Typography
                                variant="h3"
                                gutterBottom
                                sx={{ color: isDarkMode ? "#ffffff" : "primary.main" }}
                            >
                                {t("app.welcome")}
                            </Typography>
                            <Typography
                                component="span"
                                variant="h3"
                                sx={{
                                    color: isDarkMode ? "#f0f0f0" : "secondary.main",
                                    fontWeight: "bold",
                                    fontFamily: "Almarai Mono",
                                }}
                            >
                                {t("app.name")}
                            </Typography>
                            <Typography
                                variant="h6"
                                align={document.documentElement.dir === "rtl" ? "right" : "left"}
                                sx={{ color: isDarkMode ? "#bbbbbb" : "text.secondary", mt: 2, fontFamily: "Quicksand" }}
                            >
                                {t("app.description")}
                            </Typography>
                            <Box mt={3}>
                                <ThemeToggleButton onClick={toggleTheme} />
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right Section with Form */}
                    <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
                        <Box
                            position="relative"
                            component={motion.div}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            sx={{ width: "100%", textAlign: "center" }}  // Center the form on smaller screens
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    width: 120,
                                    height: 120,
                                    borderRadius: "50%",
                                    background: "linear-gradient(45deg, #42a5f5, #26c6da)",
                                    top: -30,
                                    right: -60,
                                    filter: "blur(50px)",
                                    opacity: 0.6,
                                }}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    background: "linear-gradient(45deg, #42a5f5, #26c6da)",
                                    top: -70,
                                    right: 30,
                                    filter: "blur(40px)",
                                    opacity: 0.6,
                                }}
                            />

                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                            </Routes>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AuthPage;
