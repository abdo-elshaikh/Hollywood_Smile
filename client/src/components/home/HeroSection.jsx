import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useNavigate } from 'react-router-dom';

const baseUrl = `${import.meta.env.VITE_SUPABASE_VIEW_URL}/uploads/slides`;
const slides = [
    `${baseUrl}/slide_5.jpg`,
    `${baseUrl}/slide_7.jpg`,
    `${baseUrl}/slide_2.jpg`,
    `${baseUrl}/slide_8.jpg`,
];

const HeroSection = () => {
    const { t, i18n } = useTranslation();
    const { mode } = useCustomTheme();
    const isArabic = i18n.language === 'ar';
    const isDark = mode === 'dark';
    const navigate = useNavigate();

    

    return (
        <Box
            sx={{
                position: 'relative',
                height: { xs: '70vh', md: '90vh' },
                width: '100%',
                overflow: 'hidden',
            }}
        >
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                pagination={{ clickable: true, dynamicBullets: true, bulletClass: 'swiper-pagination-bullet' }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop
                style={{ height: '100%', width: '100%' }}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <Box
                            sx={{
                                position: 'relative',
                                height: '100%',
                                width: '100%',
                                backgroundImage: `url(${slide})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 0,
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
                                    zIndex: 0,
                                }}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <Container
                                    maxWidth="sm"
                                    sx={{
                                        zIndex: 1,
                                        textAlign: 'center',
                                        color: isDark ? 'white' : 'black',
                                        position: 'absolute',
                                        bottom: { xs: '10%', md: '20%' },
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '100%',
                                    }}
                                >
                                    <Typography
                                        variant="h2"
                                        fontWeight="bold"
                                        color='primary'
                                        gutterBottom
                                        sx={{ textTransform: 'uppercase', letterSpacing: 1.2, fontShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)' }}
                                    >
                                        {t(`heroSection.slide${index + 1}.title`)}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color='primary.dark'
                                        gutterBottom
                                        sx={{
                                            fontSize: { xs: '1rem', md: '1.2rem' },
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {t(`heroSection.slide${index + 1}.description`)}
                                    </Typography>
                                    <Stack
                                        direction={{ xs: 'column', md: 'row' }}
                                        spacing={2}
                                        justifyContent="center"
                                        sx={{ mt: 3, gap: 2 }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="large"
                                            onClick={() => navigate('/booking')}
                                            sx={{ mt: 3, width: '100%' }}
                                        >
                                            {isArabic ? 'احجز الآن' : 'Book Now'}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="large"
                                            onClick={() => navigate('/contact-us')}
                                            sx={{ mt: 3, width: '100%' }}
                                        >
                                            {isArabic ? 'تواصل معنا' : 'Contact Us'}
                                        </Button>
                                    </Stack>
                                </Container>
                            </motion.div>
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};

export default HeroSection;
