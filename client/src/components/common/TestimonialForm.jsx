import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Avatar,
    Typography,
    Divider,
    Modal,
    Rating,
    IconButton
} from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import axiosInstance from '../../services/axiosInstance';
import { uploadFile, deleteFile } from '../../services/supabaseService';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import { useNavigate } from 'react-router-dom';

const TestimonialForm = ({ testimonial = null, open, setOpen }) => {
    const { user } = useAuth();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const showSnackbar = useSnackbar();
    const navigate = useNavigate();

    const defaultFormData = {
        name: user?.name || '',
        position: user?.role || 'Visitor',
        quote: '',
        rating: 0,
        show: false,
        imgUrl: user?.avatarUrl || '',
        user: user?._id || null,
    };

    const [formData, setFormData] = useState(testimonial || defaultFormData);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData(testimonial || defaultFormData);
    }, [testimonial]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!user) {
            showSnackbar(t('loginRequired'), 'error');
            return;
        }
        if (!formData.name || !formData.quote) {
            showSnackbar(t('fillRequiredFields'), 'error');
            return;
        }

        setLoading(true);
        try {
            if (testimonial) {
                await axiosInstance.put(`/testimonials/${testimonial._id}`, formData);
            } else {
                await axiosInstance.post('/testimonials', formData);
            }
            showSnackbar(t('testimonialSubmitted'), 'success');
            setOpen(false);
            navigate('/');
        } catch (error) {
            console.error('Failed to save testimonial:', error);
            showSnackbar(t('submissionError'), 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadImage = async (file) => {
        if (defaultFormData.name === '') {
            showSnackbar(isArabic ? '' : '', 'error');
            return;
        }
        if (defaultFormData.imgUrl) {
            try {
                await deleteFile(defaultFormData.imgUrl);
            } catch (error) {
                console.error('Failed to delete previous image:', error);
            }
        }
        try {
            if (!file) return;
            const fileName = `${Date.now()}_${defaultFormData.name}`;
            const data = await uploadFile(file, 'testimonials', fileName);
            setFormData((prev) => ({ ...prev, imgUrl: data.fullUrl }));
            showSnackbar(t('imageUploaded'), 'success');
        } catch (error) {
            console.error('Failed to upload image:', error);
            showSnackbar(t('uploadError'), 'error');
        }
    };

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 400 },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                    direction: isArabic ? 'rtl' : 'ltr',
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{isArabic ? 'أضف توصية' : 'Add Testimonial'}</Typography>
                    <IconButton onClick={() => setOpen(false)}>
                        <Close />
                    </IconButton>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Avatar Upload */}
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar
                        src={formData.imgUrl}
                        alt={formData.name?.[0] || 'U'}
                        sx={{ width: 100, height: 100, cursor: 'pointer', mb: 1 }}
                        onClick={() => document.getElementById('file').click()}
                    />
                    <input hidden id="file" type="file" accept="image/*" onChange={(e) => handleUploadImage(e.target.files[0])} />
                </Box>

                {/* Form Fields */}
                <TextField
                    label={isArabic ? 'الاسم' : 'Name'}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                {user && (
                    <TextField
                        label={isArabic ? 'المنصب' : 'Position'}
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                )}

                <TextField
                    label={isArabic ? 'التعليق' : 'Comment'}
                    name="quote"
                    value={formData.quote}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder={isArabic ? 'أدخل تعليقك هنا' : 'Enter your comment here'}
                    margin="normal"
                />

                {/* Rating Section */}
                <Box display="flex" alignItems="center" justifyContent="center" sx={{ my: 2 }}>
                    <Typography sx={{ mr: 2 }}>
                        {isArabic ? 'التقييم العام للخدمات' : 'Global Rating for Services'}:
                    </Typography>
                    <Rating
                        name="rating"
                        size="large"
                        value={formData.rating}
                        onChange={(event, newValue) => setFormData((prev) => ({ ...prev, rating: newValue }))}
                    />
                </Box>

                {/* Submit Button */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={<Send sx={{ mx: 2 }} />}
                    sx={{ mt: 2 }}
                >
                    {loading ? t('submitting') : isArabic ? 'أرسل' : 'Submit'}
                </Button>
            </Box>
        </Modal>
    );
};

export default TestimonialForm;
