import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import axiosInstance from '../../services/axiosInstance';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useClinicContext } from '../../contexts/ClinicContext';

const NotificationSection = () => {
  const { mode } = useCustomTheme();
  const { t, i18n } = useTranslation();
  const { clinicInfo } = useClinicContext();
  const isDark = mode === 'dark';
  const isArabic = i18n.language === 'ar';
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/offers');
        const availableNotifications = response.data.filter(notification => notification.showInNotifications);
        const existingNotifications = availableNotifications.filter(notification => new Date(notification.expiryDate) > new Date());
        setNotifications(existingNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  const renderedNotifications = useMemo(() => (
    notifications.map((notification, index) => (
      <Box
        key={index}
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          whiteSpace: 'nowrap',
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1.1rem', sm: '1.3rem' },
            color: isDark ? 'text.primary' : 'text.secondary',
            mx: 15,
          }}
        >
          <strong>{isArabic ? notification.title.ar : notification.title.en} : </strong>
          {isArabic ? notification.description.ar : notification.description.en}
        </Typography>
      </Box>
    ))
  ), [notifications, isArabic, isDark]);

  return (
    <Box>
      <Box
        sx={{
          width: '100%',
          height: '60px',
          background: isDark
            ? 'linear-gradient(135deg, #424242, #616161)'
            : 'linear-gradient(135deg, #A5D4FB, #D8F3FF, #BBDEFB)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          boxShadow: 3,
          position: 'relative',
        }}
      >
        {notifications.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              whiteSpace: 'nowrap',
              position: 'absolute',
              animation: `${isArabic ? 'scrollReverse' : 'scroll'} 120s linear infinite`,
              ':hover': {
                animationPlayState: 'paused',
              },
            }}
          >
            {renderedNotifications} {renderedNotifications}
          </Box>
        ) : (
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', width: '100%', textAlign: 'center' }}>
            {isArabic ? 'لا توجد اشعارات' : 'No Notifications Available'}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          p: 4,
          background: isDark
            ? 'linear-gradient(to top, #7C7C7C, #636363, #424242)'
            : 'linear-gradient(to top, #E0F0FD, #D7EFFB, #B6DBF9)',
          textAlign: 'center',
          boxShadow: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h3"
            color="primary.main"
            fontWeight="bold"
            mb={2}
            sx={{ textTransform: 'uppercase', letterSpacing: 1.5 }}
          >
            {t('appointmentSection.emergency.title')}
          </Typography>
          <Divider sx={{ mb: 2, width: '50%', mx: 'auto' }} />
          <Typography variant="h6" color="text.secondary" mb={2} px={2}>
            {t('appointmentSection.emergency.description')}
          </Typography>
          <Button
            variant="contained"
            href={`tel:${clinicInfo?.phone}`}
            sx={{
              mt: 2,
              px: 4,
              py: 1.2,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                backgroundColor: isDark ? 'primary.light' : 'primary.dark',
                color: 'white',
                transform: 'scale(1.05)',
              },
            }}
          >
            <strong>{t('appointmentSection.emergency.call')}</strong> {clinicInfo?.phone}
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
};

export default NotificationSection;
