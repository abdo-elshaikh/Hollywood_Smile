import React, { useState } from 'react';
import { Box, Container, TextField, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axiosInstance from '../../services/axiosInstance';

const NewsletterSection = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [subscription, setSubscription] = useState({ email: '' });
    const showSnackbar = useSnackbar();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // check mail validation
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(subscription.email)) {
            isArabic ? showSnackbar('الرجاء إدخال بريد إلكتروني صالح', 'error') : showSnackbar('Please enter a valid email', 'error');
            return;
        }
        try {
            const { data } = await axiosInstance.post('/subscribe', subscription);
            isArabic ? showSnackbar('تم الاشتراك بنجاح', 'success') : showSnackbar('Subscribed successfully', 'success');
            setSubscription({ email: '' });
        } catch (error) {
            if (error.response.status === 400) isArabic ? showSnackbar('البريد الإلكتروني مشترك بالفعل', 'info') : showSnackbar('Email already subscribed', 'info');
            else isArabic ? showSnackbar('حدث خطأ ما', 'error') : showSnackbar('Something went wrong', 'error');
        }
    };

    const handleInputChange = (e) => {
        setSubscription({ email: e.target.value });
    };

    return (
        <Box
            component={motion.section}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            sx={{
                position: 'relative',
                zIndex: 1,
                height: { xs: '300px', md: '400px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(45deg, #2F89FC, #21AAC4)',
                py: { xs: 4, md: 8 },
            }}
        >
            <Container
                maxWidth="md"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h3" sx={{ mb: 2, color: 'white' }}>
                    {t('newsletterSection.title')}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 4, color: 'white' }}>
                    {t('newsletterSection.description')}
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        position: 'relative',
                        width: '100%',
                        maxWidth: '600px',
                    }}
                >
                    <TextField
                        variant="outlined"
                        autoComplete="off"
                        placeholder={t('newsletterSection.placeholder')}
                        required
                        value={subscription.email}
                        onChange={handleInputChange}
                        sx={{
                            flexGrow: 1,
                            backgroundColor: 'background.paper',
                            borderRadius: isArabic ? '0 20px 20px 0' : '20px 0 0 20px',
                            '& .MuiOutlinedInput-root fieldset': {
                                border: '1px solid white',
                                borderRadius: isArabic ? '0 20px 20px 0' : '20px 0 0 20px',
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        variant="outlined"
                        sx={{
                            borderRadius: isArabic ? '20px 0 0 20px' : '0 20px 20px 0',
                            backgroundColor: 'transparent',
                            border: '1px solid white',
                            color: 'white',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s ease',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                        }}
                    >
                        {t('newsletterSection.submit')}
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default NewsletterSection;
