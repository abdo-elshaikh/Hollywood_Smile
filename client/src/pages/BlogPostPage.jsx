import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    IconButton,
    Avatar,
    Tooltip,
    Divider,
} from '@mui/material';
import { ThumbUp, ThumbDown, Visibility, Comment } from '@mui/icons-material';
import HeaderSection from '../components/home/HeaderSection';
import Footer from '../components/home/Footer';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import { useTranslation } from 'react-i18next';
import { useCustomTheme } from '../contexts/ThemeProvider';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CommentsSection from '../components/blog/CommentsSection';
import BlogShareDialog from '../components/common/BlogShareDialog';
import blogService from '../services/blogService';
import NotificationService from '../services/notificationService';

const BlogPostPage = () => {
    const { t, i18n } = useTranslation();
    const { mode } = useCustomTheme();
    const navigate = useNavigate();
    const { id } = useParams();

    const { user } = useAuth();
    const [blog, setBlog] = useState(null);
    const [latestBlogs, setLatestBlogs] = useState([]);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [disLikeCount, setDisLikeCount] = useState(0);
    const [isDisLiked, setIsDisLiked] = useState(false);
    const isArabic = i18n.language === 'ar';


    useEffect(() => {
        fetchBlogData();
        incrementBlogView();
        fetechLatestBlogs();
    }, [id]);

    const fetchBlogData = async () => {
        try {
            const data = await blogService.getBlog(id);
            setBlog(data);
            setLikeCount(data.likes || 0);
            setDisLikeCount(data.dislikes || 0);
        } catch (error) {
            console.error('Error fetching blog data:', error);
        }
    };

    const incrementBlogView = async () => {
        try {
            await blogService.addView(id);
        } catch (error) {
            console.error('Error incrementing blog view:', error);
        }
    };

    const fetechLatestBlogs = async () => {
        try {
            const data = await blogService.getBlogs();
            const latest = data.filter((item) => item.id !== id).slice(0, 5);
            setLatestBlogs(latest);
        } catch (error) {
            console.error('Error fetching latest blogs:', error);
        }
    };

    const handleLike = async () => {
        try {
            await blogService.likeBlog(id);
            await handleAddNotification('liked', 'success');
            setLikeCount((prev) => prev + 1);
            setIsLiked(true);
        } catch (error) {
            await handleAddNotification('liked', 'error');
            console.error('Error liking blog:', error);
        }
    };

    const handleDislike = async () => {
        try {
            await blogService.dislikeBlog(id);
            await handleAddNotification('disliked', 'error');
            setDisLikeCount((prev) => prev + 1);
            setIsDisLiked(true);
        } catch (error) {
            await handleAddNotification('disliked', 'error');
            console.error('Error disliking blog:', error);
        }
    };

    const handleToComments = () => {
        document.getElementById('comment-input').scrollIntoView({ behavior: 'smooth', block: 'center', position: 'start' });
        document.getElementById('comment-input').focus();
    };

    const handleAddNotification = async (action, type) => {
        const notification = {
            title: `Add Notification for ${action}`,
            message: `You ${action} the blog post ${blog.title}.`,
            type,
            ref: 'blog',
            refId: id,
        };
        try {
            await NotificationService.createNotification(notification);
        } catch (error) {
            console.error('Error adding notification:', error);
        }
    };


    if (!blog) return <LoadingSpinner />;

    return (
        <>
            <HeaderSection />
            {/* Blog Post Header */}
            <Box
                sx={{
                    backgroundColor: mode === 'dark' ? '#333' : '#f4f4f4',
                    color: mode === 'dark' ? '#fff' : '#333',
                    textAlign: 'center',
                    py: 16,

                }}
            >
                <Container>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {isArabic ? 'المدونة' : 'Blog Post'}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        {blog.title}
                    </Typography>
                </Container>
            </Box>

            <Grid container spacing={4}>
                {/* Blog Post Section */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 2, py: 4 }}>
                        {/* Blog Content */}
                        <Paper elevation={1} sx={{ p: 3 }}>
                            {/* Author Info */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar src={blog.author?.avatarUrl} alt={blog.author?.name} sx={{ width: 50, height: 50 }} />
                                <Box sx={{ mx: 2 }}>
                                    <Typography variant="subtitle1">{blog.author?.name || 'Anonymous'}</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {new Date(blog.date).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Blog Image */}
                            {blog.imageUrl && (
                                <img
                                    src={blog.imageUrl}
                                    alt={blog.title}
                                    style={{
                                        width: '100%',
                                        borderRadius: 8,
                                        marginBottom: 8,
                                    }}
                                />
                            )}

                            {/* Blog Title */}
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                                {blog.title}
                            </Typography>

                            {/* Blog Stats */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 2,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Tooltip title={isArabic ? 'المشاهدات' : 'Views'}>
                                        <IconButton>
                                            <Visibility />
                                        </IconButton>
                                    </Tooltip>
                                    <Typography>{blog.views}</Typography>
                                    <Tooltip title={isArabic ? 'التعليقات' : 'Comments'}>
                                        <IconButton onClick={handleToComments}>
                                            <Comment />
                                        </IconButton>
                                    </Tooltip>
                                    <Typography>{blog.comments.length}</Typography>
                                    <BlogShareDialog blog={blog} />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <IconButton
                                        color={isDisLiked ? 'error' : 'default'}
                                        onClick={handleDislike}
                                        disabled={!user}
                                    >
                                        <ThumbDown />
                                    </IconButton>
                                    <Typography>{disLikeCount}</Typography>
                                    <IconButton
                                        color={isLiked ? 'primary' : 'default'}
                                        onClick={handleLike}
                                        disabled={!user}
                                    >
                                        <ThumbUp />
                                    </IconButton>
                                    <Typography>{likeCount}</Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            {/* Blog Content */}
                            <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 3 }}>
                                {blog.content}
                            </Typography>
                        </Paper>

                        {/* Comments Section */}
                        <Box id="comments" sx={{ mt: 2 }}>
                            <CommentsSection id={id} addNotification={handleAddNotification} toComment={handleToComments} />
                        </Box>
                    </Box>
                </Grid>

                {/* Sidebar Section */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ mx: 'auto', px: 2, py: 6 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                            {isArabic ? 'أحدث المدونات' : 'Latest Blogs'}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {latestBlogs.map((item) => (
                            <Box key={item.id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate(`/blog/${item._id}`)}>
                                <Typography variant="subtitle1">{item.title}</Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {new Date(item.date).toLocaleString()}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>

            <Footer />
            <ScrollToTopButton />
        </>
    );
};

export default BlogPostPage;
