import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button, Rating, CardContent, Divider, useTheme } from '@mui/material';
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
import InformationSection from '../components/common/InformationSection';
import bgImage from '../assets/images/team.jpg';

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const { t, i18n } = useTranslation();
    const theme = useTheme();
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
        <Box sx={{ position: 'relative' }}>
            <HeaderSection />

            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '90vh',
                    background: `url(${bgImage}) no-repeat center center / cover`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                    py: 8
                }}
            >
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                    <Typography variant="h1" align="center" sx={{
                        fontWeight: 900,
                        color: 'primary.main',
                        mb: 2,
                        fontSize: { xs: '2.5rem', md: '4rem' },
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        {t('doctorsPage.title')}
                    </Typography>
                    <Typography variant="h5" align="center" sx={{
                        color: 'text.secondary',
                        mb: 6,
                        maxWidth: 800,
                        mx: 'auto',
                        fontSize: { xs: '1.1rem', md: '1.25rem' }
                    }}>
                        {t('doctorsPage.subtitle')}
                    </Typography>
                </motion.div>
            </Box>


            <Box sx={{
                backdropFilter: 'blur(8px)',
                background: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.85)',
                py: 8,
            }}>
                <Container maxWidth="xl">
                    {doctors.length === 0 ? (
                        <Typography variant="h4" align="center" sx={{ mt: 5, color: 'text.secondary' }}>
                            {t('doctorsPage.noDoctorsFound')}
                        </Typography>
                    ) : (
                        <Grid container spacing={4} justifyContent="center">
                            {doctors.map((doctor, index) => (
                                <Grid item xs={12} sm={6} lg={4} xl={3} key={doctor._id}>
                                    <DoctorCard
                                        doctor={doctor}
                                        index={index}
                                        isArabic={isArabic}
                                        navigate={navigate}
                                        t={t}
                                        theme={theme}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>

            <Box sx={{
                background: isDark ?
                    'linear-gradient(45deg, #1a1a1a 30%, #2d2d2d 90%)' :
                    'linear-gradient(45deg, #f8f9fa 30%, #ffffff 90%)',
                py: 8
            }}>
                <InformationSection />
                <TestimonySection />
                <MapLocationSection />
            </Box>

            <Footer />
            <ScrollToTopButton />
        </Box>
    );
};

const DoctorCard = ({ doctor, index, isArabic, navigate, t, theme }) => {
    const doctorRating = (doctor.rating?.reduce((acc, item) => acc + item.stars, 0) / doctor.rating?.length) || 0;
    const { mode } = useCustomTheme();
    const isDark = mode === 'dark';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                background: isDark ?
                    'linear-gradient(145deg, #2d2d2d, #1f1f1f)' :
                    'linear-gradient(145deg, #ffffff, #f8f9fa)',
                boxShadow: theme.shadows[4],
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    boxShadow: theme.shadows[8],
                },
            }}>
                {/* Image Section */}
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: 320,
                    overflow: 'hidden',
                    '&:hover img': {
                        transform: 'scale(1.05)',
                    }
                }}>
                    <Box
                        component="img"
                        src={doctor.imageUrl}
                        alt={isArabic ? doctor.name.ar : doctor.name.en}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'top',
                            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    />
                    <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '40%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 30%, transparent)',
                    }} />
                </Box>

                {/* Content Section */}
                <CardContent sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    px: 3,
                    py: 3,
                }}>
                    <Typography variant="h5" sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 1,
                        lineHeight: 1.2,
                        minHeight: 64
                    }}>
                        {isArabic ? doctor.name.ar : doctor.name.en}
                    </Typography>

                    <Typography variant="subtitle1" sx={{
                        color: 'secondary.main',
                        fontWeight: 600,
                        mb: 2,
                        minHeight: 24
                    }}>
                        {isArabic ? doctor.position.ar : doctor.position.en}
                    </Typography>

                    <Typography variant="body2" sx={{
                        color: 'text.secondary',
                        mb: 3,
                        flexGrow: 1,
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}>
                        {isArabic ? doctor.description.ar : doctor.description.en}
                    </Typography>

                    {/* Rating Section */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2,
                        color: 'text.secondary'
                    }}>
                        <Rating
                            value={doctorRating}
                            precision={0.5}
                            readOnly
                            size="small"
                            sx={{ color: 'secondary.main' }}
                        />
                        <Typography variant="body2">
                            {doctorRating > 0 ? `${doctorRating.toFixed(1)} (${doctor.rating?.length || 0})` : t('doctorsPage.noRatings')}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2, borderColor: 'divider' }} />

                    {/* Action Buttons */}
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'space-between',
                        '& .MuiButton-root': {
                            flex: 1,
                            borderRadius: 2,
                            py: 1.5,
                            fontWeight: 700,
                            letterSpacing: 0.8,
                            transition: 'all 0.3s',
                        }
                    }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate(`/doctors/${doctor._id}`)}
                            sx={{
                                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[4]
                                }
                            }}
                        >
                            {isArabic ? 'عرض التفاصيل' : 'View Details'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate(`/rate-doctor/${doctor._id}`)}
                            sx={{
                                borderWidth: 2,
                                '&:hover': {
                                    borderWidth: 2,
                                    transform: 'translateY(-2px)',
                                    background: 'rgba(255,255,255,0.1)'
                                }
                            }}
                        >
                            {isArabic ? 'تقييم' : 'Rate'}
                        </Button>
                    </Box>
                </CardContent>
            </Box>
        </motion.div>
    );
};

export default DoctorsPage;