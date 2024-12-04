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
    FormControlLabel,
    Checkbox,
    InputAdornment,
} from "@mui/material";
import { Email, LockOutlined, Visibility, VisibilityOff, Person } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { useClinicContext } from "../../contexts/ClinicContext";

const Login = () => {
    const { mode: themeMode } = useCustomTheme();
    const { t, i18n } = useTranslation();
    const { clinicInfo } = useClinicContext();
    const isDarkMode = themeMode === "dark";
    const { login, error } = useAuth();
    const [formData, setFormData] = useState({ identifier: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const showSnackbar = useSnackbar();
    const navigate = useNavigate();
    document.title = "HSC | Login";
    const isArabic = i18n.language === "ar";

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(formData, rememberMe);
            if (!user) {
                showSnackbar(isArabic? "اسم المستخدم او كلمة المرور غير صحيحة" : "Invalid username or password", "error");
                return;
            }
            showSnackbar(isArabic? "تم تسجيل الدخول بنجاح" : "Login successful", "success");
            navigate('/');
        } catch (err) {
            showSnackbar(error || isArabic? "فشل تسجيل الدخول" : "Login failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            sx={{
                textAlign: "center",
                p: 4,
                backgroundColor: "background.paper",
                borderRadius: 4,
                boxShadow: isDarkMode ? "0px 0px 20px 5px rgba(66, 165, 245, 0.2)" : "0px 0px 20px 5px rgba(0, 123, 181, 0.2)",
                maxWidth: '500px',
                mx: "auto",
                mb: 4,
                border: `1px solid ${isDarkMode ? "#42a5f5" : "#007bb5"}`,
                color: isDarkMode ? "#90caf9" : "#007bb5",
            }}
        >
            <Avatar
                src={isDarkMode ? clinicInfo?.logo.dark : clinicInfo?.logo.light}
                alt="Clinic Logo"
                sx={{
                    width: 80,
                    height: 80,
                    mb: 2,
                    border: `2px solid ${isDarkMode ? "#42a5f5" : "#007bb5"}`,
                }}
                component={motion.div}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            />
            <Typography
                variant="h4"
                sx={{
                    mb: 3,
                    fontWeight: "bold",
                    color: isDarkMode ? "#90caf9" : "#007bb5",
                }}
            >
                {t("auth.welcome")}
            </Typography>
            <Typography
                align={isArabic ? "right" : "left"}
                variant="body1"
                sx={{ color: isDarkMode ? "#90caf9" : "#007bb5", mt: 2, mb: 2 }}>
                {t("auth.notRegistered")} {' '}
                <Link to="/auth/register" style={{ textDecoration: "none", fontWeight: "bold", color: '#C96868' }}>
                    {t("auth.registerNow")}
                </Link>
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    label={`${t("auth.email")} ${t("auth.or")} ${t("auth.username")}`}
                    name="identifier"
                    type="text"
                    fullWidth
                    required
                    autoComplete="username"
                    value={formData.identifier}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Person sx={{ color: isDarkMode ? "#90caf9" : "#007bb5" }} />
                            </InputAdornment>
                        ),
                    }}
                    helperText={formData.identifier && formData.identifier.length < 3 ? t("auth.enterValid") : ""}
                    error={formData.identifier && formData.identifier.length < 3}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label={t("auth.password")}
                    name="password"
                    autoComplete="password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    required
                    value={formData.password}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockOutlined sx={{ color: isDarkMode ? "#90caf9" : "#007bb5" }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <Box onClick={togglePasswordVisibility} sx={{ cursor: "pointer" }}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </Box>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 2 }}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            sx={{ color: isDarkMode ? "#90caf9" : "#007bb5" }}
                        />
                    }
                    label={t("auth.rememberMe")}
                    sx={{ color: isDarkMode ? "#90caf9" : "#007bb5", display: 'flex' }}
                />



                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                        mt: 2,
                        py: 1.5,
                        borderRadius: 3,
                        fontSize: "1rem",
                        textTransform: "none",
                        backgroundColor: isDarkMode ? "#42a5f5" : "#007bb5",
                        "&:hover": {
                            backgroundColor: isDarkMode ? "#1e88e5" : "#005f7f",
                        },
                    }}
                    disabled={loading}
                >
                    {loading ? t("common.loading") : t("auth.login")}
                </Button>
            </form>



            <Typography variant="body2" sx={{ mt: 2, color: isDarkMode ? "#e0f7fa" : "#007bb5" }}>
                <Button variant="text" onClick={() => navigate("/")} style={{ textDecoration: "none", color: isDarkMode ? "#90caf9" : "#007bb5" }}>
                    {isArabic ? "الرجوع إلى الصفحة الرئيسية" : "Back to Home"}
                </Button>
            </Typography>
        </Box>
    );
};

export default Login;
