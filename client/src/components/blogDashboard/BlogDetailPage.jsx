import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Divider,
    Chip,
    Button,
    Stack,
    Avatar,
    IconButton,
    CircularProgress
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Edit as EditIcon,
    ThumbUp as LikeIcon,
    ThumbDown as DislikeIcon,
    Visibility as ViewsIcon,
    Comment as CommentIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import commentService from '../../services/commentService';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import { format } from 'date-fns';

const BlogDetailPage = () => {
    const { id } = useParams();
    const showSnackbar = useSnackbar();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [blogComments, setBlogComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
            const data = await commentService.getCommentsByBlog(id);
            setBlogComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
            showSnackbar('Error fetching comments', 'error');
        }
    };

    const fetchBlog = async () => {
        try {
            const response = await axiosInstance.get(`/blogs/${id}`);
            setBlog(response.data);
        } catch (error) {
            console.error('Error fetching blog:', error);
            showSnackbar('Error fetching blog details', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlog();
        fetchComments();
    }, []);

    
    const handleDeleteComment = async (commentId) => {
        try {
            await commentService.deleteComment(commentId);
            fetchComments();
            showSnackbar('Comment deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting comment:', error);
            showSnackbar('Error deleting comment', 'error');
        }
    };

    const handleDeleteReply = async (commentId, replyId) => {
        try {
            await commentService.deleteReply(commentId, replyId);
            fetchComments();
            showSnackbar('Reply deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting reply:', error);
            showSnackbar('Error deleting reply', 'error');
        }
    };

    const approveComment = async (commentId) => {
        if (blogComments.find((comment) => comment._id === commentId && !comment.approved)) {
            return showSnackbar('Comment already approved', 'info');
        }

        try {
            await commentService.approveComment(commentId);
            fetchComments();
        } catch (error) {
            console.error('Error approving comment:', error);
            showSnackbar('Error approving comment', 'error');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!blog) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="error">Blog not found</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
                <Button
                    variant="outlined"
                    startIcon={<BackIcon />}
                    onClick={() => navigate('/blog-dashboard/blogs')}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/blog-dashboard/edit-blog/${id}`)}
                >
                    Edit
                </Button>
            </Stack>

            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                {blog.title}
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <Avatar src={blog.author?.avatar} sx={{ width: 56, height: 56 }} />
                <div>
                    <Typography variant="subtitle1" fontWeight="500">
                        {blog.author?.name || 'Unknown Author'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {format(new Date(blog.date), 'MMM dd, yyyy - HH:mm')}
                    </Typography>
                </div>
            </Stack>

            <Box
                component="img"
                src={blog.imageUrl}
                alt={blog.title}
                sx={{
                    width: '100%',
                    maxHeight: 400,
                    borderRadius: 2,
                    objectFit: 'cover',
                    mb: 4,
                    boxShadow: 3
                }}
            />

            <Typography
                variant="body1"
                paragraph
                sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap'
                }}
            >
                {blog.content}
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <LikeIcon color="action" />
                    <Typography variant="body1">{blog.likes}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <DislikeIcon color="action" />
                    <Typography variant="body1">{blog.dislikes}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <ViewsIcon color="action" />
                    <Typography variant="body1">{blog.views}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <CommentIcon color="action" />
                    <Typography variant="body1">{blogComments.length}</Typography>
                </Stack>
            </Stack>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Categories</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {blog.categories.map((category) => (
                        <Chip
                            key={category}
                            label={category}
                            color="primary"
                            variant="outlined"
                        />
                    ))}
                </Stack>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Tags</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {blog.tags.map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            variant="outlined"
                            color="secondary"
                        />
                    ))}
                </Stack>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" gutterBottom>Comments</Typography>

            {blogComments.length === 0 ? (
                <Typography variant="body1" color="text.secondary" fontStyle="italic">
                    No comments yet
                </Typography>
            ) : (
                <Stack spacing={3}>
                    {blogComments.map((comment) => (
                        <Box
                            key={comment._id}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: 1
                            }}
                        >
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <Avatar src={comment.user?.avatar} />
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="500">
                                        {comment.user?.name || 'Anonymous'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {format(new Date(comment.date), 'MMM dd, yyyy - HH:mm')}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        {comment.text}
                                    </Typography>

                                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                        <Button
                                            size="small"
                                            color={comment.approved ? 'success' : 'primary'}
                                            onClick={() => approveComment(comment._id)}
                                            disabled={comment.approved}
                                        >
                                            {comment.approved ? 'Approved' : 'Approve'}
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteComment(comment._id)}
                                        >
                                            Delete
                                        </Button>
                                    </Stack>

                                    {comment.replies.length > 0 && (
                                        <Box sx={{ mt: 3, ml: 4, borderLeft: 2, borderColor: 'divider', pl: 2 }}>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Replies ({comment.replies.length})
                                            </Typography>
                                            <Stack spacing={2}>
                                                {comment.replies.map((reply) => (
                                                    <Box key={reply._id} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                                            <Avatar sx={{ width: 24, height: 24 }} src={reply.user?.avatar} />
                                                            <Box sx={{ flexGrow: 1 }}>
                                                                <Typography variant="body2" fontWeight="500">
                                                                    {reply.user?.name || 'Anonymous'}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {format(new Date(reply.date), 'MMM dd, yyyy - HH:mm')}
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                                    {reply.content}
                                                                </Typography>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleDeleteReply(comment._id, reply._id)}
                                                                    sx={{ mt: 0.5 }}
                                                                >
                                                                    Delete
                                                                </IconButton>
                                                            </Box>
                                                        </Stack>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}
                                </Box>
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            )}
        </Container>
    );
};

export default BlogDetailPage;