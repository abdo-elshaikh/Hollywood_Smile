// src/pages/ServicesPage.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    CardMedia,
    Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Footer from '../components/home/Footer';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import HeaderSection from '../components/home/HeaderSection';
import TestimonySection from '../components/home/TestimonySection';
import MapLocationSection from '../components/home/MapLocationSection';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/images/main-header.jpg';
import { fetchServices } from '../services/servicesService';

const ServicesPage = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const navigate = useNavigate();
    const [serviceDetails, setServiceDetails] = useState([]);

    useEffect(() => {
        fetchServicesData();
    }, []);

    const fetchServicesData = async () => {
        try {
            const response = await fetchServices();
            setServiceDetails(response);
        } catch (error) {
            console.error('Error fetching services data: ', error);
        }
    };

    const handleServiceClick = (serviceId) => {
        navigate(`/services/${serviceId}`);
    };

    const cardVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <>
            <HeaderSection />

            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    overflow: 'hidden',
                }}
            >
                {/* Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3))',
                        zIndex: 1,
                    }}
                />
                {/* Animated Shapes */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '-20%',
                        left: '-10%',
                        width: '400px',
                        height: '400px',
                        background: 'rgba(58, 141, 255, 0.5)',
                        borderRadius: '50%',
                        filter: 'blur(100px)',
                        zIndex: 0,
                        animation: 'float 6s ease-in-out infinite',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '-20%',
                        right: '-15%',
                        width: '300px',
                        height: '300px',
                        background: 'rgba(134, 185, 255, 0.4)',
                        borderRadius: '50%',
                        filter: 'blur(80px)',
                        zIndex: 0,
                        animation: 'float 8s ease-in-out infinite reverse',
                        '@keyframes float': {
                            '0%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-20px)' },
                            '100%': { transform: 'translateY(0)' },
                        },
                    }}
                />
                {/* Content */}
                <Container
                    sx={{
                        position: 'relative',
                        zIndex: 2,
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 'bold',
                            mb: 2,
                            fontSize: { xs: '2rem', md: '3.5rem' },
                            textShadow: '0px 4px 10px rgba(0, 0, 0, 0.7)',
                        }}
                    >
                        {t('servicesPage.title')}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            maxWidth: '600px',
                            mx: 'auto',
                            mb: 4,
                            fontSize: { xs: '1rem', md: '1.2rem' },
                            color: 'rgba(255, 255, 255, 0.8)',
                            textShadow: '0px 2px 5px rgba(0, 0, 0, 0.6)',
                        }}
                    >
                        {t('servicesPage.subtitle')}
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            borderRadius: '50px',
                            textTransform: 'none',
                            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',
                            },
                        }}
                        onClick={() => navigate('/booking')}
                    >
                        {isArabic ? 'احجز الآن' : 'Book Now'}
                    </Button>
                </Container>
            </Box>


            {/* Services Section */}
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={4}>
                    {serviceDetails.map((service) => (
                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                            <motion.div
                                variants={cardVariant}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <Box
                                    sx={{
                                        boxShadow: 3,
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    {/* Image Section */}
                                    <Box
                                        component="img"
                                        src={service.imageUrl}
                                        alt={service.name}
                                        sx={{
                                            width: '100%',
                                            height: 300,
                                            objectFit: 'cover',
                                        }}
                                    />
                                    {/* Content Section */}
                                    <Box sx={{ p: 3, backgroundColor: 'background.paper' }}>
                                        <Typography
                                            variant="h5"
                                            sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}
                                        >
                                            {isArabic ? service.title.ar : service.title.en}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 2, lineHeight: 1.6 }}
                                        >
                                            {isArabic ? service.description.ar : service.description.en}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => navigate(`/services/${service.id}`)}
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                boxShadow: 2,
                                                px: 3,
                                            }}
                                        >
                                            {t('servicesPage.learnMore')}
                                        </Button>
                                    </Box>
                                </Box>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Divider and Additional Information Section */}
                <Divider sx={{ my: 6 }} />

                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <motion.div
                        variants={cardVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <Typography
                            variant="h3"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                            }}
                        >
                            {t('servicesPage.services')}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                maxWidth: '700px',
                                mx: 'auto',
                                mb: 4,
                                color: 'text.secondary',
                                lineHeight: 1.8,
                            }}
                        >
                            {t('servicesPage.additionalText')}
                        </Typography>
                        <Button
                            onClick={() => navigate('/booking')}
                            variant="contained"
                            color="secondary"
                            sx={{
                                textTransform: 'none',
                                px: 5,
                                py: 1.5,
                                borderRadius: 3,
                            }}
                        >
                            {t('servicesPage.button')}
                        </Button>
                    </motion.div>
                </Box>
                <Divider sx={{ mt: 2 }} />
            </Container>


            {/* Testimonials and Map Section */}
            <TestimonySection />
            <MapLocationSection />

            <Footer />
            <ScrollToTopButton />
        </>
    );
};

export default ServicesPage;
