import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, IconButton, Grid, Container, Chip, CardMedia, Avatar,
  Pagination, CircularProgress, Button
} from '@mui/material';
import { ThumbUp, Comment, Share, ThumbDown, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MainContent = ({ blogEntries, page, rowsPerPage, setPage, categories }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [blogList, setBlogList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    document.body.dir = isArabic ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const onCategorySelect = (category) => {
    setSelectedCategory(category);
    setPage(1);
    setBlogList(category ? blogEntries.filter((blog) => blog.categories.includes(category)) : blogEntries);
  };

  useEffect(() => {
    setLoading(true);
    const displayBlogs = blogEntries.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    setBlogList(displayBlogs);
    setLoading(false);
  }, [blogEntries, page, rowsPerPage, selectedCategory]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <Container maxWidth="lg">
      {/* Categories Filter */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 4, border: '1px solid', p: 1, borderRadius: 2, boxShadow: 2 }}>
        <Chip
          label="All"
          onClick={() => onCategorySelect('')}
          sx={{
            margin: 0.5,
            cursor: 'pointer',
            backgroundColor: selectedCategory === '' ? 'primary.main' : 'default',
            color: selectedCategory === '' ? 'white' : 'inherit',
            '&:hover': { backgroundColor: 'primary.light' }
          }}
        />
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            onClick={() => onCategorySelect(category)}
            sx={{
              margin: 0.5,
              cursor: 'pointer',
              backgroundColor: selectedCategory === category ? 'primary.main' : 'default',
              color: selectedCategory === category ? 'white' : 'inherit',
              '&:hover': { backgroundColor: 'primary.light' }
            }}
          />
        ))}
      </Box>

      {/* Blog Entries Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {blogList.map((blog, index) => (
            <Grid item xs={12} sm={index % 3 === 0 ? 12 : 6} md={index % 3 === 0 ? 8 : 4} key={blog._id}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '4px',
                    '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
                    transition: 'transform 0.3s ease-in-out',
                  }}
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  <CardMedia
                    component="img"
                    height={index % 3 === 0 ? 280 : 160}
                    image={blog.imageUrl || 'https://via.placeholder.com/280x160?text=No+Image'}
                    alt={blog.title}
                    sx={{ objectFit: 'cover', borderRadius: '4px 4px 0 0' }}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar src={blog.author?.avatarUrl} alt={blog.author?.name} sx={{ width: 40, height: 40, mr: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        {blog.author?.name} | {new Date(blog.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {blog.content.length > 100 ? `${blog.content.slice(0, 100)}...` : blog.content}
                    </Typography>
                    {blog.content.length > 100 && (
                      <Button
                        size="small"
                        onClick={() => navigate(`/blog/${blog._id}`)}
                        sx={{ textTransform: 'none', color: 'primary.main' }}
                      >
                        {t('blog.readMore')}
                      </Button>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton size="small">
                          <ThumbUp />
                        </IconButton>
                        <Typography variant="body2" sx={{ mx: 1 }}>
                          {blog.likes}
                        </Typography>
                        <IconButton size="small">
                          <ThumbDown />
                        </IconButton>
                        <Typography variant="body2" sx={{ mx: 1 }}>
                          {blog.dislikes}
                        </Typography>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                        <Typography variant="body2" sx={{ mx: 1 }}>
                          {blog.views}
                        </Typography>
                        <IconButton size="small">
                          <Comment />
                        </IconButton>
                        <Typography variant="body2">
                          {blog.comments.length}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MainContent;
