
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import { useCustomTheme } from "../../contexts/ThemeProvider";
import {
    Button,
    TextField,
    Typography,
    Box,
    Avatar,
    InputAdornment,
    CircularProgress,
    IconButton,
    useTheme,
    useMediaQuery,
    Container,
    Paper,
} from "@mui/material";
import { Email, LockOutlined, Visibility, VisibilityOff, Person } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { useClinicContext } from "../../contexts/ClinicContext";

const Login = () => {
    const { mode } = useCustomTheme();
    const { t, i18n } = useTranslation();
    const { clinicInfo } = useClinicContext();
    const isDarkMode = mode === "dark";
    const { login, error } = useAuth();
    const [formData, setFormData] = useState({ identifier: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const showSnackbar = useSnackbar();
    const navigate = useNavigate();
    const isArabic = i18n.language === "ar";
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    document.title = "HSC | Login";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.identifier || !formData.password) {
            showSnackbar(isArabic ? "جميع الحقول مطلوبة" : "All fields are required", "error");
            return;
        }
        setLoading(true);
        try {
            const user = await login(formData);
            if (!user) {
                showSnackbar(isArabic ? "اسم المستخدم او كلمة المرور غير صحيحة" : "Invalid credentials", "error");
                return;
            }
            showSnackbar(isArabic ? "تم تسجيل الدخول بنجاح" : "Login successful", "success");
            navigate('/');
        } catch (err) {
            showSnackbar(error || (isArabic ? "فشل تسجيل الدخول" : "Login failed"), "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: isDarkMode ? 'rgba(18, 18, 18, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isDarkMode ? "#42a5f5" : "#007bb5"}`,
                }}
            >
                <Avatar
                    src={isDarkMode ? clinicInfo?.logo.dark : clinicInfo?.logo.light}
                    alt="Clinic Logo"
                    sx={{
                        width: 80,
                        height: 80,
                        mb: 2,
                        border: `2px solid ${isDarkMode ? "#42a5f5" : "#1976d2"}`,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                            transform: "scale(1.05)",
                        },
                    }}
                />

                <Typography
                    variant={isMobile ? "h5" : "h4"}
                    sx={{
                        mb: 4,
                        fontWeight: "bold",
                        color: isDarkMode ? "#90caf9" : "#1976d2",
                        textAlign: "center",
                    }}
                >
                    {t("auth.welcome")}
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        label={t("auth.identifier")}
                        name="identifier"
                        type="text"
                        fullWidth
                        required
                        value={formData.identifier}
                        onChange={handleChange}
                        sx={{ mb: 2, ch: 1 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person sx={{ color: isDarkMode ? "#90caf9" : "#1976d2" }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        label={t("auth.password")}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        required
                        value={formData.password}
                        onChange={handleChange}
                        sx={{ mb: 2, ch: 1 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="end">
                                    <LockOutlined sx={{ color: isDarkMode ? "#90caf9" : "#1976d2" }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="start">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: isDarkMode ? "#90caf9" : "#1976d2" }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{
                            mt: 2,
                            mb: 3,
                            py: 1.5,
                            borderRadius: 2,
                            fontSize: "1rem",
                            textTransform: "none",
                            backgroundColor: isDarkMode ? "#42a5f5" : "#1976d2",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                backgroundColor: isDarkMode ? "#1e88e5" : "#1565c0",
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                            },
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            t("auth.login")
                        )}
                    </Button>
                </form>

                <Typography
                    variant="body2"
                    align="center"
                    sx={{
                        color: isDarkMode ? "#90caf9" : "#1976d2",
                        mt: 2,
                    }}
                >
                    {t("auth.notRegistered")}{" "}
                    <Link
                        to="/auth/register"
                        style={{
                            textDecoration: "none",
                            color: isDarkMode ? "#f48fb1" : "#c2185b",
                            fontWeight: "bold",
                            transition: "color 0.3s ease",
                        }}
                    >
                        {t("auth.registerNow")}
                    </Link>
                </Typography>

                <Box sx={{ mt: 3 }}>
                    <Button
                        variant="text"
                        onClick={() => navigate("/")}
                        sx={{
                            color: isDarkMode ? "#90caf9" : "#1976d2",
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "transparent",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        {isArabic ? "الرجوع إلى الصفحة الرئيسية" : "Back to Home"}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
