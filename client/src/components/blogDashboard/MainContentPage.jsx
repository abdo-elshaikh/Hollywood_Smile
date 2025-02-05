import React, { useState, useEffect } from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    useTheme,
    useMediaQuery,
    CircularProgress,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import StarIcon from "@mui/icons-material/Star";
import ShareIcon from "@mui/icons-material/Share";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useCustomTheme } from "../../contexts/ThemeProvider";
import blogService from "../../services/blogService";
import commentService from "../../services/commentService"; // Ensure this import exists

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MainContentPage = () => {
    const { mode } = useCustomTheme();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const darkMode = mode === "dark";
    const [blogs, setBlogs] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const mostViewedBlogs = [...blogs].sort((a, b) => b.views - a.views).slice(0, 5);
    const latestBlogs = [...blogs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    const recentComments = [...comments].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    // Stats
    const totalBlogs = blogs.length;
    const totalComments = comments.length;
    const totalLikes = blogs.reduce((acc, blog) => acc + blog.likes, 0);
    const totalDislikes = blogs.reduce((acc, blog) => acc + blog.dislikes, 0);
    const totalViews = blogs.reduce((acc, blog) => acc + blog.views, 0);
    const totalShares = blogs.reduce((acc, blog) => acc + blog.shares, 0);

    // Bar Chart Data
    const chartData = {
        labels: blogs.slice(0, 5).map((blog) => blog.title),
        datasets: [
            {
                label: "Views",
                data: blogs.slice(0, 5).map((blog) => blog.views),
                backgroundColor: darkMode ? "#3f51b5" : "#42a5f5",
            },
            {
                label: "Likes",
                data: blogs.slice(0, 5).map((blog) => blog.likes),
                backgroundColor: darkMode ? "#388e3c" : "#66bb6a",
            },
            {
                label: "Shares",
                data: blogs.slice(0, 5).map((blog) => blog.shares),
                backgroundColor: darkMode ? "#f57c00" : "#ffa726",
            }
        ],
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [blogsData, commentsData] = await Promise.all([blogService.getBlogs(), commentService.getComments()]);
            setBlogs(blogsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            setComments(commentsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            setError('Failed to fetch data. Please try again later.');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, backgroundColor: darkMode ? "background.default" : "white", minHeight: "100vh" }}>
            <Grid container spacing={3}>
                {/* Statistics Cards */}
                {[{
                    label: "Total Blogs",
                    value: totalBlogs,
                    icon: <StarIcon />,
                    color: darkMode ? "#1976d2" : "#1976d2"
                }, {
                    label: "Total Comments",
                    value: totalComments,
                    icon: <ChatBubbleOutlineIcon />,
                    color: darkMode ? "#42a5f5" : "#42a5f5"
                }, {
                    label: "Total Likes",
                    value: totalLikes,
                    icon: <ThumbUpIcon />,
                    color: darkMode ? "#66bb6a" : "#66bb6a"
                }, {
                    label: "Total Dislikes",
                    value: totalDislikes,
                    icon: <ThumbDownIcon />,
                    color: darkMode ? "#f44336" : "#f44336"
                }, {
                    label: "Total Views",
                    value: totalViews,
                    icon: <VisibilityIcon />,
                    color: darkMode ? "#ffca28" : "#ffca28"
                }, {
                    label: "Total Shares",
                    value: totalShares,
                    icon: <ShareIcon />,
                    color: darkMode ? "#ffa726" : "#ffa726"
                }].map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ backgroundColor: stat.color, color: darkMode ? "white" : "black", boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    {stat.icon} {stat.label}
                                </Typography>
                                <Typography variant="h4" sx={{ mt: 1, fontWeight: "bold" }}>
                                    {stat.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {/* Blog Engagement Chart */}
                <Grid item xs={12}>
                    <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            📊 Blog Engagement Trends
                        </Typography>
                        <Bar data={chartData} />
                    </Paper>
                </Grid>

                {/* Latest Blogs */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={4} sx={{ borderRadius: 2 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    🆕 Latest Blogs
                                </Typography>
                                <List>
                                    {latestBlogs.map((blog) => (
                                        <ListItem key={blog._id}>
                                            <ListItemAvatar>
                                                <Avatar src={blog.imageUrl} alt={blog.title} variant="rounded" />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={blog.title}
                                                secondary={`By ${blog.author?.name || "Unknown"} | ${new Date(blog.date).toLocaleDateString()}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>

                {/* Most Viewed Blogs */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={4} sx={{ borderRadius: 2 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    🔥 Most Viewed Blogs
                                </Typography>
                                <List>
                                    {mostViewedBlogs.map((blog) => (
                                        <ListItem key={blog._id}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ backgroundColor: darkMode ? "#f57c00" : "#f57c00" }}>
                                                    <VisibilityIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={blog.title}
                                                secondary={`${blog.views} views`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>

                {/* Recent Comments */}
                <Grid item xs={12}>
                    <Paper elevation={4} sx={{ borderRadius: 2 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    💬 Recent Comments
                                </Typography>
                                <List>
                                    {recentComments.map((comment) => (
                                        <ListItem key={comment._id}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ backgroundColor: darkMode ? "#42a5f5" : "#42a5f5" }}>
                                                    <ChatBubbleOutlineIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={comment.content}
                                                secondary={`By ${comment.author?.name || "Anonymous"} on ${new Date(comment.date).toLocaleDateString()}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MainContentPage;
