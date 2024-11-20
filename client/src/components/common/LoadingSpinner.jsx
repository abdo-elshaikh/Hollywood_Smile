import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LoadingSpinner = ({ size = 100, color = 'primary', message = '' }) => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';


    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
        >
            <CircularProgress size={size} color={color} />
            {message && (
                <Typography variant="h4" style={{ marginTop: 8, color: '#555' }}>
                    {message === '' ? (isArabic ? 'جاري التحميل...' : 'Loading...') : message}
                </Typography>
            )}
        </Box>
    );
};

export default LoadingSpinner;
