import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Breadcrumbs, Link, useMediaQuery } from '@mui/material';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useTranslation } from 'react-i18next';

// Video imports
import girlSmileVideo from '../../assets/videos/girl_smile.mp4';
import happyPositiveVideo from '../../assets/videos/happy_Positive.mp4';

// Reusable Breadcrumbs Component
const Breadcrumb = ({ page, homeLabel }) => (
    <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
            color: 'white',
            mb: 2,
            fontSize: '0.9rem',
            '& .MuiLink-root': {
                fontWeight: 500,
                textDecoration: 'none',
                '&:hover': { color: '#ffd700' },
            },
        }}
    >
        <Link color="inherit" href="/">
            {homeLabel}
        </Link>
        <Typography color="inherit" sx={{ fontWeight: 600 }}>
            {page}
        </Typography>
    </Breadcrumbs>
);

// Main Header Component
const MainHeaderPages = ({ page, title, src = girlSmileVideo }) => {
    const { mode } = useCustomTheme();
    const { t, i18n } = useTranslation();
    const isDark = mode === 'dark';
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));  // Mobile/Tablet detection

    useEffect(() => {
        const video = document.querySelector('video');
        if (video) video.currentTime = 0;
    }, [src]);

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
                backgroundColor: 'transparent',
                mb: 4,
            }}
        >
            {/* Background Video with Soft Blur */}
            <motion.video
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                autoPlay
                loop
                muted
                playsInline
                src={isDark ? happyPositiveVideo : src}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                    filter: 'blur(1px)',
                    minHeight: '100%',
                }}
            />

            {/* Soft Gradient Overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.7) 100%)',
                    zIndex: 1,
                }}
            />

            {/* Content Area */}
            <Container
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    px: 3,
                    py: 4,
                }}
            >
                {/* Breadcrumbs */}
                <Breadcrumb page={page} homeLabel={t('app.home')} />

                {/* Title with Smooth Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 600,
                            fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' }, // Responsive font size
                            color: 'white',
                            lineHeight: 1.2,
                            textShadow: '0 4px 12px rgba(0, 0, 0, 0.8)',
                            mb: 2,
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
