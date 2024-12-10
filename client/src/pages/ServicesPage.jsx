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
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(58,141,255,0.3), rgba(134,185,255,0.1))',
                        zIndex: 2,
                    }}
                />
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
                        sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '2rem', md: '3.5rem' } }}
                    >
                        {t('servicesPage.title')}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ maxWidth: '600px', mx: 'auto', mb: 4, fontSize: { xs: '1rem', md: '1.2rem' } }}
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
                                <Card
                                    sx={{
                                        boxShadow: 4,
                                        borderRadius: 3,
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': { transform: 'translateY(-10px)' },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image={service.imageUrl}
                                        alt={service.name}
                                        sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                                    />
                                    <CardContent>
                                        <Typography variant="h5" component="div" sx={{ fontWeight: 'medium', mb: 1 }}>
                                            {isArabic ? service.title.ar : service.title.en}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {isArabic ? service.description.ar : service.description.en}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'center' }}>
                                        <Button variant="text" color="primary">
                                            {t('servicesPage.learnMore')}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ my: 6 }} />

                {/* Additional Information Section */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <motion.div
                        variants={cardVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {t('servicesPage.services')}
                        </Typography>
                        <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
                            {t('servicesPage.additionalText')}
                        </Typography>
                        <Button onClick={() => navigate('/booking')} variant="contained" color="secondary" width="400px">
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
