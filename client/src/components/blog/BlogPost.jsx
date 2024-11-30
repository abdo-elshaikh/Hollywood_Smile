import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  IconButton,
  Tooltip,
  Grid,
  Divider,
} from '@mui/material';
import { ArrowBack, ThumbUp, Comment, ThumbDown, Visibility, Share } from '@mui/icons-material';
import blogService from '../../services/blogService';
import LoadingSpinner from '../common/LoadingSpinner';
import CommentsSection from './CommentsSection';
import BlogShareDialog from '../common/BlogShareDialog';
import { useTranslation } from 'react-i18next';


const BlogPost = ({ id }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [blog, setBlog] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [disLikeCount, setDisLikeCount] = useState(0);
  const [isDisLiked, setIsDisLiked] = useState(false);

  useEffect(() => {
    fetchBlogData();
    incrementBlogView();
  }, [id]);

  const fetchBlogData = async () => {
    try {
      const data = await blogService.getBlog(id);
      console.log(data, 'getBlog');
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

  const handleBack = () => {
    navigate(-1);
  };

  const handleLike = async () => {
    try {
      await blogService.likeBlog(id);
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleDislike = async () => {
    try {
      await blogService.dislikeBlog(id);
      setDisLikeCount((prev) => prev + 1);
      setIsDisLiked(true);
    } catch (error) {
      console.error('Error disliking blog:', error);
    }
  };

  const handleToComments = () => {
    const comments = document.getElementById('comment-input');
    comments.scrollIntoView({ behavior: 'smooth', block: 'center' });
    comments.focus();
  };


  if (!blog) return <LoadingSpinner />;

  return (
    <Box sx={{ mx: 'auto', px: 1 }}>
      {/* Back Button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBack sx={{ mr: 1, ml: 1 }} />}
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Grid container spacing={3}>
        {/* Main Blog Content */}
        <Grid item xs={12} >
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              {blog.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src={blog.author?.avatarUrl} alt={blog.author?.name} />
              <Box sx={{ ml: 1, mr: 1 }}>
                <Typography variant="subtitle1">{blog.author?.name || 'Hidden'}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {new Date(blog.date).toLocaleString()}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <img
              src={blog.imageUrl}
              alt={blog.title}
              style={{
                width: '100%',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            />
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {blog.content}
            </Typography>
          </Paper>
        </Grid>

        {/* Blog Actions and Details */}
        <Grid item xs={12} >
          <Paper elevation={3} sx={{ p: 3 }}>
            {/* Like and Dislike */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <IconButton color={isLiked ? 'primary' : 'default'} onClick={handleLike}>
                <ThumbUp />
              </IconButton>
              <Typography>{likeCount}</Typography>
              <IconButton color={isDisLiked ? 'error' : 'default'} onClick={handleDislike}>
                <ThumbDown />
              </IconButton>
              <Typography>{disLikeCount}</Typography>
              <BlogShareDialog blog={blog} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 3 }}>

              <Typography>{blog.views} Views</Typography>
            </Box>

            {/* Comments Button */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleToComments}
              startIcon={<Comment sx={{ mr: 2, ml: 2 }} />}
            >
              Comments ({blog.comments.length})
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Comments Section */}
      <Box id="comments" sx={{ mt: 4 }}>
        <CommentsSection id={id} />
      </Box>
    </Box>
  );
};

export default BlogPost;
