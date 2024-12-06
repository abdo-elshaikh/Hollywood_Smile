import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    IconButton,
    Tooltip,
    Button,
    Pagination,
    CardActions,
    CardMedia,
    Badge,
    TextField,
    Divider,
    Dialog,
} from '@mui/material';
import { AddCircleOutline, Edit, Delete } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const ManageBlogs = () => {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(1);
    const showSnackbar = useSnackbar();
    const navigate = useNavigate();
    const blogsPerPage = 6;

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await axiosInstance.get('/blogs');
            if (response.status === 200) {
                const sortedBlogs = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                const userBlogs = user.role === 'admin' ? sortedBlogs : sortedBlogs.filter((blog) => blog.author?._id === user?._id);
                // console.log('User Blogs:', userBlogs);
                setBlogs(userBlogs);
            } else {
                showSnackbar('Error fetching blogs', 'error');
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleEditBlog = (id) => {
        navigate(`/blog-dashboard/edit-blog/${id}`);
    };

    const handleViewBlog = (id) => {
        navigate(`/blog-dashboard/view-blog/${id}`);
    };

    const handleDeleteBlog = (id) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            axiosInstance.delete(`/blogs/${id}`)
                .then((response) => {
                    if (response.status === 204) {
                        showSnackbar('Blog post deleted successfully', 'success');
                        fetchBlogs();
                    } else {
                        showSnackbar('Error deleting blog post', 'error');
                    }
                })
                .catch((error) => {
                    console.error("Error deleting blog post:", error);
                    showSnackbar('Error deleting blog post', 'error');
                });
        }
    };

    const sortBlogs = (sortBy) => {
        const sortedBlogs = [...blogs].sort((a, b) => {
            return sortBy === 'newest' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date);
        });
        setBlogs(sortedBlogs);
    };

    const paginatedBlogs = blogs.slice((page - 1) * blogsPerPage, page * blogsPerPage);



    return (
        <Box sx={{ px: { xs: 2, sm: 4 }, py: 3 }}>
            {/* Filter and Sort */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Typography variant="body1">
                    Showing {paginatedBlogs.length} of {blogs.length} blog posts
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: { xs: 2, md: 0 } }}>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        Sort by:
                    </Typography>
                    <TextField
                        select
                        size="small"
                        variant="outlined"
                        defaultValue="newest"
                        SelectProps={{ native: true }}
                        sx={{ width: 120 }}
                        onChange={(e) => sortBlogs(e.target.value)}
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </TextField>
                </Box>
            </Box>

            {/* Blogs Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Recent Blog Posts</Typography>
                <Button variant="contained" color="primary" startIcon={<AddCircleOutline />} onClick={() => navigate('/blog-dashboard/add-blog')}>
                    Add New Blog
                </Button>
            </Box>

            <Grid container spacing={3} component={motion.div} layout>
                {paginatedBlogs.map((blog) => (
                    <Grid item xs={12} sm={6} md={4} key={blog._id} component={motion.div} layout>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 2, position: 'relative' }}>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                badgeContent={blog.published ? 'Published' : 'Draft'}
                                color={blog.published ? 'success' : 'error'}
                                sx={{ position: 'absolute', top: 20, right: 35 }}
                            />
                            <CardMedia component="img" height="180" image={blog.imageUrl} alt={blog.title} sx={{ borderRadius: 1 }} />
                            <CardContent>
                                <Typography variant="h6">{blog.title}</Typography>
                                <Typography variant="body2" color="textSecondary">{new Date(blog.date).toLocaleDateString()}</Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>{blog.content.substring(0, 100)}...</Typography>
                            </CardContent>
                            <CardActions sx={{ mt: 'auto', justifyContent: 'space-between' }}>
                                <Button size="small" color="primary" onClick={() => handleViewBlog(blog._id)}>View Details</Button>
                                <Box>
                                    <Tooltip title="Edit">
                                        <IconButton color="primary" onClick={() => handleEditBlog(blog._id)}><Edit /></IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton color="error" onClick={() => handleDeleteBlog(blog._id)}><Delete /></IconButton>
                                    </Tooltip>
                                </Box>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination count={Math.ceil(blogs.length / blogsPerPage)} page={page} onChange={handlePageChange} color="primary" size="large" />
            </Box>
        </Box>
    );
};

export default ManageBlogs;
