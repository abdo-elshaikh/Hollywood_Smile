
import React from "react";
import { Routes, Route } from "react-router-dom";
import {
    Box,
    Typography,
    Container,
    Grid,
    useMediaQuery,
    useTheme,
    Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { useCustomTheme } from "../contexts/ThemeProvider";
import { useTranslation } from 'react-i18next';

const AuthPage = () => {
    const { mode } = useCustomTheme();
    const isDarkMode = mode === "dark";
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <Box
            component={motion.div}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.6 }}
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
                background: isDarkMode ? 'linear-gradient(45deg, #424242, #212121)' : 'linear-gradient(45deg, #f5f5f5, #eeeeee)',
            }}
        >
           
            {/* Animated background elements */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0.1,
                    background: `repeating-linear-gradient(
                        45deg,
                        ${isDarkMode ? '#ffffff' : '#000000'} 0px,
                        ${isDarkMode ? '#ffffff' : '#000000'} 1px,
                        transparent 1px,
                        transparent 10px
                    )`,
                }}
            />
            <Container maxWidth="lg">
                <Grid
                    container
                    spacing={4}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ minHeight: '100vh', py: 4 }}
                >
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: { xs: 'center', md: isArabic ? 'flex-end' : 'flex-start' },
                            textAlign: { xs: 'center', md: isArabic ? 'right' : 'left' },
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <Typography
                                variant={isMobile ? "h4" : "h3"}
                                gutterBottom
                                sx={{
                                    color: isDarkMode ? "#fff" : "#1976d2",
                                    fontWeight: 700,
                                    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                                    mb: 2,
                                    fontFamily: "Almarai, sans-serif",
                                }}
                            >
                                {t("app.welcome")}
                            </Typography>
                            <Divider sx={{ width: '50%', my: 3}} />
                            <Typography
                                variant={isMobile ? "h4" : "h3"}
                                sx={{
                                    color: isDarkMode ? "#90caf9" : "#0d47a1",
                                    fontWeight: 700,
                                    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                                    mb: 3,
                                    fontFamily: "Almarai, sans-serif",
                                }}
                            >
                                {t("app.name")}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: isDarkMode ? "#bbdefb" : "#1565c0",
                                    maxWidth: "600px",
                                    lineHeight: 1.6,
                                    display: { xs: "none", md: "block" },
                                    fontFamily: "Quicksand, sans-serif",
                                    mb: 4,
                                }}
                            >
                                {t("app.description")}
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <ThemeToggleButton />
                            </Box>
                        </motion.div>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            order: { xs: 1, md: 2 },
                            position: "relative",
                            zIndex: 1
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <Box
                                sx={{
                                    position: "relative",
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: -20,
                                        right: -20,
                                        width: 150,
                                        height: 150,
                                        background: "linear-gradient(45deg, #42a5f5, #1976d2)",
                                        borderRadius: "50%",
                                        filter: "blur(40px)",
                                        opacity: 0.3,
                                    },
                                    "&::after": {
                                        content: '""',
                                        position: "absolute",
                                        bottom: -20,
                                        left: -20,
                                        width: 100,
                                        height: 100,
                                        background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                                        borderRadius: "50%",
                                        filter: "blur(30px)",
                                        opacity: 0.3,
                                    },
                                }}
                            >
                                <Routes>
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                </Routes>
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AuthPage;
