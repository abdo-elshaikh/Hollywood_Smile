import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Snackbar,
    Alert,
} from '@mui/material';
import Rating from '@mui/material/Rating';
import axiosInstance from '../../services/axiosInstance'; // Ensure this path is correct
import { useSnackbar } from '../../contexts/SnackbarProvider';

const ClientTestimonial = () => {
    const showSnackBar = useSnackbar();
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        quote: '',
        imgUrl: '',
        rating: 0, // Initialize rating to 0
    });
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleRatingChange = (event, newValue) => {
        setFormData((prevData) => ({
            ...prevData,
            rating: newValue, // Update rating value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitTestimonial(formData);
            setSnackbarMessage('Testimonial submitted successfully!');
            showSnackBar('Testimonial submitted successfully!', 'success');
            // Clear the form fields
            setFormData({
                name: '',
                position: '',
                quote: '',
                imgUrl: '',
                rating: 0, // Reset rating to 0
            });
        } catch (error) {
            setSnackbarMessage('Failed to submit testimonial. Please try again.');
            showSnackBar('Failed to submit testimonial. Please try again.', 'error');
        } finally {
            setLoading(false);
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box padding={3} borderRadius={2}>
            <Typography variant="h5" gutterBottom>
                Share Your Experience
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    name="name"
                    label="Name"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    name="position"
                    label="Position"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={formData.position}
                    onChange={handleChange}
                    required
                />
                <TextField
                    name="quote"
                    label="Quote"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={formData.quote}
                    onChange={handleChange}
                    required
                />
                <TextField
                    name="imgUrl"
                    label="Image URL"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={formData.imgUrl}
                    onChange={handleChange}
                />

                <Typography variant="subtitle1" gutterBottom>
                    Rating
                </Typography>
                <Rating
                    name="rating"
                    value={formData.rating}
                    onChange={handleRatingChange}
                    precision={0.5} // Allows half-star ratings
                    size="large" // Adjust the size of the stars
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit Testimonial'}
                </Button>
            </form>


            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarMessage.includes('failed') ? 'error' : 'success'}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

// Function to submit the testimonial to your API
const submitTestimonial = async (data) => {
    const response = await axiosInstance.post('/testimonials', data);
    return response.data; // Ensure your API returns the necessary data
};

export default ClientTestimonial;
