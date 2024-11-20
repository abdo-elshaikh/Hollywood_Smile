import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Breadcrumbs, Link } from '@mui/material';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useTranslation } from 'react-i18next';
import bgVideo from '../../assets/videos/main-header.mp4';
import smileVideo from '../../assets/videos/childern_smile.mp4';
import girlSmileVideo from '../../assets/videos/girl_smile.mp4';
import girlSmilVideo from '../../assets/videos/happy_Positive.mp4';

const MainHeaderPages = ({ page, title, src = girlSmileVideo }) => {
    const { mode } = useCustomTheme();
    const { t, i18n } = useTranslation();
    const isDark = mode === 'dark';
    const isArabic = i18n.language === 'ar';

    useEffect(() => {
        const video = document.querySelector('video');
        video.currentTime = 0;
    }, [src]);

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90vh',
                color: 'white',
                backgroundAttachment: 'fixed',
                clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)',
                mb: 2,
            }}
        >
            {/* Video Background with Motion */}
            <motion.video
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 1.5 }}
                autoPlay
                loop
                muted
                playsInline
                src={isDark ? girlSmilVideo : src}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                }}
            />

            {/* Dark Gradient Overlay for Readability */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 10%, rgba(0, 0, 0, 0.2) 90%)',
                    zIndex: 1,
                }}
            />

            {/* Content Container */}
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 2,
                    px: 3,
                }}
            >
                {/* Breadcrumbs */}
                <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'white', mb: 2 }}>
                    <Link color="inherit" href="/" sx={{ '&:hover': { color: '#ffd700' } }}>
                        {t('app.home')}
                    </Link>
                    <Typography color="inherit">{page}</Typography>
                </Breadcrumbs>

                {/* Title with Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '2.5rem', md: '4rem' },
                            textShadow: '0px 4px 12px rgba(0, 0, 0, 0.8)',
                            mb: 1,
                        }}
                    >
                        {title}
                    </Typography>
                </motion.div>
            </Container>
        </Box>
    );
};

export default MainHeaderPages;
