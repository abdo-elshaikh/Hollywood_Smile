import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { ArrowForward } from '@mui/icons-material';
import detectImage from '../../assets/images/detect-booking.jpg';

const DetectBookingSection = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const isAuth = user ? true : false;

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
                backgroundImage: `url(${detectImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                color: 'white',
                p: 4,
                position: 'relative',
            }}
        >
            <Grid container sx={{ height: '100%' }}>
                {/* Text Section */}
                <Grid item xs={12} md={6} sx={{ padding: 4 }}>
                    <Typography
                        variant="h3"
                        color="white"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '2rem', sm: '2.5rem' },
                            mb: 2,
                        }}
                    >
                        {t('detectBookingSection.title')}
                    </Typography>
                    <Typography
                        variant="body1"
                        color="white"
                        paragraph
                        sx={{
                            fontSize: { xs: '1rem', sm: '1.125rem' },
                            lineHeight: 1.6,
                            mb: 3,
                        }}
                    >
                        {t('detectBookingSection.description')}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNavigateToDetectBooking}
                        sx={{
                            py: 1.5,
                            px: 3,
                            fontSize: { xs: '1rem', sm: '1.125rem' },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {t('detectBookingSection.button')}
                    </Button>
                </Grid>

                {/* Image Section */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    
                </Grid>
            </Grid>
        </Box>
    );
};

export default DetectBookingSection;
