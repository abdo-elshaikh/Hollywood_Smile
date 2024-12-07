import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box, Rating } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import HeaderSection from '../components/home/HeaderSection';
import Footer from '../components/home/Footer';
import doctorService from '../services/doctorService';
import headerVideo from '../assets/videos/main-header.mp4';
import TestimonySection from '../components/home/TestimonySection';
import SrcollToTopButton from '../components/common/ScrollToTopButton';
import MapLocationSection from '../components/home/MapLocationSection';
import { useNavigate } from 'react-router-dom';

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const navigate = useNavigate();


    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await doctorService.fetchDoctors();
                
                setDoctors(data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };
        fetchDoctors();
    }, []);

    // Inline HeroSection Component
    const HeroSection = ({ title, subtitle, videoSrc }) => (
        <Box
            sx={{
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <video
                src={videoSrc}
                autoPlay
                muted
                loop
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: -2,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7))',
                    zIndex: -1,
                }}
            />
            <Container sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {title}
                    </Typography>
                    <Typography variant="h6" sx={{ maxWidth: '600px', mx: 'auto' }}>
                        {subtitle}
                    </Typography>
                </motion.div>
            </Container>
        </Box>
    );

    // Inline DoctorCard Component
    const DoctorCard = ({ doctor, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
        >
            <Card
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: 5,
                    height: '100%',
                    borderRadius: 4,
                    p: 3,
                    textAlign: 'center',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: 8,
                    },
                }}
            >
                <CardMedia
                    component="img"
                    image={doctor.imageUrl}
                    sx={{
                        height: 180,
                        width: 180,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        mb: 2,
                        border: '4px solid',
                        borderColor: 'primary.main',
                    }}
                />
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flexGrow: 1,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                        {isArabic ? doctor.name.ar : doctor.name.en}
                    </Typography>
                    <Rating 
                    name="read-only" 
                    value={(doctor.rating?.reduce((acc, item) => acc + item.stars, 0) / doctor.rating?.length) || 0} 
                    readOnly
                    size="large"
                    sx={{ mb: 1 }}
                    />
                    <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 2 }}>
                        {isArabic ? doctor.position.ar : doctor.position.en}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        {isArabic ? doctor.description.ar : doctor.description.en}
                    </Typography>
                    <Button onClick={() => navigate(`/doctors/${doctor._id}`)} variant="contained" color="primary" sx={{ mt: 1 }}>
                        {t('doctorsPage.learnMore')}
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <Box sx={{ position: 'relative' }}>
            <HeaderSection />
            <HeroSection
                title={t('doctorsPage.title')}
                subtitle={t('doctorsPage.subtitle')}
                videoSrc={headerVideo}
            />

            <Container sx={{ py: 5 }}>
                <Grid container spacing={4}>
                    {doctors.map((doctor, index) => (
                        <Grid item xs={12} sm={6} md={4} key={doctor._id}>
                            <DoctorCard doctor={doctor} index={index} />
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <TestimonySection />
            <MapLocationSection />

            <Footer />
            <SrcollToTopButton />
        </Box>
    );
};

export default DoctorsPage;
