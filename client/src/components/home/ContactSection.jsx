import React, { useState } from "react";
import { Box, Container, Grid, Typography, TextField, Button, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { useCustomTheme } from "../../contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import axiosInstance from '../../services/axiosInstance';

const ContactSection = () => {
    const { mode } = useCustomTheme();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const showSnackbar = useSnackbar();
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = t('ContactSection.nameRequired');
        if (!formData.phone) newErrors.phone = t('ContactSection.phoneRequired');
        // egyptian phone number validation
        if (formData.phone && !/^(010|011|012|015)[0-9]{8}$/.test(formData.phone)) newErrors.phone = t('ContactSection.phoneInvalid');
        if (!formData.message) newErrors.message = t('ContactSection.messageRequired');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return showSnackbar(t('ContactSection.validationMessage'), 'error');
        try {
            const response = await axiosInstance.post('/messages', formData);
            showSnackbar(response.status === 201 ? t('ContactSection.successMessage') : t('ContactSection.errorMessage'), response.status === 201 ? 'success' : 'error');
            setFormData({ name: '', phone: '', email: '', message: '' });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box component="section" sx={{
            py: 10, bgcolor: mode === "dark" ? "#1c1c1c" : "#f9f9f9",
            color: mode === "dark" ? "text.primary" : "text.secondary",
            background: "linear-gradient(to right, #EAAB75, #ff7e5f, #feb47b)"
        }}>
            <Container>
                <Grid container spacing={4}>
                    <Grid item md={6}>
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
                            <Box sx={{ py: 5 }}>
                                <Typography variant="h4" sx={{ mb: 2, color: "white", fontWeight: 'bold' }}>{t('ContactSection.title')}</Typography>
                                <Typography variant="body1" sx={{ mb: 4, color: "white", lineHeight: 1.6 }}>{t('ContactSection.description')}</Typography>
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    {[t('ContactSection.item1'), t('ContactSection.item2'), t('ContactSection.item3'), t('ContactSection.item4')].map((item, index) => (
                                        <li key={index} style={{ color: "white", marginBottom: 8, display: "flex", alignItems: "center" }}>
                                            <span style={{ margin: '0 8px' }}>✔️</span>{item}
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        </motion.div>
                    </Grid>

                    <Grid item md={6}>
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}>
                            <Box component={Paper} sx={{ p: 5, borderRadius: 5, boxShadow: 3 }}>
                                <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "primary" }}>{t('ContactSection.contactUs')}</Typography>
                                <Typography variant="body1" sx={{ mb: 4, color: "#666", lineHeight: 1.6 }}>{t('ContactSection.contactDescription')}</Typography>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                value={formData.name}
                                                name="name"
                                                onChange={handleChange}
                                                variant="outlined"
                                                label={t('ContactSection.fullName')}
                                                error={!!errors.name}
                                                helperText={errors.name}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 }, textAlign: isArabic ? 'right' : 'left' }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                value={formData.email}
                                                name="email"
                                                onChange={handleChange}
                                                variant="outlined"
                                                label={t('ContactSection.email')}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 }, textAlign: isArabic ? 'right' : 'left' }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                value={formData.phone}
                                                name="phone"
                                                onChange={handleChange}
                                                variant="outlined"
                                                label={t('ContactSection.phone')}
                                                error={!!errors.phone}
                                                helperText={errors.phone}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 }, textAlign: isArabic ? 'right' : 'left' }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                value={formData.message}
                                                name="message"
                                                onChange={handleChange}
                                                variant="outlined"
                                                label={t('ContactSection.message')}
                                                multiline
                                                rows={4}
                                                error={!!errors.message}
                                                helperText={errors.message}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 }, textAlign: isArabic ? 'right' : 'left' }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <motion.div whileHover={{ scale: 1.03 }}>
                                                <Button type="submit" variant="contained" color="primary" fullWidth sx={{
                                                    py: 2, borderRadius: 3, "&:hover": { backgroundColor: "#ff6f30" },
                                                }}>{t('ContactSection.sendMessage')}</Button>
                                            </motion.div>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ContactSection;
