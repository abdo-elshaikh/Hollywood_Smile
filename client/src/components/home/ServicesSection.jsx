import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Paper, List, ListItem, ListItemText, ListItemAvatar, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from '@mui/icons-material';
import { fetchServices } from "../../services/servicesService";
import backgroundImage from '../../assets/images/m_mabrouk.jpg';


const featurePoints = [
    {
        title: 'Experienced Dentists',
        description: 'Our team of highly experienced professionals ensures the best care for your smile.',
    },
    {
        title: 'High-Tech Facilities',
        description: 'We use the latest technology to provide efficient and effective treatments.',
    },
    {
        title: 'Comfortable Clinics',
        description: 'Our clinics are designed to make you feel at home during your visits.',
    },
    {
        title: 'Personalized Care',
        description: 'We take the time to understand your unique needs and provide personalized care.',
    },
    {
        title: 'Affordable Prices',
        description: 'We offer high-quality dental services at affordable prices for everyone.',
    }
];

const tFeaturePoints = [
    {
        "title": "أطباء أسنان ذوي خبرة",
        "description": "فريقنا من المحترفين ذوي الخبرة يضمن أفضل رعاية لابتسامتك.",
    },
    {
        "title": "تقنيات متقدمة",
        "description": "التقنيات المتطورة لدينا تمكننا من تقديم خدمات طب الأسنان المتميزة.",
    },
    {
        "title": "رعاية مخصصة",
        "description": "نأخذ الوقت لفهم احتياجاتك الفريدة وتقديم رعاية مخصصة لك.",
    },
    {
        "title": "عيادات مريحة",
        "description": "تم تصميم عياداتنا لجعلك تشعر بأنك في منزلك خلال زياراتك.",
    },
    {
        "title": "أسعار معقولة",
        "description": "نقدم خدمات طب الأسنان عالية الجودة بأسعار معقولة للجميع.",
    }
]

const ServicesSection = () => {
    const { mode: themeMode } = useCustomTheme();
    const { t, i18n } = useTranslation();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const isArabic = i18n.language === 'ar';

    useEffect(() => {
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

        fetchServicesData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ bgcolor: 'background.default', py: 10 }}>
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, textAlign: 'center', color: 'primary.main' }}>
                        {t('servicesSection.title')}
                    </Typography>
                    <Typography sx={{ mb: 5, maxWidth: 600, mx: 'auto', color: themeMode === 'dark' ? '#ccc' : '#555', textAlign: 'center' }}>
                        {t('servicesSection.description')}
                    </Typography>
                </motion.div>

                <Grid container spacing={4} justifyContent="center">
                    {services?.map((service, index) => (
                        <Grid item xs={12} sm={6} md={3} key={service._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 4,
                                        textAlign: 'center',
                                        borderRadius: 2,
                                        transition: 'transform 0.3s',
                                        height: 350,
                                        bgcolor: themeMode === 'dark' ? '#2A2A2A' : '#fff',
                                        '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            mx: 'auto',
                                            mb: 2,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #2F8DF7, #2CB9BF)',
                                        }}
                                    >
                                        <img src={service.icon} alt={service.title.en} style={{ width: '100%', height: '100%' }} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.2rem', mb: 1, fontFamily: 'Poppins' }}>
                                        {isArabic ? service.title.ar : service.title.en}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: themeMode === 'dark' ? '#ccc' : '#555', mt: 1, fontWeight: 400 }}>
                                        {isArabic ? service.description.ar : service.description.en}
                                    </Typography>
                                </Paper>
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
                                        color: '#FC8F54',
                                        mb: 3,
                                        textAlign: isArabic ? 'right' : 'left',
                                        fontFamily: 'Poppins',
                                        fontSize: { xs: '2rem', sm: '2.5rem' },
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
                                        color: '#FFDDAE',
                                        my: 3,
                                        textAlign: isArabic ? 'right' : 'left',
                                    }}
                                >
                                    {t('servicesSection.featureSection.description')}
                                </Typography>
                            </motion.div>

                            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.5)', my: 3 }} />
                            <List sx={{ mt: 4 }}>
                                <FeaturePoint features={isArabic ? tFeaturePoints : featurePoints} isArabic={isArabic} />
                            </List>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

const FeaturePoint = ({ features, isArabic }) => {
    return (
        <>
            {
                features?.map((feature, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.3 }}
                        key={index}
                    >
                        <ListItem sx={{ p: 0, mb: 3, textAlign: isArabic ? 'right' : 'left' }}>
                            <ListItemAvatar>
                                <CheckCircle
                                    sx={{
                                        color: '#fff',
                                        fontSize: 50,
                                        transition: 'color 0.3s ease-in-out',
                                        '&:hover': { color: '#FFDDAE' },

                                    }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={feature.title}
                                secondary={feature.description}
                                primaryTypographyProps={{
                                    sx: { color: '#fff', fontWeight: 600, fontSize: 18 },
                                }}
                                secondaryTypographyProps={{
                                    sx: { color: 'rgba(255, 255, 255, 0.8)' },
                                }}
                            />
                        </ListItem>
                    </motion.div>
                ))
            }
        </>
    )
};

export default ServicesSection;
