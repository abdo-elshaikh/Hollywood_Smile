import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const DetectBookingSection = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();

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
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                py: 5,
                backgroundColor: 'background.paper',
                // borderRadius: 2,
                boxShadow: 1,
                // mx: 'auto',
                my: 4,
                width: '100%',
            }}
        >
            <Typography variant="h3" gutterBottom>
                {t('detectBookingSection.title')}
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, maxWidth: 600 }}>
                {t('detectBookingSection.description')}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleNavigateToDetectBooking}
                size="large"
                sx={{ mt: 2 }}
            >
                {t('detectBookingSection.button')}
            </Button>
            <Typography variant="body2" sx={{ mt: 2, color: '#B03052', maxWidth: 200}}>
                {t('detectBookingSection.additionalText')}
            </Typography>
        </Box>
    );
};

export default DetectBookingSection;
