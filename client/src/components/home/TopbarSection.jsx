import React from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useTranslation } from 'react-i18next';

const TopbarSection = ({ clinicinfo }) => {
    const { mode } = useCustomTheme();
    const isDark = mode === 'dark';
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    const contactInfoStyles = {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'inherit',
    };

    const iconStyles = {
        mx: 1,
        fontSize: 20,
    };

    const triangleStyles = (width, color, zIndex) => ({
        position: 'absolute',
        top: 0,
        right: isArabic ? 'none' : '0',
        left: isArabic ? '0' : 'none',
        width: `${width}%`,
        height: '100%',
        borderTop: `64px solid ${color}`,
        borderLeft: isArabic ? 'none' : '40px solid transparent',
        borderRight: isArabic ? '40px solid transparent' : 'none',
        zIndex,
    });

    return (
        <Box
            sx={{
                display: { xs: "none", md: 'block' },
                backgroundColor: 'background.default',
                boxShadow: 1,
                borderBottom: isDark ? '1px solid #333' : '1px solid #ddd',
                height: 60,
            }}
        >
            <Grid container justifyContent="space-between" alignItems="center">
                {/* Left Section */}
                <Grid item xs={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box display="flex" alignItems="center" justifyContent="flex-start">
                            <AccessTimeIcon color="primary" sx={{ mx: 2, fontSize: 25 }} />
                            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                {isArabic ? 'من السبت إلى الخميس من 10 صباحًا حتى 10 مساءً | الجمعه من 3 مساءً' : 'Saturday - Thursday 10:00 AM - 10:00 PM | Friday 3:00 PM'}
                            </Typography>
                        </Box>
                    </motion.div>
                </Grid>

                {/* Right Section */}
                <Grid item xs={12} md={6} sx={{ position: "relative", height: 60, overflow: 'hidden' }}>
                    <Box sx={triangleStyles(100, isDark ? '#555' : '#EEF5FF', 2)} />
                    <Box sx={triangleStyles(95, isDark ? '#333' : '#B4D4FF', 3)} />
                    <Box sx={triangleStyles(90, isDark ? '#222' : '#86B6F6', 4)} />

                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            width: '90%',
                            zIndex: 5,
                            height: '100%',
                        }}
                    >
                        <Grid container justifyContent="flex-end" alignItems="center" sx={{ height: '100%', gap: 2 }}>
                            <Grid item>
                                <Box display="flex" alignItems="center">
                                    <PhoneIcon color="primary" sx={iconStyles} />
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                        <Link to={`tel:${clinicinfo?.phone}`} style={contactInfoStyles}>
                                            {clinicinfo?.phone}
                                        </Link>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                            <Grid item>
                                <Box display="flex" alignItems="center">
                                    <EmailIcon color="primary" sx={iconStyles} />
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                        <Link to={`mailto:${clinicinfo.email}`} style={contactInfoStyles}>
                                            {clinicinfo.email}
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