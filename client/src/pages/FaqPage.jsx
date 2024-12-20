import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Accordion, AccordionSummary, AccordionDetails, useMediaQuery,
    TextField, Button, Grid, Divider, Card, CardContent, IconButton, Chip, CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';
import { useClinicContext } from '../contexts/ClinicContext';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../services/axiosInstance';
import HeaderSection from '../components/home/HeaderSection';
import Footer from '../components/home/Footer';
import MainHeaderPages from '../components/common/MainHeaderPages';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Main FAQ Page
const FaqPage = () => {
    const { t, i18n } = useTranslation();
    return (
        <>
            <HeaderSection />
            <MainHeaderPages page={t('faqPage.page')} title={t('faqPage.title')} />
            <FaqSection />
            <MapLocation />
            <Footer />
            <ScrollToTopButton />
        </>
    );
};



// Additional Info Component
const AdditionalInfo = () => {
    const { clinicInfo } = useClinicContext();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    if (!clinicInfo) {
        return (
            <Box sx={{ my: 4, p: 3, backgroundColor: 'background.default', borderRadius: 2 }}>
                <Typography variant="h6" align="center" color="error">
                    {t('additionalInfo.error')}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ my: 4, p: 3, backgroundColor: 'background.default', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
                {t('additionalInfo.title')}
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary" paragraph>
                {t('additionalInfo.subtitle')}
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {/* Operating Hours */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3, ':hover': { boxShadow: 6 } }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <IconButton color="primary">
                                    <AccessTimeIcon />
                                </IconButton>
                                <Typography variant="h6" sx={{ ml: 1 }}>
                                    {t('additionalInfo.operatingHours')}
                                </Typography>
                            </Box>
                            {clinicInfo.openHours
                                ? Object.keys(clinicInfo.openHours).map((day, index) => (
                                    <Typography key={index} variant="body2" color="textSecondary">
                                        {t(`days.${day}`)}: {t('days.from')} {clinicInfo.openHours[day].from} -{' '}
                                        {t('days.to')} {clinicInfo.openHours[day].to}
                                    </Typography>
                                ))
                                : <Typography variant="body2" color="textSecondary">{t('additionalInfo.noHours')}</Typography>}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3, ':hover': { boxShadow: 6 } }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <IconButton color="primary">
                                    <LocalPhoneIcon />
                                </IconButton>
                                <Typography variant="h6" sx={{ ml: 1 }}>
                                    {t('additionalInfo.contactInfo')}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                                {t('detect.phone')}: {clinicInfo.phone || t('additionalInfo.noPhone')}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {t('detect.email')}: {clinicInfo.email || t('additionalInfo.noEmail')}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {t('detect.website')}: {clinicInfo.website || t('additionalInfo.noWebsite')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Location Information */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3, ':hover': { boxShadow: 6 } }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <IconButton color="primary">
                                    <LocationOnIcon />
                                </IconButton>
                                <Typography variant="h6" sx={{ ml: 1 }}>
                                    {t('additionalInfo.location')}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                                {t('detect.address')}: {clinicInfo.address?.[i18n.language] || t('additionalInfo.noAddress')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

// FAQ Section Component
const FaqSection = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    const [tags, setTags] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');

    const fetchFaqs = async () => {
        try {
            const response = await axiosInstance.get('/faqs');
            if (response.status === 200) {
                setFaqs(response.data);
                setTags([...new Set(response.data.flatMap(faq => faq.tags))]);
            } else {
                console.error('Failed to fetch FAQs');
            }
        } catch (error) {
            console.error('Failed to fetch FAQs', error);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const faqsData = faqs.map((faq) => ({
        id: faq._id,
        question: isArabic ? faq.question_ar : faq.question_en,
        answer: isArabic ? faq.answer_ar : faq.answer_en,
        tags: faq.tags,
    }));

    // Group FAQs by tag
    const groupedFaqs = faqsData.reduce((groups, faq) => {
        faq.tags.forEach((tag) => {
            if (!groups[tag]) groups[tag] = [];
            groups[tag].push(faq);
        });
        return groups;
    }, {});

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                padding: '50px',
                borderRadius: 8,
                border: '1px solid #ccc',
                backgroundColor: 'background.paper',
                animationIterationCount: 1,
                position: 'relative',
            }}
        >
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12}>
                    <Typography variant="h4" align="center" gutterBottom>
                        {isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
                    </Typography>
                    <Typography variant="body1" align="center" color="textSecondary" paragraph>
                        {isArabic ? 'هنا يمكنك العثور على الأسئلة الشائعة حول خدماتنا' : 'Here you can find frequently asked questions about our services'}
                    </Typography>
                    {/* Tag Filters */}
                    {tags.length > 0 && (
                        <Grid container spacing={1} justifyContent="center">
                            <Grid item>
                                <Chip
                                    label={isArabic ? 'الكل' : 'All'}
                                    color={!selectedTag ? 'primary' : 'default'}
                                    onClick={() => setSelectedTag('')}
                                />
                            </Grid>
                            {tags.map((tag, index) => (
                                <Grid item key={index}>
                                    <Chip
                                        label={tag}
                                        color={selectedTag === tag ? 'primary' : 'default'}
                                        onClick={() => setSelectedTag(tag)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Grid item xs={12} md={6}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', maxHeight: '100%', padding: 2 }}
                >
                    {faqsData
                        .filter((faq) => !selectedTag || faq.tags.includes(selectedTag))
                        .map((faq) => (
                            <Accordion key={faq.id}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', borderBottom: '1px solid #ddd', pb: 1 }}>
                                        <Typography variant="h6">{faq.question}</Typography>
                                        <Typography variant="body2" color="textSecondary">{faq.tags.join(', ')}</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">{faq.answer}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                </Grid>
                <Grid item xs={12} md={6}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', padding: 2 }}
                >
                    <FaqForm />
                    <AdditionalInfo />
                </Grid>
            </Grid>
        </motion.div>
    );
};

// Form Section for User Questions
const FaqForm = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    const [formData, setFormData] = useState({
        question_en: '',
        question_ar: '',
        name: '',
        email: '',
        phone: '',
    });
    const [error, setError] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [messageName, setMessageName] = useState('');
    const [loading, setLoading] = useState(false);

    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                    return t('faqPage.emailInvalid');
                }
                break;
            case 'phone':
                if (value && !/^(01)[0-9]{9}$/.test(value)) {
                    return t('faqPage.phoneInvalid');
                }
                break;
            case 'question_en':
            case 'question_ar':
                if (!value) {
                    return t('faqPage.messageRequired');
                }
                break;
            default:
                return '';
        }
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const createMessage = async () => {
        const newMessage = {
            name: formData.name || 'Anonymous',
            email: formData.email || 'Anonymous',
            phone: formData.phone || 'Anonymous',
            message: formData.question_en || formData.question_ar,
        };
        await axiosInstance.post('/messages', newMessage);
    };

    const createQuestion = async () => {
        const data = {
            question_en: isArabic ? '' : formData.question_en,
            question_ar: isArabic ? formData.question_ar : '',
            name: formData.name || 'Anonymous',
            email: formData.email || 'Anonymous',
            phone: formData.phone || '',
        };
        await axiosInstance.post('/faqs', data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await createQuestion();
            await createMessage();
            setSubmitted(true);
            setMessageName(formData.name);
            setFormData({ question_en: '', question_ar: '', name: '', email: '', phone: '' });
        } catch (error) {
            setError({ general: t('faqPage.submitError') });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (submitted) {
            const timer = setTimeout(() => setSubmitted(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [submitted]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '24px', borderRadius: 8, border: '1px solid #ccc', backgroundColor: 'background.paper' }}
        >
            {submitted && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" align="center" color="primary">
                        {t('faqPage.successMessage')}
                    </Typography>
                    {messageName === 'Anonymous' && (
                        <Typography variant="body2" align="center" color="textSecondary">
                            {t('faqPage.anonymousMessage')}
                        </Typography>
                    )}
                </Box>
            )}
            {error.general && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" align="center" color="error">
                        {error.general}
                    </Typography>
                </Box>
            )}
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" align="center" gutterBottom>
                    {t('faqPage.formTitle')}
                </Typography>
                <TextField
                    name={isArabic ? 'question_ar' : 'question_en'}
                    label={t('faqPage.messageLabel')}
                    value={isArabic ? formData.question_ar : formData.question_en}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    error={!!error[isArabic ? 'question_ar' : 'question_en']}
                    helperText={error[isArabic ? 'question_ar' : 'question_en']}
                />
                <TextField
                    name="name"
                    label={t('faqPage.nameLabel')}
                    value={formData.name}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="email"
                    label={t('faqPage.emailLabel')}
                    value={formData.email}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!error.email}
                    helperText={error.email}
                />
                <TextField
                    name="phone"
                    label={t('faqPage.phoneLabel')}
                    value={formData.phone}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!error.phone}
                    helperText={error.phone}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} />}
                >
                    {t('faqPage.submitButton')}
                </Button>
            </Box>
            <Divider />
        </motion.div>
    );
};

// Map Location Component
const MapLocation = () => {
    const { clinicInfo } = useClinicContext();
    const { t } = useTranslation();
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const mapHeight = isSmallScreen ? 300 : 400;
    const mapLink = clinicInfo.mapLink || 'https://www.google.com/maps';

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h3" align="center" sx={{ mb: 3 }}>
                {t('faqPage.visitUs')}
            </Typography>
            <Box sx={{ height: mapHeight, mt: 2 }}>
                <iframe
                    title={t('faqPage.mapTitle')}
                    src={mapLink}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allowFullScreen
                />
            </Box>
        </Box>
    );
};

export default FaqPage;
