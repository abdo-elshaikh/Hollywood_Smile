import {
    Box,
    Button,
    Card,
    Chip,
    Divider,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useClinicContext } from '../../contexts/ClinicContext';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import { useCustomTheme } from '../../contexts/ThemeProvider';
import { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

const InformationSection = () => {
    const { t, i18n } = useTranslation();
    const { clinicInfo } = useClinicContext();
    const { mode } = useCustomTheme();
    const isDark = mode === 'dark';
    const showSnackbar = useSnackbar();
    const isArabic = i18n.language === 'ar';
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = t('ContactSection.nameRequired');
        if (!formData.phone) newErrors.phone = t('ContactSection.phoneRequired');
        if (
            formData.phone &&
            !/^(010|011|012|015)[0-9]{8}$/.test(formData.phone)
        ) {
            newErrors.phone = t('ContactSection.phoneInvalid');
        }
        if (!formData.message)
            newErrors.message = t('ContactSection.messageRequired');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) {
            return showSnackbar(t('ContactSection.validationMessage'), 'error');
        }
        try {
            const response = await axiosInstance.post('/messages', formData);
            showSnackbar(
                response.status === 201
                    ? t('ContactSection.successMessage')
                    : t('ContactSection.errorMessage'),
                response.status === 201 ? 'success' : 'error'
            );
            setFormData({ name: '', phone: '', email: '', message: '' });
        } catch (error) {
            console.error(error);
            showSnackbar(t('ContactSection.errorMessage'), 'error');
        }
    };

    return (
        <Grid container>
            {/* Working Hours Section */}
            <Grid item xs={12} md={4}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 2,
                        borderRight: '1px solid #ddd',
                        backgroundColor: 'primary.main',
                        height: '100%',
                        color: '#fff',
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {isArabic ? 'ساعات العمل' : 'Working Hours'}
                    </Typography>
                    {Object.keys(clinicInfo?.openHours || {}).map(day => (
                        <Box key={day} sx={{ display: 'flex', alignItems: 'center', mb: 1, borderBottom: '1px solid', gap: 2 }}>

                            <Typography variant="h6" >
                                {t(`days.${day}`)}:
                            </Typography>
                            {/* <Box sx={{ flexGrow: 1 }} /> */}
                            <Typography align='center' variant="body1">
                                {clinicInfo?.openHours[day].isClosed ? t('days.closed') : `${clinicInfo?.openHours[day].from.toLowerCase().replace(/am|pm/g, (m) => t(`days.${m}`))} - ${clinicInfo?.openHours[day].to.toLowerCase().replace(/am|pm/g, (m) => t(`days.${m}`))}`}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Grid>

            {/* Contact Information Section */}
            <Grid item xs={12} md={4}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 2,
                        backgroundColor: '#C6E7FF',
                        height: '100%',
                        color: '#333',
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {isArabic ? 'معلومات التواصل' : 'Contact Information'}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1"  sx={{ mb: 1 }}>
                        {isArabic ? ' العنوان' : 'Address '}:{' '}
                        {isArabic ? clinicInfo?.address.ar : clinicInfo?.address.en}
                    </Typography>
                    <Typography variant="body1"  sx={{ mb: 1 }}>
                        {isArabic ? ' رقم الهاتف' : 'Phone '}: {clinicInfo?.phone}
                    </Typography>
                    <Typography variant="body1"  sx={{ mb: 1 }}>
                        {isArabic ? 'البريد الإلكتروني' : 'Email '}: {clinicInfo?.email}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        {isArabic ? ' الموقع الالكتروني' : 'Website '}:{' '}
                        {clinicInfo?.website}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        {Object.keys(clinicInfo?.socialLinks || {}).map((social) => (
                            <Chip
                                key={social}
                                label={social}
                                component="a"
                                href={clinicInfo.socialLinks[social]}
                                target="_blank"
                                clickable
                                color="primary"
                                variant="outlined"
                            />
                        ))}
                    </Box>
                </Box>
            </Grid>

            {/* Contact Us Form Section */}
            <Grid item xs={12} md={4}>
                <Box
                    sx={{
                        backgroundColor: '#C6E7FF',
                        height: '100%',
                        p: 4,
                    }}
                >
                    <Card
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: 2,
                            backgroundColor: 'background.default',
                            color: 'text.primary',
                            borderRadius: 2,
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            {isArabic ? 'تواصل معنا' : 'Contact Us'}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            <TextField
                                label={isArabic ? 'الاسم' : 'Name'}
                                variant="outlined"
                                fullWidth
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                error={!!errors.name}
                                helperText={errors.name}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label={isArabic ? 'رقم الهاتف' : 'Phone'}
                                variant="outlined"
                                fullWidth
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({ ...formData, phone: e.target.value })
                                }
                                error={!!errors.phone}
                                helperText={errors.phone}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label={isArabic ? 'البريد الإلكتروني (اختياري)' : 'Email address (optional)' }
                                variant="outlined"
                                fullWidth
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label={isArabic ? 'الرسالة' : 'Message'}
                                variant="outlined"
                                multiline
                                rows={4}
                                fullWidth
                                value={formData.message}
                                onChange={(e) =>
                                    setFormData({ ...formData, message: e.target.value })
                                }
                                error={!!errors.message}
                                helperText={errors.message}
                                sx={{ mb: 2 }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                {isArabic ? 'إرسال' : 'Send'}
                            </Button>
                        </form>
                    </Card>
                </Box>
            </Grid>
        </Grid >
    );
};

export default InformationSection;
