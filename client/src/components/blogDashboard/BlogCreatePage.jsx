import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import {
    Box, TextField, Button, Typography, Checkbox, FormControlLabel,
    FormControl, FormLabel, Grid, Divider, Stack, Switch, Tooltip, IconButton
} from '@mui/material';
import { Delete, Upload } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import blogService from "../../services/blogService";
import { uploadFile, deleteFile } from '../../services/supabaseService';

const BlogCreatePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const showSnackbar = useSnackbar();

    const [formData, setFormData] = useState({
        code: 'B-0000',
        title: '',
        content: '',
        imageUrl: '',
        author: user?._id,
        categories: [],
        tags: [],
        published: false,
        date: new Date(),
    });

    const categories = ['General Dentistry', 'Cosmetic Dentistry', 'Orthodontics', 'Endodontics', 'Pediatric Dentistry', 'Oral Surgery', 'Periodontics', 'others'];
    const tags = ['Dental Implants', 'Teeth Whitening', 'Invisalign', 'Root Canal', 'Dental Crowns', 'Dental Bridges', 'Dentures', 'others'];

    useEffect(() => {
        const fetchBlogs = async () => {
            const data = await blogService.getBlogs();
            if (data.length) {
                setFormData({ ...formData, code: generateCode(data[data.length - 1]) });
            }
        };
        fetchBlogs();
    }, []);

    const generateCode = (blog) => {
        const lastCodePart = blog.code.split('-')[1];
        return `B-${(parseInt(lastCodePart, 10) + 1).toString().padStart(4, '0')}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked
                ? [...prev[name], value]
                : prev[name].filter((item) => item !== value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            showSnackbar('Title and content are required', 'warning');
            return;
        }
        try {
            const response = await axiosInstance.post('/blogs', formData);
            if (response.status === 201) {
                showSnackbar('Blog created successfully', 'success');
                setFormData({
                    code: 'B-0000',
                    title: '',
                    content: '',
                    imageUrl: '',
                    author: user?._id,
                    categories: [],
                    tags: [],
                    published: false,
                    date: new Date(),
                });
                navigate('/blog-dashboard/blogs');
            }
        } catch (error) {
            console.error('Error creating blog:', error);
            showSnackbar('Error creating blog', 'error');
            if (formData.imageUrl) {
                await deleteFile(formData.imageUrl);
            }
        }
    };

    const handleUpload = async (file) => {
        try {
            const data = await uploadFile(file, 'images/blogs/', formData.code);
            setFormData({ ...formData, imageUrl: data.fullUrl });
            showSnackbar('Image uploaded successfully', 'success');
        } catch (error) {
            console.error('Error uploading file:', error);
            showSnackbar('Error uploading file', 'error');
        }
    };

    return (
        <Box maxWidth="md" mx="auto" p={3} component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" align="center" gutterBottom>
                Create a New Blog
            </Typography>
            <Typography align="center" color="textSecondary">
                Author: {user?.name} | Date: {formData.date.toLocaleString()}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={3}>
                <Box textAlign="center">
                    <Typography variant="h6">Blog Code: <strong>{formData.code}</strong></Typography>
                    <img
                        src={formData.imageUrl || 'https://via.placeholder.com/300'}
                        alt="Blog"
                        style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    />
                    <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<Upload />}
                        >
                            Upload Image
                            <input type="file" accept="image/*" hidden onChange={(e) => handleUpload(e.target.files[0])} />
                        </Button>
                        {formData.imageUrl && (
                            <Tooltip title="Remove Image">
                                <IconButton onClick={() => setFormData({ ...formData, imageUrl: '' })}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                </Box>

                <TextField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    multiline
                    rows={6}
                    fullWidth
                    required
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

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit
                </Button>
            </Stack>
        </Box>
    );
};

export default BlogCreatePage;
