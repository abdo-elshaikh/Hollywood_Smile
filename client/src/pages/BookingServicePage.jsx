import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Paper, Grid, Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useCustomTheme } from '../contexts/ThemeProvider';
import { useSnackbar } from '../contexts/SnackbarProvider';
import HeaderSection from '../components/home/HeaderSection';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import Footer from '../components/home/Footer';
import axiosInstance from '../services/axiosInstance';
import onlineBookingVideo from '../assets/videos/onlineBooking.mp4';

const BookingServicePage = () => {
    const { t, i18n } = useTranslation();
    const { mode } = useCustomTheme();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const isDark = mode === 'dark';
    const showSnackBar = useSnackbar();
    const navigate = useNavigate();
    const isArabic = i18n.language === 'ar';

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axiosInstance.get('/services');
                setServices(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching services:', error);
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const selectService = (id) => {
        navigate(`/booking/${id}`);
    };

    return (
        <>
            <HeaderSection />
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                sx={{
                    backgroundColor: isDark ? 'dark.main' : 'light.main',
                    color: isDark ? 'white' : 'dark.main',
                    minHeight: '100vh',
                    py: 10,
                }}
            >
                <Container maxWidth="md">
                    <Grid container justifyContent="center" sx={{ mb: 4, backdropFilter: 'blur(10px)', p: 4 }}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                {isArabic ? ' الحجز الأونلاين هنا' : 'Book your Online Appointment Here'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                {isArabic ? 'اختر الخدمة التي ترغب في حجزها' : 'Select the service you want to book'}
                            </Typography>
                        </Grid>
                    </Grid>

                    {loading ? (
                        <Grid container justifyContent="center">
                            <CircularProgress />
                        </Grid>
                    ) : (
                        services.map((service) => (
                            <Box
                                component={Paper}
                                key={service._id}
                                sx={{
                                    display: 'flex',
                                    flexDirection: isArabic ? 'row-reverse' : 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2,
                                    p: 2,
                                    gap: 2,
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    {isArabic ? service.title.ar : service.title.en}
                                </Typography>
                                {/* <Typography variant="body1">
                                    {isArabic ? service.description.ar : service.description.en}
                                </Typography> */}
                                <Typography variant="body1">
                                    {service.price} {t('currency')}
                                </Typography>
                                
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => selectService(service._id)}
                                    sx={{ ml: 2 }}
                                >
                                    {isArabic ? 'احجز الان' : 'Book Now'}
                                </Button>
                            </Box>
                        ))
                    )}
                </Container>
            </Box>
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    minWidth: '100%',
                    minHeight: '100%',
                    zIndex: -1,
                    objectFit: 'cover',
                    opacity: 0.7,
                }}
            >
                <source src={onlineBookingVideo} type="video/mp4" />
            </video>
            <ScrollToTopButton />
            <Footer />
        </>
    );
};

export default BookingServicePage;