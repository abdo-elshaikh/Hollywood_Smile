import { useState, useEffect } from 'react';
import { Box, Button, TextField, Avatar, Typography, } from '@mui/material';
import { Rating } from '@mui/material';
import axiosInstance from '../../services/axiosInstance';
import { uploadFile } from '../../services/supabaseService';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const TestimonialForm = ({ testimonial = null }) => {
    const { user } = useAuth();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const qoute = {
        name: user ? user.name : '',
        position: user ? user.role : '',
        quote: '',
        rating: 0,
        show: false, // Default to false
        imgUrl: user ? user.avatarUrl : '',
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
        try {
            if (testimonial) {
                await axiosInstance.put(`/testimonials/${testimonial._id}`, formData);
            } else {
                await axiosInstance.post('/testimonials', formData);
            }
        } catch (error) {
            console.error('Failed to save testimonial:', error);
        }
    };

    const handleUploadImage = async (file) => {
        try {
            const fileName = `${Date.now()}_${file.name}`;
            const data = await uploadFile(file, 'testimonials', fileName);
            setFormData({ ...formData, imgUrl: data.fullUrl });
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
                value={formData.position}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label={isArabic ? 'الاقتباس' : 'Quote'}
                name="quote"
                value={formData.quote}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                placeholder="Enter your quote here"
                margin="normal"
            />
            <Box sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                direction: isArabic ? 'rtl' : 'ltr',
            }}>
                <Typography sx={{ mr: 2 }}>{isArabic ? 'التقييم' : 'Rating'}</Typography>
                <Rating
                    name="rating"
                    size="large"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                />
            </Box>

            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mt: 2, width: '100%' }}
            >
                Save
            </Button>
        </Box>
    );
};

export default TestimonialForm;