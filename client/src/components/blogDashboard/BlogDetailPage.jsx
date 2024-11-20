import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Divider, Chip, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import EditIcon from '@mui/icons-material/Edit';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import commentService from '../../services/commentService';
import { useSnackbar } from '../../contexts/SnackbarProvider';

const BlogDetailPage = () => {
    const { id } = useParams(); // Get the blog ID from the URL parameters
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

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!blog) {
        return <Typography>Blog not found.</Typography>;
    }



    const handleDeleteComment = async (commentId) => {
        try {
            await commentService.deleteComment(commentId);
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
            showSnackbar('Error deleting comment', 'error');
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

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Button
                variant="text"
                startIcon={<ArrowBackIosNewIcon />}
                onClick={() => navigate('/blog-dashboard/blogs')}
                sx={{ mb: 2 }}
            >
                Back to Blogs
            </Button>
            <Button
                variant="text"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/blog-dashboard/edit-blog/${id}`)}
                sx={{ mb: 2, ml: 2 }}
            >
                Edit Blog
            </Button>
            <Typography variant="h4" gutterBottom>
                {blog.title}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
                By {blog.author?.name} | {new Date(blog.date).toLocaleDateString()}
            </Typography>
            <img
                src={blog.imageUrl || 'https://via.placeholder.com/400x200'}
                alt={blog.title}
                style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    marginBottom: '16px',
                }}
            />
            <Typography variant="body1" paragraph>
                {blog.content}
            </Typography>

            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2, display:'flex', gap: 2 }}>
                <Typography variant="h6">{blog.likes} Likes</Typography>
                <Typography variant="h6">{blog.dislikes} Dislikes</Typography>
                <Typography variant="h6">{blog.views} Views</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Categories</Typography>
            <Box sx={{ mb: 2 }}>
                {blog.categories.map((category) => (
                    <Chip key={category} label={category} sx={{ mr: 1, mb: 1 }} />
                ))}
            </Box>

            <Typography variant="h6">Tags</Typography>
            <Box sx={{ mb: 2 }}>
                {blog.tags.map((tag) => (
                    <Chip key={tag} label={tag} sx={{ mr: 1, mb: 1 }} />
                ))}
            </Box>

            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Comments</Typography>
            {blogComments.map((comment) => (
                <Box key={comment._id} sx={{ mb: 2 }}>
                    <Typography variant="body1">{comment.text}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        By {comment.user?.name || 'unknown'} | {new Date(comment.date).toLocaleDateString()}
                    </Typography>
                    <Box>
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => approveComment(comment._id)}
                            disabled={comment.approved}
                        >
                            {comment.approved ? 'Approved' : 'Approve'}
                        </Button>
                        <Button
                            variant="text"
                            color="error"
                            onClick={() => handleDeleteComment(comment._id)}
                        >
                            Delete
                        </Button>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                        {comment.likes} Likes | {comment.dislikes} Dislikes
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                        Replies: {comment.replies.length} Replies |{' '}
                    </Typography>
                    {comment.replies.map((reply, index) => (
                        <Box key={reply._id} sx={{ ml: 2, mt: 2, bgcolor: 'background.paper' }}>
                            <Typography variant="body2">{index + 1}: {reply.content}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                By {reply.user?.name || 'unknown'} | {new Date(reply.date).toLocaleDateString()}
                            </Typography>
                            <Box>
                                <Button
                                    variant="text"
                                    color="error"
                                    onClick={() => commentService.deleteReply(comment._id, reply._id)}
                                >
                                    Delete
                                </Button>
                                <Typography variant="body2" color="text.primary">
                                    {reply.likes} Likes | {reply.dislikes} Dislikes
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            ))}
            {blogComments.length === 0 && <Typography variant="body1" color="textSecondary" marginTop={2}>No comments available.</Typography>}
        </Container>
    );
};

export default BlogDetailPage;
