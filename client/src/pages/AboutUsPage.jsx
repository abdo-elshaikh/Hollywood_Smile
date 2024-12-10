import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Divider, CardMedia, Avatar, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Verified, EmojiObjects, People, Star, CheckCircleOutline } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useCustomTheme } from '../contexts/ThemeProvider';
import HeaderSection from '../components/home/HeaderSection';
import Footer from '../components/home/Footer';
import bgImage from '../assets/videos/girl_smile2.mp4';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import TestimonySection from '../components/home/TestimonySection';
import MapLocationSection from '../components/home/MapLocationSection';
import SmileLoveCare from '../components/home/SmileLoveCare';
import image1 from '../assets/images/bg_2.jpg';
import image2 from '../assets/images/dental-care.jpg';

const AboutUsPage = () => {
    const { t, i18n } = useTranslation();
    const { mode } = useCustomTheme();
    const navigate = useNavigate();
    const isDark = mode === 'dark';
    const isArabic = i18n.language === 'ar';

    const content = {
        en: {
            title: 'About Hollywood Smile Center',
            description:
                'At Hollywood Smile Center, we combine expertise, innovation, and compassion to give you a smile that truly shines. Your journey to a radiant smile begins here.',
            whyChooseUs: 'Why Choose Us?',
            chooseUsDetails: [
                {
                    title: 'Highly Skilled Dentists',
                    description:
                        'Our team is dedicated to providing expert care with personalized treatment plans.',
                },
                {
                    title: 'State-of-the-Art Facilities',
                    description:
                        'We use the latest technology to ensure the best outcomes for every procedure.',
                },
                {
                    title: 'Comprehensive Dental Care',
                    description:
                        'From routine cleanings to advanced cosmetic dentistry, we do it all.',
                },
                {
                    title: 'Patient-First Approach',
                    description:
                        'We prioritize your comfort and confidence at every step of your treatmentt.',
                },
            ],
            cta: 'Ready to Transform Your Smile?',
            ctaText: 'Book an appointment today and experience the Hollywood Smile difference!',
            ctaButton: 'Book Now',
            ourStory: 'Our Story',
            ourStoryText:
                'Hollywood Smile Center was founded with the goal of providing exceptional dental care in a welcoming and comfortable environment. Our team of skilled dentists is committed to helping you achieve a healthy and beautiful smile.',
            ourValues: 'Our Values',
            ourValuesText:
                'We believe in providing the highest quality dental care with a focus on patient comfort and satisfaction. Our team is dedicated to helping you achieve a healthy and beautiful smile.',
        },
        ar: {
            title: 'عن مركز هوليوود سمايل',
            description:
                'في مركز هوليوود سمايل، نجمع بين الخبرة والابتكار والرعاية لنمنحك ابتسامة متألقة. رحلتك إلى الابتسامة المثالية تبدأ هنا.',
            whyChooseUs: 'لماذا تختارنا؟',
            chooseUsDetails: [
                {
                    title: 'أطباء أسنان مهرة',
                    description:
                        'فريقنا مكرس لتقديم رعاية احترافية مع خطط علاج مخصصة لكل مريض.',
                },
                {
                    title: 'مرافق متطورة',
                    description:
                        'نستخدم أحدث التقنيات لضمان أفضل النتائج في كل إجراء.',
                },
                {
                    title: 'رعاية شاملة للأسنان',
                    description:
                        'من تنظيف الأسنان الروتيني إلى طب الأسنان التجميلي المتقدم، نحن نقوم بكل شيء.',
                },
                {
                    title: 'نهج يركز على المريض',
                    description:
                        'نحن نعطي الأولوية لراحتك وثقتك في كل خطوة من خطوات العلاج.',
                },
            ],
            cta: 'هل أنت مستعد لتغيير ابتسامتك؟',
            ctaText:
                'احجز موعدًا اليوم واختبر الفرق مع مركز هوليوود سمايل!',
            ctaButton: 'احجز الآن',
            ourStory: 'قصتنا',
            ourStoryText:
                'تأسس مركز هوليوود سمايل بهدف تقديم رعاية أسنان استثنائية في بيئة مرحبة ومريحة. فريقنا من أطباء الأسنان المهرة ملتزم بمساعدتك على تحقيق ابتسامة صحية وجميلة.',

            ourValues: 'قيمنا',
            ourValuesText:
                'نحن نؤمن بتقديم أعلى مستوى من الرعاية الطبية بتركيز على راحة المريض ورضاه. فريقنا مكرس لمساعدتك على تحقيق ابتسامة صحية وجميلة.',
        },
    };

    const tt = content[i18n.language];
    return (
        <Box

        >
            <HeaderSection />

            {/* Hero Section */}
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    color: 'white',
                    textAlign: 'center',
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
                        zIndex: 1,
                        filter: 'brightness(50%)',
                    }}
                />

                {/* Gradient Overlay */}
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

                {/* Content Container */}
                <Container sx={{ position: 'relative', zIndex: 3 }}>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
                        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                            {t('aboutUsPage.title')}
                        </Typography>
                        <Typography variant="h5" sx={{ maxWidth: '600px', mx: 'auto', lineHeight: 1.6 }}>
                            {t('aboutUsPage.subtitle')}
                        </Typography>
                    </motion.div>
                </Container>

                {/* Mission, Vision, and Journey Section */}
                <Container
                    maxWidth="lg"
                    sx={{
                        position: 'relative',
                        top: '20%',
                        zIndex: 3,
                        display: 'flex',
                        justifyContent: 'space-around',
                        flexWrap: 'wrap',
                        gap: 4,
                        mt: 8,
                    }}
                >
                    {[
                        { title: t('aboutUsPage.missionTitle'), text: t('aboutUsPage.missionText') },
                        { title: t('aboutUsPage.visionTitle'), text: t('aboutUsPage.visionText') },
                        { title: t('aboutUsPage.journeyTitle'), text: t('aboutUsPage.journeyText') },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: index * 0.2 }}
                            style={{
                                flex: '1 1 calc(30% - 20px)',
                                borderRadius: 8,
                                boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                                padding: '20px',
                                textAlign: 'center',
                                border: '1px solid',
                                borderColor: 'primary.main',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
                            }}
                        >
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                                {item.title}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                                {item.text}
                            </Typography>
                        </motion.div>
                    ))}
                </Container>
            </Box>



            {/* About Us Content */}
            <Box sx={{ py: 8, direction: isArabic ? 'rtl' : 'ltr' }}>
                <Container maxWidth="lg">
                    <Box textAlign="center" mb={6}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                textTransform: 'uppercase',
                                mb: 2,
                            }}
                        >
                            {tt.title}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: 'textt.secondary', maxWidth: '600px', mx: 'auto' }}
                        >
                            {tt.description}
                        </Typography>
                    </Box>

                    {/* Content Section */}
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: '100%',
                                    boxShadow: 4,
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={image1}
                                    alt="About Us"
                                    sx={{ width: '100%', minHeight: 300, objectFit: 'cover' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        {tt.ourStory}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                        {tt.ourStoryText}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: '100%',
                                    boxShadow: 4,
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={image2}
                                    alt="3D Logo"
                                    sx={{ width: '100%', minHeight: 300, objectFit: 'cover' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        {tt.ourValues}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                        {tt.ourValuesText}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>


                    {/* Why Choose Us Section */}
                    <Box sx={{ mt: 8 }}>
                        <Typography
                            variant="h4"
                            align="center"
                            sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}
                        >
                            {tt.whyChooseUs}
                        </Typography>
                        <Divider sx={{ mb: 4, mx: 'auto', width: '200px' }} />

                        <Grid container spacing={4}>
                            {tt.chooseUsDetails.map((item, index) => (
                                <Grid key={index} item xs={12} sm={6} md={3}>
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            p: 3,
                                            bgcolor: 'background.paper',
                                            borderRadius: 4,
                                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                            },
                                        }}
                                    >
                                        <CheckCircleOutline
                                            color="primary"
                                            sx={{ fontSize: 40, mb: 2 }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'textt.secondary', fontSize: '0.9rem' }}
                                        >
                                            {item.description}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Call-to-Action Section */}
                    <Box
                        sx={{
                            mt: 10,
                            textAlign: 'center',
                            bgcolor: 'primary.main',
                            color: 'white',
                            py: 6,
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                            {tt.cta}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            {tt.ctaText}
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{
                                textTransform: 'uppercase',
                                px: 4,
                                py: 1.5,
                                fontWeight: 'bold',
                            }}
                            onClick={() => navigate('/booking')}
                        >
                            {tt.ctaButton}
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Smile, Love, Care Section */}
            <SmileLoveCare />

            {/* CTA Section */}
            <Box sx={{
                py: 8,
                textAlign: 'center',
                bgcolor: 'background.paper',
                direction: isArabic ? 'rtl' : 'ltr',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
            }}>
                {/* CTA Section */}
                <Container maxWidth="lg" sx={{ py: 5, textAlign: 'center', backgroundColor: 'primary.main', color: 'white', borderRadius: 3, boxShadow: 2, mb: 4 }}>
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
            </Box>


            {/* Testimonial Section */}
            <TestimonySection />

            {/* Map Location Section */}
            <MapLocationSection />

            <Footer />
            <ScrollToTopButton />
        </Box>
    );
};

export default AboutUsPage;
