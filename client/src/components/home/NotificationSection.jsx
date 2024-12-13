import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useClinicContext } from '../../contexts/ClinicContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const NotificationSection = () => {
  const { mode } = useCustomTheme();
  const { t, i18n } = useTranslation();
  const { clinicInfo, clinicOffers } = useClinicContext();
  const isDark = mode === 'dark';
  const isArabic = i18n.language === 'ar';
  const notifications = clinicOffers?.filter((offer) => offer.showInNotifications) || [];


  // Memoize notifications to avoid unnecessary re-renders
  const renderedNotifications = useMemo(() => {
    return notifications.map((notification, index) => (
      <Box
        key={index}
        sx={{
          height: '60px',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          px: 1,
          cursor: 'pointer',
          margin: isArabic ? '0 300px 0 0' : '0 0 0 300px',
        }}
      >
        <Typography sx={{ color: 'inherit', fontWeight: 'bold', fontSize: '20px' }}>
          {isArabic ? notification.description.ar : notification.description.en}
        </Typography>
      </Box>
    ));
  }, [notifications, isArabic]);


  return (
    <>

      <Box
        sx={{
          width: '100%',
          height: '60px',
          background: isDark
            ? 'linear-gradient(135deg, #424242, #616161, #424242)'
            : 'linear-gradient(135deg,rgb(165, 212, 251),rgb(216, 243, 255), #BBDEFB)',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        }}
      >
        {notifications.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              whiteSpace: 'nowrap',
              position: 'absolute',
              animation: isArabic ? 'scrollReverse 200s linear infinite' : 'scroll 200s linear infinite',
              animationPlayState: 'running',
              direction: isArabic ? 'rtl' : 'ltr',
              ':hover': {
                animationPlayState: 'paused',
              },
            }}
          >
            {renderedNotifications}
            {/* Duplicate notifications for seamless scrolling */}
            {renderedNotifications}
          </Box>
        ) : (
          <Typography sx={{ color: 'inherit', fontWeight: 'bold', fontSize: '20px', textAlign: 'center', width: '100%' }}>
            {isArabic ? 'لا توجد اشعارات' : 'No Notifications Found'}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          boxShadow: 0,
          p: 4,
          background: isDark
            ? 'linear-gradient(to top,rgb(124, 124, 124),rgb(99, 99, 99), #424242)'
            : 'linear-gradient(to top,rgb(224, 240, 253),rgb(215, 239, 251),rgb(182, 219, 249))',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Typography
            variant="h3"
            color='primary.main'
            fontWeight="bold"
            mb={2}
            textShadow={4}

          >
            {t('appointmentSection.emergency.title')}
          </Typography>
          <Divider sx={{ mb: 2, width: '50%', mx: 'auto' }} />
          <Typography variant="h6" color="text.secondary" mb={2} px={2}>
            {t('appointmentSection.emergency.description')}
          </Typography>
          <Button
            variant="contained"
            // startIcon={<Call sx={{ mx: 2 }} />}
            href={`tel:${clinicInfo?.phone}`}
            sx={{
              mt: 2,
              px: 4,
              py: 1,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                backgroundColor: mode === 'light' ? 'primary.dark' : 'primary.light',
                color: 'white',
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease-in-out',
              },
            }}
          >
            <strong>{t('appointmentSection.emergency.call')}</strong> {clinicInfo?.phone}
          </Button>
        </motion.div>
      </Box>
    </>
  );
};

export default NotificationSection;
