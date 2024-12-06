import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemText,
    Tooltip,
    IconButton,
    CircularProgress,
    Divider,
} from '@mui/material';
import {
    AddCircleOutline,
    Visibility,
    ThumbUp,
    ThumbDown,
    Comment,
    Edit,
    Delete,
    Share,
    Verified,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MainContentPage = ({ blogs = [], comments = [] }) => {
    const navigate = useNavigate();
    
    const recentBlogs = blogs.slice(0, 5);
    const recentComments = comments.slice(0, 15);

    const mostBlogs = blogs.sort((a, b) => b.views - a.views).slice(0, 5);

    const totalBlogs = blogs.length;
    const totalComments = comments.length;
    const totalLikes = blogs.reduce((acc, blog) => acc + blog.likes, 0);
    const totalDislikes = blogs.reduce((acc, blog) => acc + blog.dislikes, 0);
    const totalViews = blogs.reduce((acc, blog) => acc + blog.views, 0);
    const totalShares = blogs.reduce((acc, blog) => acc + blog.shares, 0);

    const achievements = [
        { title: 'Blogs', value: totalBlogs, icon: <AddCircleOutline /> },
        { title: 'Comments', value: totalComments, icon: <Comment /> },
        { title: 'Likes', value: totalLikes, icon: <ThumbUp /> },
        { title: 'Dislikes', value: totalDislikes, icon: <ThumbDown /> },
        { title: 'Views', value: totalViews, icon: <Visibility /> },
        { title: 'Shares', value: totalShares, icon: <Share /> },
    ];

    return (
        <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: 'background.default' }}>
            {/* Achievements Section */}
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                Achievements
            </Typography>
            <Grid container spacing={3}>
                {achievements.map((achievement, index) => (
                    <Grid
                        item
                        xs={6}
                        sm={4}
                        md={3}
                        lg={2}
                        key={index}
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        <Card
                            sx={{
                                p: 3,
                                boxShadow: 4,
                                textAlign: 'center',
                                position: 'relative',
                                background: 'linear-gradient(135deg, #e3f2fd, #C90808, #39A1CE, #1976d2)',
                            }}>
                            <Avatar
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    width: 60,
                                    height: 60,
                                    mb: 2,
                                    mx: 'auto',
                                }}
                            >
                                {achievement.icon}
                            </Avatar>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                                {achievement.value}
                            </Typography>
                            <Typography variant="body1" color="white">
                                {achievement.title}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Divider sx={{ my: 5 }} />
            <Grid container spacing={3} >
                <Grid item xs={12} md={6}>
                    {/* Recent Blogs Section */}
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                            Recent Blog Posts
                        </Typography>
                        <List>
                            {recentBlogs.length > 0 ? (
                                recentBlogs.map((blog, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <ListItem
                                            sx={{
                                                mb: 2,
                                                p: 2,
                                                cursor: 'pointer',
                                                borderBottom: `1px solid `,
                                                borderColor: 'divider',
                                                '&:hover': {
                                                    bgcolor: 'action.hover',
                                                    borderBottom: '2px solid',
                                                },
                                            }}
                                        >
                                            <Avatar src={blog.imageUrl} sx={{ mr: 2, width: 60, height: 60 }} />
                                            <ListItemText
                                                primary={blog.title}
                                                secondary={`By ${blog.author?.name} | ${new Date(blog.date).toLocaleString()} | comments: ${blog.comments.length}`}
                                            />
                                            <Tooltip title="Comments">
                                                <IconButton>
                                                    <Comment sx={{ color: 'primary.main' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </ListItem>
                                    </motion.div>
                                ))
                            ) : (
                                <Typography variant="body1" color="text.secondary">
                                    No recent blog posts available.
                                </Typography>
                            )}
                        </List>
                    </Box>
                </Grid>
                <Divider orientation="vertical" flexItem sx={{ mx: 2, display: { xs: 'none', md: 'block' } }} />
                <Grid item xs={12} md={5}>
                    {/* Most Viewed Blogs Section */}
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                            Most Viewed Blogs
                        </Typography>
                        <List>
                            {mostBlogs.length > 0 ? (
                                mostBlogs.map((blog, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <ListItem
                                            sx={{
                                                mb: 2,
                                                p: 2,
                                                cursor: 'pointer',
                                                borderBottom: `1px solid `,
                                                borderColor: 'divider',
                                                '&:hover': {
                                                    bgcolor: 'action.hover',
                                                    borderBottom: '2px solid',
                                                },
                                            }}
                                            onClick={() => navigate(`/blog-dashboard/view-blog/${blog._id}`)}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body1"
                                                        sx={{
                                                            fontWeight: 400,
                                                            color: 'secondary.main',
                                                            textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)',
                                                            fontFamily: 'Poppins, sans-serif',
                                                        }}>
                                                        {blog.title}
                                                    </Typography>
                                                }
                                                secondary={`By ${blog.author?.name} | ${new Date(blog.date).toLocaleString()}`}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {blog.views}
                                            </Typography>
                                        </ListItem>
                                    </motion.div>
                                ))
                            ) : (
                                <Typography variant="body1" color="text.secondary">
                                    No most viewed blog posts available.
                                </Typography>
                            )}
                        </List>
                    </Box>
                </Grid>
            </Grid>

            {/* Recent Comments Section */}
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                    Recent Comments
                </Typography>
                <List
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        overflow: 'auto',
                        maxHeight: 400,
                        '&::-webkit-scrollbar': { width: 8, height: 8, bgcolor: 'background.default' },
                        '&::-webkit-scrollbar-thumb': { bgcolor: 'primary.main', borderRadius: 1 },
                        '&::-webkit-scrollbar-track': { bgcolor: 'background.default', borderRadius: 1 },
                    }}
                >
                    {recentComments.length > 0 ? (
                        recentComments.map((comment, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <ListItem
                                    sx={{
                                        mb: 2,
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        cursor: 'pointer',
                                        ':hover': { boxShadow: 2 },
                                    }}
                                    onClick={() => navigate(`/blog-dashboard/view-blog/${comment.blog?._id}`)}
                                >
                                    <Avatar src={comment.user?.avatarUrl} sx={{ mr: 2, width: 60, height: 60 }} />
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center">
                                                <Typography variant="body1" sx={{ fontWeight: '200' }}>
                                                    {comment.user?.name && (
                                                        <span style={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                            <Verified color="primary" sx={{ mr: 1 }} />
                                                            {comment.user.name}
                                                        </span>
                                                    )}
                                                    {!comment.user?.name && <span style={{ fontWeight: '200', color: 'primary.main' }}>Anonymous</span>}
                                                    <Typography variant="body2" color="text.primary" >
                                                        {new Date(comment.date).toLocaleString()}
                                                    </Typography>
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {comment.blog?.title}
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                    {comment.content}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            </motion.div>
                        ))
                    ) : (
                        <Typography variant="body1" color="text.secondary">
                            No recent comments available.
                        </Typography>
                    )}
                </List>
            </Box>
        </Box>
    );
};

export default MainContentPage;
