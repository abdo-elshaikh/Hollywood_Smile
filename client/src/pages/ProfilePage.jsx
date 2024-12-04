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
    CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { UploadFile } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../contexts/SnackbarProvider";
import { useAuth } from "../contexts/AuthContext";
import { useCustomTheme } from "../contexts/ThemeProvider";
import HeaderSection from "../components/home/HeaderSection";
import Footer from "../components/home/Footer";
import ScrollToTopButton from "../components/common/ScrollToTopButton";
import { deleteUser } from "../services/userService";
import { uploadFile, replaceFile } from "../services/supabaseService";
import ConfirmationDialog from "../components/common/ConfirmationDialog";

const ProfilePage = () => {
    const { t } = useTranslation();
    const { user, logout, fetchUserProfile, changeUserPassword, EditUserProfile } = useAuth();
    const { mode } = useCustomTheme();
    const showSnackbar = useSnackbar();
    const isDark = mode === "dark";

    const [userInfo, setUserInfo] = useState({
        name: "",
        username: "",
        email: "",
        phone: "",
        avatarUrl: "",
        address: "",
        role: "",
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [passwordsFields, setPasswordsFields] = useState([
        { label: t("profile.currentPassword"), name: "currentPassword", type: "password" },
        { label: t("profile.newPassword"), name: "newPassword", type: "password" },
        { label: t("profile.confirmPassword"), name: "confirmPassword", type: "password" },
    ]);

    const [loading, setLoading] = useState(false);
    const [uplodingImage, setUploadingImage] = useState(false);
    const [imageUri, setImageUri] = useState('');
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [changePasswordState, setChangePasswordState] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        fetchUserProfile().then((user) => {
            setUserInfo(user);
        }).catch((error) => {
            showSnackbar(t("profile.fetchError"), "error");
        });
    };

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
        setLoading(true);
        EditUserProfile(userInfo).then((user) => {
            setUserInfo(user);
            showSnackbar(t("profile.successUpdate"), "success");
        }).catch((error) => {
            showSnackbar(t("profile.faildUpdate"), "error");
        }).finally(() => {
            setLoading(false);
        });
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
        setLoading(true);
        changeUserPassword(passwords.currentPassword, passwords.newPassword).then((data) => {
            if (data.error) {
                showSnackbar(data.error, "error");
                return;
            }
            showSnackbar(t("profile.changePasswordSuccess"), "success");
            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setChangePasswordState(true);
        }).catch((error) => {
            showSnackbar(t("profile.changePasswordError"), "error");
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        if (changePasswordState) {
            setTimeout(() => {
                setChangePasswordState(false);
                logout();
            }, 5000);
        }
    }, [changePasswordState]);

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const image = e.target.files ? e.target.files[0] : null;
        if (!image) return;

        const fileName = userInfo?._id;
        setUploadingImage(true);
        try {
            const data = await uploadFile(image, `avatars/${userInfo?.username}`, fileName);
            console.log("Image uploaded:", data);
            if (data?.fullUrl) {
                setImageUri(data.fullUrl);
                showSnackbar(t("profile.imageUploadSuccess"), "success");
                const saveButton = document.getElementById("saveButton");
                if (saveButton) {
                    saveButton.click();
                }
            } else {
                showSnackbar(t("profile.imageUploadError"), "error");
            }
        } catch (error) {
            showSnackbar(t("profile.imageUploadError"), "error");
            console.error("Error uploading image:", error);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            setLoading(true);
            await deleteUser(user._id);
            showSnackbar(t("profile.deleteAccountSuccess"), "success");
            logout();
        } catch (error) {
            showSnackbar(t("profile.deleteAccountError"), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleShowPassword = (failed) => {
        setPasswordsFields(
            passwordsFields.map((field) => {
                if (field.name === failed) {
                    field.type = field.type === "password" ? "text" : "password";
                }
                return field;
            })
        );
    };

    return (
        <>
            <HeaderSection />
            <Box
                sx={{
                    background: isDark
                        ? "linear-gradient(135deg, #2b2b2b, #1a1a1a)"
                        : "linear-gradient(135deg, #E0F7FA, #FFFFFF)",
                    color: "text.primary",
                    minHeight: "100vh",
                    position: "relative",
                }}
            >
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
                                    {uplodingImage ? (
                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <CircularProgress size={120} />
                                            <Typography variant="body1" sx={{ mt: 2 }}>
                                                {t("profile.uploadingImage")}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                                            <Avatar
                                                src={imageUri || userInfo?.avatarUrl}
                                                alt={userInfo?.name}
                                                onClick={() => document.getElementById("fileInput").click()}
                                                sx={{
                                                    width: 180,
                                                    height: 180,
                                                    border: 4,
                                                    borderColor: isDark ? "#FFD700" : "#4CAF50",
                                                    objectFit: "cover",
                                                    cursor: "pointer",
                                                    transition: "all 0.3s ease",
                                                    "&:hover": {
                                                        scale: 1.03,
                                                        transition: "all 0.3s ease",
                                                        "::before": {
                                                            content: "'Upload'",
                                                            position: "absolute",
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            borderRadius: "50%",
                                                            backgroundColor: "rgba(0,0,0,0.5)",
                                                        },
                                                    },

                                                }}
                                            />
                                        </Box>
                                    )}
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
                                            {userInfo?.name}
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: "text.secondary" }}>
                                            {userInfo?.role}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.primary' }}>
                                            {userInfo?.email}
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
                                    { label: t("profile.email"), name: "email", disabled: true },
                                    { label: t("profile.name"), name: "name" },
                                    { label: t("profile.phone"), name: "phone" },
                                    { label: t("profile.address"), name: "address" },
                                ].map((field) => (
                                    <Grid item xs={12} key={field.name}>
                                        <TextField
                                            fullWidth
                                            label={field.label}
                                            variant="outlined"
                                            name={field.name}
                                            value={userInfo[field.name] ? userInfo[field.name] : ""}
                                            onChange={handleInputChange}
                                            disabled={field.disabled}
                                        />
                                    </Grid>
                                ))}
                                <Button
                                    id="saveButton"
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
                                {passwordsFields.map((field) => (
                                    <Grid item xs={12} key={field.name}>
                                        <TextField
                                            fullWidth
                                            id={field.name}
                                            label={field.label}
                                            variant="outlined"
                                            name={field.name}
                                            type={field.type}
                                            value={passwords[field.name] || ""}
                                            onChange={handlePasswordChange}
                                            disabled={loading}
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton
                                                        onClick={() => handleShowPassword(field.name)}
                                                        edge="end"
                                                    >
                                                        {field.type === "password" ? (
                                                            <VisibilityOffIcon sx={{ color: "text.primary" }} />
                                                        ) : (
                                                            <VisibilityIcon sx={{ color: "text.primary" }} />
                                                        )}
                                                    </IconButton>
                                                ),
                                            }}
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
                                onClick={() => setOpenConfirmationDialog(true)}
                            >
                                {t("profile.deleteAccountButton")}
                            </Button>
                        </Paper>
                    </Grid>

                    <ConfirmationDialog
                        open={openConfirmationDialog}
                        onClose={() => setOpenConfirmationDialog(false)}
                        onConfirm={handleDeleteAccount}
                        title={t("profile.deleteAccount")}
                        message={t("profile.deleteAccountConfirmation")}
                    />
                </Grid >
                {changePasswordState && (
                    <Box sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 9999,
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        backgroundColor: isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)",
                        backdropFilter: "blur(8px)",
                    }}>
                        <LockIcon sx={{ fontSize: 100, color: isDark ? "#FFD700" : "#4CAF50" }} />
                        <Typography variant="h4" sx={{ mt: 2, color: "text.primary" }}>
                            {t("profile.changePasswordSuccess")}
                        </Typography>
                        <CircularProgress size={50} />
                        <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
                            {t("profile.redirectMessage")}
                        </Typography>
                    </Box>
                )}

            </Box >
            <Footer />
            <ScrollToTopButton />
        </>
    );
};

export default ProfilePage;
