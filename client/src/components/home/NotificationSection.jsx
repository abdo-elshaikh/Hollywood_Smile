import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Divider, Button, Modal } from '@mui/material';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import axiosInstance from '../../services/axiosInstance';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useClinicContext } from '../../contexts/ClinicContext';
import TestimonialForm from '../common/TestimonialForm';
import { RateReview, Call } from '@mui/icons-material';

const NotificationSection = () => {
  const { mode } = useCustomTheme();
  const { t, i18n } = useTranslation();
  const { clinicInfo } = useClinicContext();
  const isDark = mode === 'dark';
  const isArabic = i18n.language === 'ar';
  const [notifications, setNotifications] = useState([]);
  const [openTestimonialModal, setOpenTestimonialModal] = useState(false);

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
          p: 6,
          borderRadius: 3,
          textAlign: 'center',
          background: isDark
            ? 'linear-gradient(to top, #4a4a4a, #292929)'
            : 'linear-gradient(to top, #F3F9FF, #E2F1FB)',
          boxShadow: 4,
          transition: 'all 0.3s ease-in-out',
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
            mb={3}
            fontFamily={'"Cairo Play", serif'}
            sx={{ textTransform: 'uppercase', letterSpacing: 2 }}
          >
            {t('appointmentSection.emergency.title')}
          </Typography>
          <Divider sx={{ mb: 3, width: '40%', mx: 'auto' }} />
          <Typography variant="h6" color="text.secondary" mb={4} px={2} fontFamily={'"Fustat", serif'}>
            {t('appointmentSection.emergency.description')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 3,
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="contained"
              href={`tel:${clinicInfo?.phone}`}
              startIcon={<Call sx={{ fontSize: 26, mx: 2 }} />}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '30px',
                background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                color: '#fff',
                boxShadow: '0px 5px 15px rgba(25, 118, 210, 0.3)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
                  transform: 'scale(1.07)',
                  boxShadow: '0px 8px 20px rgba(25, 118, 210, 0.4)',
                },
              }}
            >
              {clinicInfo?.phone}
            </Button>

            <Button
              variant="contained"
              onClick={() => setOpenTestimonialModal(true)}
              startIcon={<RateReview sx={{ fontSize: 26, mx: 2 }} />}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '30px',
                background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                color: '#fff',
                boxShadow: '0px 5px 15px rgba(255, 152, 0, 0.3)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  background: 'linear-gradient(135deg, #F57C00, #E65100)',
                  transform: 'scale(1.07)',
                  boxShadow: '0px 8px 20px rgba(255, 152, 0, 0.4)',
                },
              }}
            >
              {t('appointmentSection.emergency.feedback')}
            </Button>
          </Box>

        </motion.div>
      </Box>

      {/* Testimonial Modal with Glassmorphism */}
      <Modal
        open={openTestimonialModal}
        onClose={() => setOpenTestimonialModal(false)}
        aria-labelledby="Testimonial Form"
        aria-describedby="Testimonial Form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'background.default',
            backdropFilter: 'blur(10px)',
            p: 4,
            borderRadius: 3,
            boxShadow: 6,
            width: '100%',
            maxWidth: 'sm',
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <TestimonialForm />
        </Box>
      </Modal>

    </Box>
  );
};

export default NotificationSection;
