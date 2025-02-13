import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Paper, List, ListItem, ListItemText, ListItemAvatar, Divider, CircularProgress, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { BorderBottom, CheckCircle } from '@mui/icons-material';
import { fetchServices } from "../../services/servicesService";
import backgroundImage from '../../assets/images/m_mabrouk.jpg';



const ServicesSection = () => {
    const { mode: themeMode } = useCustomTheme();
    const isDark = themeMode === 'dark';
    const { t, i18n } = useTranslation();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hoveredService, setHoveredService] = useState(null); // Added state for hover effect
    const isArabic = i18n.language === 'ar';

    useEffect(() => {
        fetchServicesData();
    }, []);

    const fetchServicesData = async () => {
        setLoading(true);
        try {
            fetchServices().then((services) => {
                setServices(services.filter((service) => service.isActive));
            }).catch((error) => {
                console.error('Error fetching services:', error);
            }).finally(() => {
                setLoading(false);
            });
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    }


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 500 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 10 }}>
            <Container sx={{ py: 5, textAlign: 'center' }}>
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: 'primary.main',
                            fontFamily: '"Cairo Play", serif',
                            letterSpacing: '1px',
                        }}
                    >
                        {t('servicesSection.title')}
                    </Typography>
                    <Typography
                        sx={{
                            mt: 2,
                            maxWidth: { xs: '100%', sm: 600 },
                            mx: 'auto',
                            color: isDark ? '#ddd' : '#555',
                            fontSize: { xs: '1.1rem', md: '1.2rem' },
                            lineHeight: 1.7,
                            fontFamily: 'Roboto, sans-serif',
                        }}
                    >
                        {t('servicesSection.description')}
                    </Typography>
                    <Box
                        sx={{
                            mt: 3,
                            width: 120,
                            height: 5,
                            backgroundColor: 'primary.main',
                            mx: 'auto',
                            borderRadius: 5,
                        }}
                    />
                </motion.div>

                {/* Services Grid */}
                <Grid container spacing={4} justifyContent="center" sx={{ mt: 6 }}>
                    {services?.slice(0, 8).map((service, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={service._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                            >
                                <Card
                                    onMouseEnter={() => setHoveredService(index)}
                                    onMouseLeave={() => setHoveredService(null)}
                                    sx={{
                                        height: '100%',
                                        minHeight: 250,
                                        textAlign: 'center',
                                        borderRadius: '30px',
                                        background: isDark
                                            ? 'linear-gradient(165deg, #2a2a2a, #1b1b1b)'
                                            : 'linear-gradient(165deg, #ffffff, #f8f9fa)',
                                        boxShadow: hoveredService === index
                                            ? (isDark
                                                ? '0 30px 60px rgba(255, 255, 255, 0.2)'
                                                : '0 30px 60px rgba(0, 0, 0, 0.15)')
                                            : (isDark
                                                ? '0 15px 35px rgba(255, 255, 255, 0.05)'
                                                : '0 15px 35px rgba(0, 0, 0, 0.08)'),
                                        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        border: isDark
                                            ? '1px solid rgba(255, 255, 255, 0.08)'
                                            : '1px solid rgba(0, 0, 0, 0.03)',
                                        transform: hoveredService === index ? 'translateY(-20px) scale(1.02)' : 'translateY(0) scale(1)',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0))',
                                            opacity: hoveredService === index ? 1 : 0,
                                            transition: 'opacity 0.6s ease',
                                            zIndex: 1,
                                        },
                                    }}
                                >
                                    {/* Icon Section */}
                                    <Box
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 2,
                                            background: isDark
                                                ? 'linear-gradient(145deg, #ff6b6b, #ffa502)'
                                                : 'linear-gradient(145deg, #3b82f6, #34d399)',
                                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
                                        }}
                                    >
                                        <img
                                            src={service.icon}
                                            alt={service.title.en}
                                            style={{
                                                width: '60%',
                                                height: '60%',
                                                objectFit: 'contain',
                                            }}
                                        />
                                    </Box>

                                    {/* Content */}
                                    <CardContent>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '1.3rem',
                                                color: 'text.primary',
                                                fontFamily: 'Poppins, sans-serif',
                                            }}
                                        >
                                            {isArabic ? service.title.ar : service.title.en}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mt: 1.5,
                                                color: isDark ? '#ccc' : '#666',
                                                fontSize: '1rem',
                                                lineHeight: 1.6,
                                                fontFamily: 'Roboto, sans-serif',
                                            }}
                                        >
                                            {isArabic
                                                ? service.details.ar
                                                : service.details.en
                                            }
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>


            {/* About Section */}
            <Box
                sx={{
                    mt: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(45deg, #3B969F, #2F8DF7, #2CB9BF, #2F8DF7, #3B969F)',
                    overflow: 'hidden',
                }}
            >
                <Grid container >
                    {/* Image Section */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            style={{ width: '100%', height: '100%', overflow: 'hidden' }}
                        >
                            <img src={backgroundImage} alt="About Us" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </motion.div>
                    </Grid>

                    {/* Text Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 4, }}>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 3,
                                        textAlign: isArabic ? 'right' : 'left',
                                        fontFamily: 'Poppins',
                                        fontSize: { xs: '2rem', sm: '2.5rem' },
                                        color: 'white',
                                        fontShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    {t('servicesSection.featureSection.title')}
                                </Typography>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        my: 3,
                                        color: 'white',
                                        textAlign: isArabic ? 'right' : 'left',
                                    }}
                                >
                                    {t('servicesSection.featureSection.description')}
                                </Typography>
                            </motion.div>

                            <Divider sx={{ width: '70%', my: 3, mx: 0 }} />

                            {/* List Section */}
                            <List>
                                {services.slice(0, 7).map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 * index }}
                                    >

                                        <ListItem disablePadding>
                                            <ListItemAvatar>
                                                <CheckCircle fontSize="large" sx={{ mx: 2, color: '#fff' }} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        variant="h6"
                                                        align={isArabic ? 'right' : 'left'}
                                                        sx={{ fontWeight: 'bold', color: 'white', fontFamily: 'sans-serif' }}>
                                                        {isArabic ? item.title.ar : item.title.en}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography
                                                        variant="body2"
                                                        align={isArabic ? 'right' : 'left'}
                                                        sx={{ color: 'white' }}>
                                                        {(isArabic ? item.description.ar : item.description.en).slice(0, 100)}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    </motion.div>
                                ))}
                            </List>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default ServicesSection;