import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Avatar, IconButton, Tooltip } from '@mui/material';
import { ThumbUp, Comment, ThumbDown, Visibility } from '@mui/icons-material';
import blogService from '../../services/blogService';
import notificationService from '../../services/notificationService';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from '../../contexts/SnackbarProvider';
import BlogShareDialog from '../common/BlogShareDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import CommentsSection from './CommentsSection';
import { useTranslation } from 'react-i18next';

const BlogPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const [blog, setBlog] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [disLiked, setDisLiked] = useState(0);
  const [isDisLiked, setIsDisLiked] = useState(false);

  useEffect(() => {
    fetchData();
    addBlogView();
  }, [id]);

  const addBlogView = async () => {
    try {
      await blogService.addView(id);
    } catch (error) {
      console.error('Failed to add view:', error);
    }
  };

  const ShareBlog = async () => {
    try {
      await blogService.addShare(id);
    } catch (error) {
      console.error('Failed to share blog:', error);
    }
  };

  const createNotification = async (title, message, type, ref, refId) => {
    try {
      await notificationService.createNotification({ title, message, type, ref, refId });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

  const fetchData = async () => {
    try {
      const data = await blogService.getBlog(id);
      setBlog(data);
      setLikeCount(data.likes);
      setDisLiked(data.dislikes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      showSnackbar('Please login to like this blog', 'info');
      return;
    }
    try {
      await blogService.likeBlog(id);
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
      createNotification('Liked', `${user?.name} liked your blog post`, 'info', 'blogs', id);
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      showSnackbar('Please login to dislike this blog', 'info');
      return;
    }
    try {
      await blogService.dislikeBlog(id);
      setDisLiked((prev) => prev + 1);
      setIsDisLiked(true);
      createNotification('Disliked', `${user.name} disliked your blog post`, 'info', 'blogs', id);
    } catch (error) {
      console.error('Error disliking blog:', error);
    }
  };

  const toComment = () => {
    const comment = document.getElementById('comment-input');
    comment.scrollIntoView({ behavior: 'smooth', block: 'center' });
    comment.focus();
  };

  if (!blog) return <LoadingSpinner />;

  return (
    <Box sx={{ px: 6 }}>
      {/* Back Button */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Button variant="text" color="primary" onClick={() => navigate(-1)} sx={{ fontSize: '1rem' }}>
          &lt; {t('blog.back')}
        </Button>
      </Box>

      {/* Blog Header */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s',
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }} gutterBottom>
          {blog?.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
          <Avatar src={blog.author?.avatarUrl} alt="Author" sx={{ width: 56, height: 56 }} />
          <Typography variant="subtitle1">
            {t('blog.by')} {blog.author?.name || 'Unknown'}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            | {new Date(blog.date).toLocaleString()}
          </Typography>
        </Box>

        {/* Blog Content */}
        <Box sx={{ my: 4, ml: 2, fontSize: '1.1rem', lineHeight: 1.7 }}>
          <Typography variant="body1">{blog.content}</Typography>
        </Box>

        {/* Blog Image */}
        <Box sx={{ mb: 2, my: 2, borderRadius: 2, overflow: 'hidden' }}>
          <img
            src={blog.imageUrl}
            alt={blog?.title}
            style={{
              width: '100%',
              height: 'auto',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.05)' }
            }}
          />
        </Box>

        {/* Blog Actions */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton
              disabled={!user}
              onClick={handleLike}
              color={isLiked ? 'primary' : 'default'}
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              <ThumbUp />
            </IconButton>
            <Typography variant="h6" color='primary.main'>{likeCount}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton
              disabled={!user}
              onClick={handleDislike}
              color={isDisLiked ? 'error' : 'default'}
              sx={{ '&:hover': { color: 'error.main' } }}
            >
              <ThumbDown />
            </IconButton>
            <Typography variant="h6" color='primary.main'>{disLiked}</Typography>
          </Box>
          <BlogShareDialog blog={blog} />
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="text"
            color="primary"
            onClick={toComment}
            startIcon={<Comment sx={{ ml: 1, mr: 1 }} />}
          >
            {t('blog.comments')} ({blog.comments.length})
          </Button>
          <Button variant="text" color="primary" onClick={ShareBlog} startIcon={<Visibility sx={{ ml: 1, mr: 1 }} />} >
            {t('blog.views')} ({blog.views})
          </Button>
        </Box>
      </Paper>

      {/* Comments Section */}
      <CommentsSection id={id} createNotification={createNotification} toComment={toComment} />
    </Box>
  );
};

export default BlogPost;
