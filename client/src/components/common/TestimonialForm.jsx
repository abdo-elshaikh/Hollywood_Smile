import { useState, useEffect } from 'react';
import { Box, Button, TextField, Avatar, Typography, Divider } from '@mui/material';
import { Rating } from '@mui/material';
import axiosInstance from '../../services/axiosInstance';
import { uploadFile } from '../../services/supabaseService';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import { useNavigate } from 'react-router-dom';

const TestimonialForm = ({ testimonial = null }) => {
    const { user } = useAuth();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const showSnackbar = useSnackbar();
    const navigate = useNavigate();
    const qoute = {
        name: user ? user.name : '',
        position: user ? user.role : 'visitor',
        quote: '',
        rating: 0,
        show: false,
        imgUrl: user ? user.avatarUrl : '',
        user: user ? user._id : null,
    }
    const [formData, setFormData] = useState(qoute);

    useEffect(() => {
        if (testimonial) {
            setFormData(testimonial);
        } else {
            setFormData(qoute);
        }
    }, [testimonial]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!user) {
            showSnackbar(t('loginRequired'), 'error');
            return;
        };
        try {
            if (testimonial) {
                await axiosInstance.put(`/testimonials/${testimonial._id}`, formData);
            } else {
                await axiosInstance.post('/testimonials', formData);
            }
            showSnackbar(t('testimonialSubmitted'), 'success');
            navigate('/');
        } catch (error) {
            console.error('Failed to save testimonial:', error);
        } finally {
            setFormData(qoute);
        }
    };

    const handleUploadImage = async (file) => {
        try {
            const fileName = `${Date.now()}_${file.name}`;
            const data = await uploadFile(file, 'testimonials', fileName);
            setFormData({ ...formData, imgUrl: data.fullUrl });
            showSnackbar(t('imageUploaded'), 'success');
        } catch (error) {
            console.error('Failed to upload image:', error);
        }
    };

    return (
        <Box
            component="form"
            autoComplete="off"
        >
            <Box display="flex" alignItems="center" flexDirection='column'>
                <Avatar
                    src={formData.imgUrl}
                    alt={formData.name[0]}
                    sx={{ width: 100, height: 100, mr: 2 }}
                    style={{ cursor: 'pointer' }}
                    onClick={() => document.getElementById('file').click()}
                />
                <input hidden id='file' type="file" onChange={(e) => handleUploadImage(e.target.files[0])} />
            </Box>
            <TextField
                label={isArabic ? 'الاسم' : 'Name'}
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label={isArabic ? 'المنصب' : 'Position'}
                name="position"
                sx={{ display: user ? 'block' : 'none' }}
                value={formData.position}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label={isArabic ? 'التعليق' : 'Comment'}
                name="quote"
                value={formData.quote}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                placeholder={isArabic ? 'أدخل تعليقك هنا' : 'Enter your comment here'}
                margin="normal"
            />
            <Box sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                textAlign: isArabic ? 'right' : 'left',
                flexWrap: 'wrap',
                direction: isArabic ? 'rtl' : 'ltr',
            }}>
                <Typography sx={{ mr: 2 }}>{isArabic ? 'التقييم العام للخدمات' : 'Global Rating for Services'} : </Typography>
                <Rating
                    name="rating"
                    size="large"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                />
            </Box>
            <Divider sx={{ mt: 2 }} />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mt: 2, width: '100%' }}
            >
                {isArabic ? "أرسل" : "Submit"}
            </Button>
        </Box>
    );
};

export default TestimonialForm;