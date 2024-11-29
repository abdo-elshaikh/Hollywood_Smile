import React from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Stack,
    useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
    Navigation,
    Pagination,
    Scrollbar,
    A11y,
    EffectFade,
    Autoplay,
} from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const baseUrl = `${import.meta.env.VITE_SUPABASE_VIEW_URL}/uploads/slides`;
const slides = [
    `${baseUrl}/slide_1.jpg`,
    `${baseUrl}/slide_2.jpg`,
    `${baseUrl}/slide_3.jpg`,
];

const HeroSection = () => {
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const isArabic = i18n.language === 'ar';
    return (
        <Box
            sx={{
                position: 'relative',
                height: { xs: '80vh', md: '90vh' },
                overflow: 'hidden',
            }}
        >
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade, Autoplay]}
                centeredSlides
                loop
                effect="fade"
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                scrollbar={{
                    draggable: true,
                }}
                autoplay={{
                    delay: 6000,
                }}
                style={{ height: '100%' }}
                className="mySwiper"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <Box
                            sx={{
                                position: 'relative',
                                height: '100vh',
                                width: '100%',
                                backgroundImage: `url(${slide})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                color: 'white',
                                textAlign: 'center',
                            }}
                        >
                            <Container
                                maxWidth="md"
                                sx={{
                                    zIndex: 1,
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                >
                                    <Typography
                                        variant="h2"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'primary.main',
                                            fontSize: { xs: theme.typography.pxToRem(50), md: theme.typography.pxToRem(70) },
                                            lineHeight: theme.typography.pxToRem(80),
                                            textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',

                                        }}
                                    >
                                        {t(`heroSection.slide${index + 1}.title`)}
                                    </Typography>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                >
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: 'white',
                                            fontSize: { xs: theme.typography.pxToRem(25), md: theme.typography.pxToRem(35) },
                                            lineHeight: theme.typography.pxToRem(35),
                                            textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                        }}
                                    >
                                        {t(`heroSection.slide${index + 1}.description`)}
                                    </Typography>
                                </motion.div>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ mt: 2, gap: 2 }}
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate('/booking')}
                                    >
                                        {isArabic ? 'احجز الآن' : 'Book Now'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => navigate('/contact-us')}
                                    >
                                        {isArabic ? 'تواصل معنا' : 'Contact Us'}
                                    </Button>
                                </Stack>
                            </Container>
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};

export default HeroSection;
