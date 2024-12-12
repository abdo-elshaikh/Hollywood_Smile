import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useClinicContext } from '../../contexts/ClinicContext';
import { useTranslation } from 'react-i18next';

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
  );
};

export default NotificationSection;
