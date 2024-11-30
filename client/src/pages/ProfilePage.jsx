import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Box,
    Grid,
    Typography,
    Divider,
    Avatar,
    Paper,
    IconButton,
    Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";
import { UploadFile } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../contexts/SnackbarProvider";
import { useAuth } from "../contexts/AuthContext";
import { useCustomTheme } from "../contexts/ThemeProvider";
import HeaderSection from "../components/home/HeaderSection";
import Footer from "../components/home/Footer";
import ScrollToTopButton from "../components/common/ScrollToTopButton";
import { getUserProfile, updateUserProfile, changePassword } from "../services/authService";
import { uploadImage } from "../services/uploadImage";

const ProfilePage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { mode } = useCustomTheme();
    const showSnackbar = useSnackbar();
    const isDark = mode === "dark";

    const [userInfo, setUserInfo] = useState({
        username: "",
        name: "",
        email: "",
        phone: "",
        role: "",
        avatarUrl: "",
        address: "",
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserProfile();
                setUserInfo(data);
            } catch (error) {
                showSnackbar(t("profile.errorFetchData"), "error");
            }
        };
        fetchUserData();
    }, [t, showSnackbar]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
    };

    const handleProfileUpdate = async () => {
        if (imageUri) {
            userInfo.avatarUrl = imageUri;
        }
        try {
            setLoading(true);
            const data = await updateUserProfile(userInfo);
            if (data.user) {
                setUserInfo(data.user);
                showSnackbar(t("profile.successUpdate"), "success");
            } else {
                showSnackbar(data.error, "error");
            }
        } catch (error) {
            showSnackbar(t("profile.faildUpdate"), "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            showSnackbar(t("profile.fillrequired"), "error");
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            showSnackbar(t("profile.passwordNotMatch"), "error");
            return;
        }
        try {
            setLoading(true);
            await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
            showSnackbar(t("profile.changePasswordSuccess"), "success");
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            showSnackbar(t("profile.changePasswordError"), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const image = e.target.files[0];
        if (!image) return;
        try {
            setLoading(true);
            const data = await uploadImage(image, `avatars/users/${user.username}`);
            if (data.fullUrl) {
                setImageUri(data.fullUrl);
                showSnackbar(t("profile.imageUploadSuccess"), "success");
            } else {
                showSnackbar(t("profile.imageUploadError"), "error");
            }
        } catch (error) {
            showSnackbar(t("profile.imageUploadError"), "error");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Box>
            <HeaderSection />
            <Box
                sx={{
                    background: isDark
                        ? "linear-gradient(135deg, #2b2b2b, #1a1a1a)"
                        : "linear-gradient(135deg, #E0F7FA, #FFFFFF)",
                    color: "text.primary",
                    height: "350px",
                    borderRadius: "0 0 50% 50% / 0 0 15% 15%",
                    boxShadow: 6,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: "bold",
                            color: isDark ? "#FFD700" : "#4CAF50",
                        }}
                    >
                        {t("profile.title")}
                    </Typography>
                    <Typography variant="h6" sx={{ color: "text.secondary", mt: 1 }}>
                        {t("profile.subtitle")}
                    </Typography>
                </Box>
            </Box>
            <Grid container spacing={2} sx={{ px: 4, mt: -12, mb: 8, maxWidth: 'xl', mx: 'auto', }}>
                {/* Profile Header */}
                <Grid item xs={12}>
                    <Paper
                        elevation={5}
                        sx={{
                            p: 2,
                            borderRadius: 4,
                            background: isDark ? "#2b2b2b" : "#ffffff",
                        }}
                    >
                        <Grid container spacing={4}
                            sx={{
                                alignItems: "center",
                                color: isDark ? "#FFD700" : "#4CAF50",
                            }}
                        >
                            <Grid item xs={12} md={3}>
                                <Avatar
                                    src={imageUri || userInfo.avatarUrl}
                                    alt={userInfo.username}
                                    onClick={() => document.getElementById("fileInput").click()}
                                    sx={{
                                        width: 200,
                                        height: 200,
                                        mx: "auto",
                                        border: "3px solid",
                                        borderColor: isDark ? "#FFD700" : "#4CAF50",
                                        cursor: "pointer",
                                        position: "relative",
                                        "&:hover::after": {
                                            content: `"${t("profile.changeImage")}"`,
                                            alignItems: "center",
                                            display: "flex",
                                            justifyContent: "center",
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            background: "rgba(0,0,0,0.4)",
                                            color: "#fff",
                                            fontSize: "12px",
                                            textAlign: "center",
                                            borderRadius: "50%",
                                        },
                                    }}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: "none" }}
                                    id="fileInput"
                                />
                            </Grid>
                            <Grid item xs={12} md={8} >
                                <Box sx={{ position: 'relative', mt: { xs: 0, md: 10 }, textAlign: { xs: 'center', md: 'start' } }}>
                                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                        {userInfo.name}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: "text.secondary" }}>
                                        {userInfo.role}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'text.primary' }}>
                                        {userInfo.email}
                                    </Typography>
                                    <Divider sx={{ mt: 2 }} />
                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        {t("profile.profileDescription")}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                {/* Profile Information */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={5}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            background: isDark ? "#2b2b2b" : "#ffffff",
                            height: "100%",
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}
                        >
                            {t("profile.profileInformation")}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            {[
                                { label: t("profile.username"), name: "username", disabled: true },
                                { label: t("profile.name"), name: "name" },
                                { label: t("profile.email"), name: "email", disabled: true },
                                { label: t("profile.phone"), name: "phone" },
                                { label: t("profile.address"), name: "address" },
                            ].map((field) => (
                                <Grid item xs={12} key={field.name}>
                                    <TextField
                                        fullWidth
                                        label={field.label}
                                        variant="outlined"
                                        name={field.name}
                                        value={userInfo[field.name] || ""}
                                        onChange={handleInputChange}
                                        disabled={field.disabled}
                                    />
                                </Grid>
                            ))}
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                onClick={handleProfileUpdate}
                                disabled={loading}
                            >
                                {t("profile.updateProfile")}
                            </Button>
                        </Grid>
                    </Paper>
                </Grid>
                {/* Change Password */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={5}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            background: isDark ? "#2b2b2b" : "#ffffff",
                            height: "100%",
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}
                        >
                            {t("profile.changePassword")}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            {[
                                { label: t("profile.currentPassword"), name: "currentPassword", type: "password" },
                                { label: t("profile.newPassword"), name: "newPassword", type: "password" },
                                { label: t("profile.confirmPassword"), name: "confirmPassword", type: "password" },
                            ].map((field) => (
                                <Grid item xs={12} key={field.name}>
                                    <TextField
                                        fullWidth
                                        label={field.label}
                                        variant="outlined"
                                        name={field.name}
                                        type={field.type}
                                        value={passwords[field.name] || ""}
                                        onChange={handlePasswordChange}
                                    />
                                </Grid>
                            ))}
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ mt: 2 }}
                                onClick={handlePasswordUpdate}
                                disabled={loading}
                            >
                                {t("profile.changePassword")}
                            </Button>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={5}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            background: isDark ? "#2b2b2b" : "#ffffff",
                            height: "100%",
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}
                        >
                            {t("profile.deleteAccount")}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                            {t("profile.deleteAccountWarning")}
                        </Typography>
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ mt: 2 }}
                            onClick={() => showSnackbar(t("profile.deleteAccountSuccess"), "success")}
                        >
                            {t("profile.deleteAccountButton")}
                        </Button>
                    </Paper>
                </Grid>
            </Grid >
            <Footer />
            <ScrollToTopButton />
        </Box >
    );
};

export default ProfilePage;
