import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button, Rating, Card, CardContent, CardMedia, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCustomTheme } from '../contexts/ThemeProvider';
import HeaderSection from '../components/home/HeaderSection';
import Footer from '../components/home/Footer';
import TestimonySection from '../components/home/TestimonySection';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import MapLocationSection from '../components/home/MapLocationSection';
import doctorService from '../services/doctorService';
import bgImage from '../assets/cover_page.jpg';


const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const navigate = useNavigate();
    const { mode } = useCustomTheme();
    const isDark = mode === 'dark';

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

    return (
        <Box sx={{
            position: 'relative',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
        }}>
            <HeaderSection />
            <Box sx={{ py: 5, height: '90vh' }} />
            <Box
                sx={{
                    py: 5,
                    backdropFilter: 'blur(5px)',
                    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
                }}
            >
                <Container sx={{ py: 5, mt: 5, }}>
                    <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 5 }}>
                        {t('doctorsPage.title')}
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ color: 'text.secondary', mb: 5 }}>
                        {t('doctorsPage.subtitle')}
                    </Typography>
                    {doctors.length === 0 ? (
                        <Typography variant="h6" align="center" sx={{ mt: 5 }}>
                            {t('doctorsPage.noDoctorsFound')}
                        </Typography>
                    ) : (
                        <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ mb: 5 }}>
                            {doctors.map((doctor, index) => (
                                <Grid item xs={12} sm={6} md={4} key={doctor._id}>
                                    <DoctorCard doctor={doctor} index={index} isArabic={isArabic} navigate={navigate} t={t} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>
            <Box sx={{ backgroundColor: isDark ? '#333' : '#fff' }} >
                <TestimonySection />
                <MapLocationSection />
            </Box>
            <Footer />
            <ScrollToTopButton />
        </Box>
    );
};

const DoctorCard = ({ doctor, index, isArabic, navigate, t }) => {
    const fallbackImage = 'https://via.placeholder.com/180';
    const doctorRating = (doctor.rating?.reduce((acc, item) => acc + item.stars, 0) / doctor.rating?.length) || 0;
    const { mode } = useCustomTheme();
    const isDark = mode === 'dark';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '100%',
                    padding: 2,
                    borderRadius: 2,
                    background: isDark ? '#333' : 'linear-gradient(135deg, #f7f9fc, #e8f0ff)',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)',
                    },
                }}
            >
                {/* Doctor Image */}
                <Box
                    sx={{
                        width: '100%',
                        height: 300,
                        borderRadius: 2,
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <CardMedia
                        component="img"
                        image={doctor.imageUrl || fallbackImage}
                        alt={isArabic ? doctor.name.ar : doctor.name.en}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            transform: 'scale(1)',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.1)',
                                transition: 'transform 0.3s ease',
                            },
                        }}
                    />
                </Box>

                {/* Doctor Info */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            color: 'text.primary',
                            mb: 1,
                            textTransform: 'capitalize',
                        }}
                    >
                        {isArabic ? doctor.name.ar : doctor.name.en}
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: 'text.secondary',
                            fontStyle: 'italic',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        {isArabic ? doctor.position.ar : doctor.position.en}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        {isArabic ? doctor.description.ar : doctor.description.en}
                    </Typography>
                </Box>

                {/* Doctor Rating */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        mb: 2,
                    }}
                >
                    <Rating
                        name="doctor-rating"
                        value={doctorRating}
                        precision={0.5}
                        readOnly
                        sx={{ color: 'secondary.main' }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {doctorRating.toFixed(1)} ({doctor.rating?.length || 0})
                    </Typography>
                </Box>

                <Divider sx={{ width: '100%', mb: 2, color: 'secodary.main' }} />

                {/* Buttons */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        mt: 2,
                    }}
                >
                    <Button
                        onClick={() => navigate(`/doctors/${doctor._id}`)}
                        variant="contained"
                        color="primary"
                        sx={{
                            px: 3,
                            py: 1,
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                        }}
                    >
                        {t('doctorsPage.learnMore')}
                    </Button>
                    <Button
                        onClick={() => navigate(`/rate-doctor/${doctor._id}`)}
                        variant="outlined"
                        color="secondary"
                        sx={{
                            px: 3,
                            py: 1,
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                        }}
                    >
                        {isArabic ? 'تقييم' : 'Rate'} {isArabic ? 'الدكتور' : 'Doctor'}
                    </Button>
                </Box>
            </Box>
        </motion.div>
    );
};



export default DoctorsPage;
