import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Paper, Grid, Button, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useCustomTheme } from '../contexts/ThemeProvider';
import HeaderSection from '../components/home/HeaderSection';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import Footer from '../components/home/Footer';
import axiosInstance from '../services/axiosInstance';

const BookingServicePage = () => {
    const { t, i18n } = useTranslation();
    const { mode } = useCustomTheme();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const isDark = mode === 'dark';
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
        <Box
            sx={{
                backgroundColor: isDark ? 'dark.main' : 'background.default',
                color: isDark ? 'white' : 'dark.main',
            }}
        >
            <HeaderSection />
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                sx={{
                    color: isDark ? 'white' : 'dark.main',
                    minHeight: '100vh',
                    py: 15,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: -1,
                        background: isDark ? 'background.default' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                        opacity: 0.6,
                    }}
                />
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            textAlign: 'center',
                            mb: 6,
                            backdropFilter: 'blur(10px)',
                            py: 4,
                            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                            borderRadius: 2,
                        }}
                    >
                        <Typography
                            variant={isMobile ? 'h5' : 'h3'}
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                mb: 2,
                            }}
                        >
                            {isArabic ? 'احجز الخدمة المناسبة لك' : 'Book the service that suits you'}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: 'text.secondary', fontSize: isMobile ? '1rem' : '1.2rem' }}
                        >
                            {isArabic ? 'اختر الخدمة التي ترغب في حجزها' : 'Choose the service you want to book'}
                        </Typography>
                    </Box>

                    {loading ? (
                        <Grid container justifyContent="center">
                            <CircularProgress color="secondary" />
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                {isArabic ? 'جارٍ تحميل الخدمات...' : 'Loading services...'}
                            </Typography>
                        </Grid>
                    ) : (
                        <Grid container spacing={3}>
                            {services.map((service) => (
                                <Grid item xs={12} key={service._id}>
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            display: { xs: 'block', md: 'flex' },
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            alignContent: 'center',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.02)',
                                                boxShadow: 6,
                                                cursor: 'pointer',
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: 'primary.main',
                                                mb: 1,
                                            }}
                                        >
                                            {isArabic ? service.title.ar : service.title.en}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'text.secondary', mb: 2 }}
                                        >
                                            {(isArabic ? service.description.ar : service.description.en).slice(0, 100)}...
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => selectService(service._id)}
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                py: 1,
                                                px: 4,
                                            }}
                                        >
                                            {isArabic ? 'احجز الآن' : 'Book Now'}
                                        </Button>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>
            <ScrollToTopButton />
            <Footer />
        </Box>
    );
};

export default BookingServicePage;
