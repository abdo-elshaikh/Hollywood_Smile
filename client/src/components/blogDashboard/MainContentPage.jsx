import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Badge,
    List,
    ListItem,
    ListItemText,
    Tooltip,
    IconButton,
    LinearProgress,
} from '@mui/material';
import { AddCircleOutline, Visibility, ThumbUp, ThumbDown, Comment, Edit, Delete, Share, Circle } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MainContentPage = ({ blogs = [], comments = [] }) => {
    const recentBlogs = blogs.sort((a, b) => b.date - a.date).slice(0, 5);
    const recentComments = comments.sort((a, b) => b.date - a.date).slice(0, 5);

    // Achievements calculations
    const totalBlogs = blogs.length;
    const totalComments = blogs.reduce((acc, blog) => acc + blog.comments.length, 0);
    const totalLikes = blogs.reduce((acc, blog) => acc + blog.likes, 0);
    const totalDislikes = blogs.reduce((acc, blog) => acc + blog.dislikes, 0);
    const totalViews = blogs.reduce((acc, blog) => acc + blog.views, 0);
    const totalShares = blogs.reduce((acc, blog) => acc + blog.shares, 0);

    // Previous day blogs
    const previousBlogs = blogs.filter((blog) => {
        const blogDate = new Date(blog.date);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return blogDate.getDate() === yesterday.getDate() && blogDate.getMonth() === yesterday.getMonth();
    });

    const previousComments = previousBlogs.reduce((acc, blog) => acc + blog.comments.length, 0);
    const previousLikes = previousBlogs.reduce((acc, blog) => acc + blog.likes, 0);
    const previousDislikes = previousBlogs.reduce((acc, blog) => acc + blog.dislikes, 0);
    const previousViews = previousBlogs.reduce((acc, blog) => acc + blog.views, 0);
    const previousShares = previousBlogs.reduce((acc, blog) => acc + blog.shares, 0);

    const calculateChange = (current, previous) => {
        const change = previous ? ((current - previous) / previous) * 100 : 0;
        return change.toFixed(0);
    };

    const achievements = [
        { title: 'Blogs', value: totalBlogs, icon: <AddCircleOutline />, change: calculateChange(totalBlogs, previousBlogs.length) },
        { title: 'Comments', value: totalComments, icon: <Comment />, change: calculateChange(totalComments, previousComments) },
        { title: 'Likes', value: totalLikes, icon: <ThumbUp />, change: calculateChange(totalLikes, previousLikes) },
        { title: 'Dislikes', value: totalDislikes, icon: <ThumbDown />, change: calculateChange(totalDislikes, previousDislikes) },
        { title: 'Views', value: totalViews, icon: <Visibility />, change: calculateChange(totalViews, previousViews) },
        { title: 'Shares', value: totalShares, icon: <Share />, change: calculateChange(totalShares, previousShares) },
    ];

    return (
        <Box sx={{ px: { xs: 2, sm: 4 }, py: 3 }}>
            {/* Achievements Section */}
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                Achievements
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {achievements.map((achievement, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={index} component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Card sx={{ p: 2, boxShadow: 6, borderRadius: 2, height: '200px', position: 'relative', overflow: 'hidden' }}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: achievement.change > 0 ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
                                    borderRadius: 2,
                                    transition: 'background-color 0.3s ease',
                                }}
                            />
                            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                                <Circle sx={{ fontSize: 50 }} color={achievement.change > 0 ? 'success.main' : 'error.main'} />
                            </Box>
                            <CardContent sx={{ textAlign: 'center', zIndex: 1 }}>
                                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                    <Avatar sx={{ backgroundColor: 'primary.main', color: 'white', width: 50, height: 50, mb: 2 }}>
                                        {achievement.icon}
                                    </Avatar>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', align: 'center' }}>{achievement.value}</Typography>
                                    <Typography fontWeight="bold" textTransform="uppercase" align="center" variant="body1" color="textSecondary">{achievement.title}</Typography>
                                </Box>
                            </CardContent>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: `${Math.min(Math.abs(achievement.change), 100)}%`,
                                    backgroundColor: achievement.change > 0 ? 'success.main' : 'error.main',
                                    opacity: 0.2,
                                    borderRadius: '0 0 4px 4px',
                                    transition: 'height 0.3s ease',
                                }}
                            />
                        </Card>
                    </Grid>
                ))}
            </Grid>


            {/* Recent Blogs Section */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>Recent Blog Posts</Typography>
                <List>
                    {recentBlogs.length > 0 ? (
                        recentBlogs.map((blog, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <ListItem sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
                                    <Avatar src={blog.imageUrl} sx={{ mr: 2 }} />
                                    <ListItemText
                                        primary={blog.title}
                                        secondary={`${blog.author?.name} | ${new Date(blog.date).toLocaleDateString()}`}
                                    />
                                    <Box display="flex" alignItems="center">
                                        <Comment sx={{ mr: 1 }} />
                                        <Typography variant="body2">{blog.comments.length}</Typography>
                                    </Box>
                                </ListItem>
                            </motion.div>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">No recent blog posts available.</Typography>
                    )}
                </List>
            </Box>

            {/* Recent Comments Section */}
            <Box>
                <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>Recent Comments</Typography>
                <List>
                    {recentComments.length > 0 ? (
                        recentComments.map((comment, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <ListItem sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
                                    <Avatar src={comment.image} alt={comment.title} sx={{ mr: 2 }} />
                                    <ListItemText
                                        primary={comment.user?.name}
                                        secondary={comment.content}
                                    />
                                    <Box display="flex" alignItems="center">
                                        <Comment sx={{ mr: 1 }} />
                                        <Typography variant="body2">{comment.replies.length}</Typography>
                                    </Box>
                                </ListItem>
                            </motion.div>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">No recent comments available.</Typography>
                    )}
                </List>
            </Box>
        </Box>
    );
};

export default MainContentPage;
