import React from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useClinicContext } from '../../contexts/ClinicContext';

const TopbarSection = () => {
    const { mode } = useCustomTheme();
    const isDark = mode === 'dark';
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const { clinicInfo } = useClinicContext();

    return (
        <Box
            sx={{
                display: { xs: "none", lg: "block" },
                backgroundColor: 'background.default',
                boxShadow: 1,
                borderBottom: isDark ? '1px solid #333' : '1px solid #ddd',
                height: 60,
            }}
        >
            <Grid container
                justifyContent="space-between"
                alignItems="center"

            >
                {/* Left Section */}
                <Grid item xs={12} md={7}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box display="flex" alignItems="center" justifyContent="flex-start">
                            <AccessTimeIcon color="primary" sx={{ mx: 2, fontSize: 25 }} />
                            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                {isArabic ? 'من السبت إلى الخميس من 9 صباحًا حتى 9 مساءً' : 'Saturday - Thursday 9:00 AM - 9:00 PM'}
                            </Typography>
                        </Box>
                    </motion.div>
                </Grid>

                {/* Right Section */}
                <Grid item xs={12} md={5} sx={{ position: "relative", height: 60, overflow: 'hidden' }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: isArabic ? 'none' : '0',
                            left: isArabic ? '0' : 'none',
                            width: '100%',
                            height: '100%',
                            borderTop: `60px solid ${isDark ? '#555' : '#EEF5FF'}`,
                            borderRight: isArabic ? '40px solid transparent' : 'none',
                            borderLeft: isArabic ? 'none' : '40px solid transparent',
                            zIndex: 2,
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: isArabic ? 'none' : '0',
                            left: isArabic ? '0' : 'none',
                            width: '95%',
                            height: '100%',
                            borderTop: `60px solid ${isDark ? '#333' : '#B4D4FF'}`,
                            borderLeft: isArabic ? 'none' : '40px solid transparent',
                            borderRight: isArabic ? '40px solid transparent' : 'none',
                            zIndex: 3,
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: isArabic ? 'none' : '0',
                            left: isArabic ? '0' : 'none',
                            width: '90%',
                            height: '100%',
                            borderTop: `60px solid ${isDark ? '#222' : '#86B6F6'}`,
                            borderLeft: isArabic ? 'none' : '40px solid transparent',
                            borderRight: isArabic ? '40px solid transparent' : 'none',
                            zIndex: 4,
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            width: '90%',
                            zIndex: 5,
                            height: '100%',
                        }}
                    >
                        <Grid container
                            justifyContent="flex-end"
                            alignItems="center"
                            sx={{ height: '100%', gap: 2 }}
                        >
                            <Grid item>
                                <Box display="flex" alignItems="center">
                                    <PhoneIcon color="primary" sx={{ mx: 1, fontSize: 20 }} />
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                        <Link to={`tel:${clinicInfo.phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {clinicInfo.phone}
                                        </Link>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                            <Grid item>
                                <Box display="flex" alignItems="center">
                                    <EmailIcon color="primary" sx={{ mx: 1, fontSize: 20 }} />
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                        <Link to={`mailto:${clinicInfo.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {clinicInfo.email}
                                        </Link>
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TopbarSection;
