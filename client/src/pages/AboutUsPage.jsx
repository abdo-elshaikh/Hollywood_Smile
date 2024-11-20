import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Verified, EmojiObjects, People, Star } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import HeaderSection from '../components/home/HeaderSection';
import Footer from '../components/home/Footer';
import bgImage from '../assets/videos/girl_smile2.mp4';
import MainHeaderPages from '../components/common/MainHeaderPages';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import TestimonySection from '../components/home/TestimonySection';
import MapLocationSection from '../components/home/MapLocationSection';

const AboutUsPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isArabic = i18n.language === 'ar';

    return (
        <Box>
            <HeaderSection />
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.2))',
                        zIndex: 1,
                    },
                }}
            >
                <video
                    src={bgImage}
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

                {/* Content Container */}
                <Container sx={{ position: 'relative', zIndex: 2 }}>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {t('aboutUsPage.title')}
                        </Typography>
                        <Typography variant="h6" sx={{ maxWidth: '600px', mx: 'auto' }}>
                            {t('aboutUsPage.subtitle')}
                        </Typography>
                    </motion.div>
                </Container>

                {/* Mission, Vision, and Timeline Section Overlay */}
                <Container
                    maxWidth="lg"
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'background.default',
                        boxShadow: 8,
                        py: 3,
                        px: 4,
                        zIndex: 3,
                    }}
                >
                    <Grid container sx={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Grid item xs={3} >
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                                    {t('aboutUsPage.missionTitle')}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                                    {t('aboutUsPage.missionText')}
                                </Typography>
                            </motion.div>
                        </Grid>
                        <Divider orientation='vertical' flexItem sx={{ mx: 2, border: '2px solid', borderColor: 'primary.main' }} />
                        <Grid item xs={3} >
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                                    {t('aboutUsPage.visionTitle')}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                                    {t('aboutUsPage.visionText')}
                                </Typography>
                            </motion.div>
                        </Grid>
                        <Divider orientation='vertical' flexItem sx={{ mx: 2, border: '2px solid', borderColor: 'primary.main' }} />
                        <Grid item xs={3} >
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                                    {t('aboutUsPage.journeyTitle')}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                                    {t('aboutUsPage.journeyText')}
                                </Typography>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Core Values Section */}
            <Container maxWidth="lg" sx={{ py: 5, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                    {t('aboutUsPage.coreValuesTitle')}
                </Typography>
                <Grid container spacing={4} sx={{ mt: 3 }}>
                    {[
                        { icon: <Verified />, title: t('aboutUsPage.coreValueIntegrity'), description: t('aboutUsPage.coreValueIntegrityDescription') },
                        { icon: <EmojiObjects />, title: t('aboutUsPage.coreValueInnovation'), description: t('aboutUsPage.coreValueInnovationDescription') },
                        { icon: <People />, title: t('aboutUsPage.coreValueCustomerFocus'), description: t('aboutUsPage.coreValueCustomerFocusDescription') },
                        { icon: <Star />, title: t('aboutUsPage.coreValueExcellence'), description: t('aboutUsPage.coreValueExcellenceDescription') },
                    ].map((value, index) => (
                        <Grid item xs={12} md={3} key={value.title}>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                                <Card sx={{ p: 3, borderRadius: '10px', boxShadow: 3, height: '220px' }}>
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Box sx={{ bgcolor: 'primary.main', borderRadius: '50%', p: 2, mb: 2 }}>
                                            {value.icon}
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                                            {value.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
                                            {value.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Divider sx={{ my: 5 }} />

            {/* CTA Section */}
            <Container maxWidth="lg" sx={{ py: 5, textAlign: 'center', backgroundColor: 'primary.main', color: 'white', borderRadius: '10px', boxShadow: 2, mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {t('aboutUsPage.ctaTitle')}
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: '600px', mx: 'auto', mb: 3 }}>
                    {t('aboutUsPage.ctaDescription')}
                </Typography>
                <Button variant="contained" color="secondary" onClick={() => navigate('/contact-us')} size="large" sx={{ mt: 3 }}>
                    {t('aboutUsPage.ctaButton')}
                </Button>
            </Container>

            <Divider sx={{ my: 5 }} />

            {/* Testimonial Section */}
            <TestimonySection />

            <Divider sx={{ my: 5 }} />

            {/* Map Location Section */}
            <MapLocationSection />

            <Footer />
            <ScrollToTopButton />
        </Box>
    );
};

export default AboutUsPage;
