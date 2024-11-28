import React from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Stack,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectFade, Autoplay } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const isArabic = i18n.language === 'ar';
    const overlayColor =
        theme.palette.mode === 'dark'
            ? 'rgba(0, 0, 0, 0.4)'
            : 'rgba(255, 255, 255, 0.4)';

    return (
        <Box
            sx={{
                position: 'relative',
                height: { xs: '80vh', md: '90vh' },
                width: '100%',
                overflow: 'hidden',
            }}
        >
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade, Autoplay]}
                effect="fade"
                slidesPerView={1}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                style={{ height: '100%' }}
                className="mySwiper"
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
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
                            }}
                        >
                            {/* Overlay */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: overlayColor,
                                    zIndex: 0,
                                }}
                            />
                            {/* Content */}
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
                                        color: theme.palette.text.primary,
                                        position: 'absolute',
                                        bottom: { xs: '10%', md: '20%' },
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                    }}
                                >
                                    <Typography
                                        variant={isMobile ? 'h4' : 'h2'}
                                        fontWeight="bold"
                                        color="primary"
                                        gutterBottom
                                        sx={{
                                            textTransform: 'uppercase',
                                            letterSpacing: 1.2,
                                        }}
                                    >
                                        {t(`heroSection.slide${index + 1}.title`)}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        gutterBottom
                                        sx={{
                                            fontSize: { xs: '1rem', md: '1.2rem' },
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {t(
                                            `heroSection.slide${index + 1}.description`
                                        )}
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
                                        >
                                            {isArabic ? 'احجز الآن' : 'Book Now'}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="large"
                                            onClick={() => navigate('/contact-us')}
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
