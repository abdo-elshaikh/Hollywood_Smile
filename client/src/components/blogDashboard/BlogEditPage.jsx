import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import {
    Box, Container, TextField, Button, Typography, Checkbox, FormControlLabel,
    FormControl, FormLabel, Grid, Divider, Paper, Stack, Switch,
    Tooltip, IconButton
} from '@mui/material';
import { Delete, AddPhotoAlternate, Upload } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import { useAuth } from '../../contexts/AuthContext';
import FileExplorerDialog from '../common/FileExplorerDialog';
import { uploadImage } from '../../services/uploadImage';

const BlogEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const showSnackbar = useSnackbar();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        author: user?._id,
        categories: [],
        tags: [],
        published: false,
        date: new Date(),
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch existing blog data by ID
        const fetchBlogData = async () => {
            try {
                const response = await axiosInstance.get(`/blogs/${id}`);
                if (response.status === 200) {
                    setFormData(response.data);
                }
            } catch (error) {
                console.error('Error fetching blog data:', error);
                showSnackbar('Error fetching blog data', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogData();
    }, [id]);

    const selectImage = (file) => {
        setFormData({
            ...formData,
            imageUrl: file.path,
        });
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked, value } = e.target;
        const updatedArray = checked ? [...formData[name], value] : formData[name].filter((item) => item !== value);
        setFormData({
            ...formData,
            [name]: updatedArray,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put(`/blogs/${id}`, formData);
            if (response.status === 200) {
                showSnackbar('Blog updated successfully', 'success');
                navigate('/blog-dashboard/blogs'); // Redirect to blogs page or any preferred route
            }
        } catch (error) {
            console.error('Error updating blog:', error);
            showSnackbar('Error updating blog', 'error');
        }
    };

    const handleUpload = async (file) => {
        try {
            const data = await uploadImage(file, 'images/blogs/', 'uploads');
            setFormData({ ...formData, imageUrl: data.fullUrl });
            showSnackbar('Image uploaded successfully', 'success');
        } catch (error) {
            console.error('Error uploading file:', error);
            showSnackbar('Error uploading file', 'error');
        }
    };

    const categories = ['General Dentistry', 'Cosmetic Dentistry', 'Orthodontics', 'Endodontics', 'Pediatric Dentistry', 'Oral Surgery', 'Periodontics', 'others'];
    const tags = ['Dental Implants', 'Teeth Whitening', 'Invisalign', 'Root Canal', 'Dental Crowns', 'Dental Bridges', 'Dentures', 'others'];

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Box maxWidth="md">
            <Box display="flex" flexDirection="column" alignItems="center" p={4}>
                <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Edit Blog
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={3}>

                    <Box textAlign="center">
                        <img
                            src={formData.imageUrl || 'https://via.placeholder.com/400x200'}
                            alt="Blog"
                            style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #ddd'
                            }}
                        />
                        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                            <Button variant="outlined" color="primary" onClick={() => setOpen(true)} startIcon={<AddPhotoAlternate />}>
                                Select Image
                            </Button>
                            <Button component="label" variant="outlined" color="secondary" startIcon={<Upload />}>
                                Upload Image
                                <input type="file" accept="image/*" hidden onChange={(e) => handleUpload(e.target.files[0])} />
                            </Button>
                            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => setFormData({ ...formData, imageUrl: '' })}>
                                Remove Image
                            </Button>
                        </Stack>
                    </Box>

                    <TextField
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        multiline
                        rows={6}
                        fullWidth
                    />

                    <Divider sx={{ my: 2 }} />

                    <FormControl component="fieldset">
                        <FormLabel component="legend">Categories</FormLabel>
                        <Grid container spacing={1}>
                            {categories.map((category) => (
                                <Grid item key={category} xs={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="categories"
                                                value={category}
                                                checked={formData.categories.includes(category)}
                                                onChange={handleCheckboxChange}
                                            />
                                        }
                                        label={category}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </FormControl>

                    <Divider sx={{ my: 2 }} />

                    <FormControl component="fieldset">
                        <FormLabel component="legend">Tags</FormLabel>
                        <Grid container spacing={1}>
                            {tags.map((tag) => (
                                <Grid item key={tag} xs={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="tags"
                                                value={tag}
                                                checked={formData.tags.includes(tag)}
                                                onChange={handleCheckboxChange}
                                            />
                                        }
                                        label={tag}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.published}
                                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                            />
                        }
                        label="Published"
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                        Update Blog
                    </Button>
                </Stack>
            </Box>
            <FileExplorerDialog open={open} onClose={() => setOpen(false)} onSelectFile={selectImage} />
        </Box>
    );
};

export default BlogEditPage;
