import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { ArrowForward } from '@mui/icons-material';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import detectImage from '../../assets/images/detect-booking.jpg';

const DetectBookingSection = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const isAuth = user ? true : false;
    const { mode } = useCustomTheme();
    const isDarkMode = mode === 'dark';

    const handleNavigateToDetectBooking = () => {
        if (user) {
            // Navigate to Detect Booking page if logged in
            navigate('/detect-booking');
        } else {
            // Redirect to login page if not logged in
            navigate('/auth/login', { state: { from: '/detect-booking' } });
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                position: 'relative',
                overflow: 'hidden',

            }}
        >
            {/* Background Image */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${detectImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0,
                    transition: 'filter 0.3s',
                    transform: isArabic ? 'scaleX(1)' : 'scaleX(-1)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
                    zIndex: 1,
                }}
            />
            {/* Content */}
            <Box
                sx={{
                    zIndex: 2,
                    position: 'relative',
                    width: '100%',
                    padding: 8,
                }}
            >
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {t('detectBookingSection.title')}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {t('detectBookingSection.description')}
                        </Typography>
                        <Box sx={{ mt: 4 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNavigateToDetectBooking}
                                disableElevation
                                disabled={!isAuth}
                            >
                                {t('detectBookingSection.button')}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            {!isAuth && user?.role !== 'visitor' && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        zIndex: 2,
                        padding: 1,
                        textAlign: 'center',
                        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                    }}
                >
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {t('detectBookingSection.loginRequired')}
                    </Typography>
                    <Button
                        variant="text"
                        color="primary"
                        onClick={() => navigate('/auth/login', { state: { from: '/detect-booking' } })}
                        startIcon={<ArrowForward sx={{ color: 'primary.main', mx: 1 }} />}
                    >
                        {t('detectBookingSection.login')}
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default DetectBookingSection;
