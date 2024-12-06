import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Container,
  Chip,
  CardMedia,
  Avatar,
  Pagination,
  CircularProgress,
  Button,
} from '@mui/material';
import { ThumbUp, Comment, Share, ThumbDown, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MainContent = ({ blogEntries, page, rowsPerPage, setPage, categories }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filteredBlogs, setFilteredBlogs] = useState(blogEntries);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };

  useEffect(() => {
    setLoading(true);
    let filtered = blogEntries;

    if (selectedCategory) {
      filtered = blogEntries.filter((blog) => blog.categories.includes(selectedCategory));
    }

    // Pagination logic: slice the filtered blogs to match the current page and rows per page
    const paginatedBlogs = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    setFilteredBlogs(paginatedBlogs);
    setLoading(false);
  }, [blogEntries, selectedCategory, page, rowsPerPage]);

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  }

  return (
    <Container maxWidth="lg">
      {/* Categories Filter */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          mb: 4,
          p: 1,
          borderRadius: 2,
          boxShadow: 2,
          border: '1px solid',
        }}
      >
        <Chip
          label={t('All')}
          onClick={() => handleCategorySelect('')}
          sx={{
            margin: 0.5,
            cursor: 'pointer',
            backgroundColor: selectedCategory === '' ? 'primary.main' : 'default',
            color: selectedCategory === '' ? 'white' : 'inherit',
            '&:hover': { backgroundColor: 'primary.light' },
          }}
        />
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            onClick={() => handleCategorySelect(category)}
            sx={{
              margin: 0.5,
              cursor: 'pointer',
              backgroundColor: selectedCategory === category ? 'primary.main' : 'default',
              color: selectedCategory === category ? 'white' : 'inherit',
              '&:hover': { backgroundColor: 'primary.light' },
            }}
          />
        ))}
      </Box>

      {/* Blog Entries Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredBlogs.map((blog, index) => (
            <Grid
              item
              xs={12}
              sm={index % 3 === 0 ? 12 : 6}
              md={index % 3 === 0 ? 8 : 4}
              key={blog._id}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { boxShadow: 2, transform: 'translateY(-5px)' },
                  }}
                  onClick={() => handleBlogClick(blog._id)}
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
                      <Avatar
                        src={blog.author?.avatarUrl || ''}
                        alt={blog.author?.name || t('Anonymous')}
                        sx={{ width: 40, height: 40, mr: 1 }}
                      />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ fontWeight: 'bold', mx: 1 }}
                      >
                        {blog.author?.name || t('Anonymous')} |{' '}
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: 'bold', mb: 1 }}
                    >
                      {blog.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {blog.content.length > 100
                        ? `${blog.content.slice(0, 100)}...`
                        : blog.content}
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
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton size="small">
                          <ThumbUp />
                        </IconButton>
                        <Typography variant="body2" sx={{ mx: 1 }}>
                          {blog.likes || 0}
                        </Typography>
                        <IconButton size="small">
                          <ThumbDown />
                        </IconButton>
                        <Typography variant="body2" sx={{ mx: 1 }}>
                          {blog.dislikes || 0}
                        </Typography>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                        <Typography variant="body2" sx={{ mx: 1 }}>
                          {blog.views || 0}
                        </Typography>
                        <IconButton size="small">
                          <Comment />
                        </IconButton>
                        <Typography variant="body2">
                          {blog.comments?.length || 0}
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

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={Math.ceil(filteredBlogs.length / rowsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default MainContent;
