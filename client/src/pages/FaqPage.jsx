import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Accordion, AccordionSummary, AccordionDetails,
    TextField, Button, Grid, Divider, Card, CardContent, IconButton, Chip,
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
            <FaqLayout />
            <MapLocation />
            <Footer />
            <ScrollToTopButton />
        </>
    );
};

// Layout for FAQ Sections and Form
const FaqLayout = () => (
    <Grid container spacing={3} justifyContent="center" sx={{ p: 3 }}>
        <Grid item xs={12} >
            <FaqSection />
        </Grid>
        {/* <Grid item xs={12} md={5}>
            <FaqForm />
            <AdditionalInfo />
        </Grid> */}
    </Grid>
);

// Additional Info Component
const AdditionalInfo = () => {
    const { clinicInfo } = useClinicContext();
    const { t, i18n } = useTranslation();


    return (
        <Box sx={{ my: 4, p: 3, backgroundColor: 'background.default', borderRadius: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
                {t('additionalInfo.title')}
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary" paragraph>
                {t('additionalInfo.subtitle')}
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {/* Operating Hours */}
                <Grid item xs={12}>
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <IconButton color="primary"><AccessTimeIcon /></IconButton>
                                <Typography variant="h6" sx={{ ml: 1 }}>{t('additionalInfo.operatingHours')}</Typography>
                            </Box>
                            {Object.keys(clinicInfo.openHours).map((day, index) => (
                                <Typography key={index} variant="body2" color="textSecondary">
                                    {t(`days.${day}`)} : {t('days.from')} {clinicInfo.openHours[day].from} - {t('days.to')} {clinicInfo.openHours[day].to}
                                </Typography>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12} >
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <IconButton color="primary"><LocalPhoneIcon /></IconButton>
                                <Typography variant="h6" sx={{ ml: 1 }}>{t('additionalInfo.contactInfo')}</Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary"> {t('detect.phone')} : {clinicInfo.phone}</Typography>
                            <Typography variant="body2" color="textSecondary">{t('detect.email')} : {clinicInfo.email}</Typography>
                            <Typography variant="body2" color="textSecondary">{t('detect.website')} : {clinicInfo.website}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Location Information */}
                <Grid item xs={12} >
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <IconButton color="primary"><LocationOnIcon /></IconButton>
                                <Typography variant="h6" sx={{ ml: 1 }}>{t('additionalInfo.location')}</Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary">{t('detect.address')} : {clinicInfo.address[i18n.language]}</Typography>
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
                padding: '24px',
                borderRadius: 8,
                border: '1px solid #ccc',
                backgroundColor: 'background.paper',
                animationIterationCount: 1,
            }}
        >
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" align="center" gutterBottom>
                        {isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
                    </Typography>
                    <Typography variant="body1" align="center" color="textSecondary" paragraph>
                        {isArabic ? 'هنا يمكنك العثور على الأسئلة الشائعة حول خدماتنا' : 'Here you can find frequently asked questions about our services'}
                    </Typography>
                    {/* Tag Filters */}
                    {tags.length > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            <Chip label={isArabic ? 'الكل' : 'All'} onClick={() => setSelectedTag('')} color={selectedTag ? 'default' : 'primary'} />
                            {groupedFaqs && Object.keys(groupedFaqs).map((tag) => (
                                <Chip key={tag} label={tag} onClick={() => setSelectedTag(tag)} color={selectedTag === tag ? 'primary' : 'default'} />
                            ))}
                        </Box>
                    )}
                </Grid>
                <Grid item xs={12} md={6}
                    sx={{
                        height: '100vh',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        px: { xs: 2, md: 0 },
                        borderLeft: isArabic ? '1px solid #ddd' : 'none',
                        borderRight: isArabic ? 'none' : '1px solid #ddd',
                    }}
                >
                    {Object.keys(groupedFaqs).map((tag) => (
                        (!selectedTag || selectedTag === tag) && (
                            <Box key={tag} sx={{ mb: 2 }}>
                                <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                                    {tag}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    {groupedFaqs[tag].map((faq) => (
                                        <Card key={faq.id} sx={{ mb: 2, boxShadow: 3 }}>
                                            <Accordion sx={{ border: 'none' }}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                    sx={{ backgroundColor: 'background.default' }}
                                                >
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                        {faq.question}
                                                    </Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Typography variant="body1" sx={{ color: '#333' }}>
                                                        {faq.answer}
                                                    </Typography>
                                                </AccordionDetails>
                                            </Accordion>
                                        </Card>
                                    ))}
                                </Box>
                            </Box>
                        )
                    ))}
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
        phone: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [messageName, setMessageName] = useState('');

    const createMessage = async () => {
        const newMessage = {
            name: formData.name || 'Anonymous',
            email: formData.email || 'Anonymous',
            phone: formData.phone || 'Anonymous',
            message: formData.question_en || formData.question_ar
        };

        try {
            const response = await axiosInstance.post('/messages', newMessage);
            if (response.status === 201) {
                setSubmitted(true);
                setMessageName(formData.name);
            }
        } catch (error) {
            setError(`Error creating message: ${error.message}`);
        }
    };

    const validateData = () => {
        if (!formData.question_en && !formData.question_ar) {
            setError(t('faqPage.messageRequired'));
            return;
        }
        if (!formData.email && !formData.phone && !formData.name) {
            setError(t('faqPage.contactRequired'));
            return;
        }
        if (formData.email) {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(formData.email)) {
                setError(t('faqPage.emailInvalid'));
                return;
            }
        }
        if (formData.phone) {
            // Phone number must be 11 digits and must be egyption number
            const phonePattern = /^(01)[0-9]{9}$/;
            if (!phonePattern.test(formData.phone)) {
                setError(t('faqPage.phoneInvalid'));
                return;
            }
        }
        setError('');
    };

    const createQuestion = async () => {

        validateData();
        const data = {
            question_en: isArabic ? '' : formData.question_en,
            question_ar: isArabic ? formData.question_ar : '',
            name: formData.name || 'Anonymous',
            email: formData.email || 'Anonymous',
            phone: formData.phone
        };
        try {
            const response = await axiosInstance.post('/faqs', data);
            if (response.status === 201) await createMessage();
            setFormData({ question_en: '', question_ar: '', name: '', email: '', phone: '' });
        } catch (error) {
            setError(`Error creating question: ${error.message}`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createQuestion();
    };

    useEffect(() => {
        if (submitted || error) {
            const timer = setTimeout(() => {
                setSubmitted(false);
                setError('')
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [submitted, error]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '24px', backgroundColor: 'background.paper', borderRadius: 8, border: '1px solid' }}
        >
            {submitted && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" align="center" color="primary" gutterBottom>
                        {t('faqPage.successMessage')}
                    </Typography>
                    {messageName === 'Anonymous' && (
                        <Typography variant="body2" align="center" color="textSecondary">
                            {t('faqPage.anonymousMessage')}
                        </Typography>
                    )}
                </Box>
            )}
            {error && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" align="center" color="error" gutterBottom>
                        {error}
                    </Typography>
                </Box>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
                <Typography variant="h6" align="center" gutterBottom>
                    {t('faqPage.formTitle')}
                </Typography>
                <TextField
                    name={isArabic ? 'question_ar' : 'question_en'}
                    label={t('faqPage.messageLabel')}
                    value={isArabic ? formData.question_ar : formData.question_en}
                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    required
                />
                <TextField name="name" label={t('faqPage.nameLabel')} value={formData.name} required onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} variant="outlined" fullWidth margin="normal" />
                <TextField name="email" label={t('faqPage.emailLabel')} value={formData.email} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} variant="outlined" fullWidth margin="normal" />
                <TextField name="phone" label={t('faqPage.phoneLabel')} value={formData.phone} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} variant="outlined" fullWidth margin="normal" />
                <Button type="submit" variant="contained" color="primary" fullWidth>{t('faqPage.submitButton')}</Button>
            </Box>
            <Divider />

        </motion.div>
    );
};

// Map Location Component
const MapLocation = () => {
    const { clinicInfo } = useClinicContext();
    const { t } = useTranslation();

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h3" align='center' sx={{ mb: 3 }}>{t('faqPage.visitUs')}</Typography>
            <Box sx={{ height: 400, mt: 2 }}>
                <iframe title="Map Location" src={clinicInfo.mapLink} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
            </Box>
        </Box>
    );
};



export default FaqPage;
