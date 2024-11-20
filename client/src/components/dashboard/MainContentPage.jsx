import { useState, useEffect, useMemo } from "react";
import { Box, Grid, Card, CardContent, Typography, Avatar, List, ListItem, ListItemText, Tooltip, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { PieChart, BarChart, LineAxis } from "@mui/icons-material";
import { Pie, Line, Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import axiosInstance from "../../services/axiosInstance";

const LineChart = ({ labels, data }) => {
    const chartData = {
        labels,
        datasets: [
            {
                label: "Count",
                data,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(75, 192, 192, 1)",
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };
    return <Line data={chartData} options={options} />;
};

const MainContentPage = () => {
    const [bookingData, setBookingData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [testimonialsData, setTestimonialsData] = useState([]);
    const [messagesData, setMessagesData] = useState([]);
    const [notificationsData, setNotificationsData] = useState([]);

    const fetchBookingData = async () => {
        try {
            const response = await axiosInstance.get("/bookings");
            setBookingData(response.data.data || []);
        } catch (error) {
            console.error("Error fetching booking data: ", error);
        }
    };

    const fetchUsersData = async () => {
        try {
            const response = await axiosInstance.get("/users");
            setUsersData(response.data.users || []);
        } catch (error) {
            console.error("Error fetching users data: ", error);
        }
    };

    const fetchTestimonialsData = async () => {
        try {
            const response = await axiosInstance.get("/testimonials");
            setTestimonialsData(response.data || []);
        } catch (error) {
            console.error("Error fetching testimonials data: ", error);
        }
    };

    const fetchMessagesData = async () => {
        try {
            const response = await axiosInstance.get("/messages");
            setMessagesData(response.data || []);
        } catch (error) {
            console.error("Error fetching messages data: ", error);
        }
    };

    const fetchNotificationsData = async () => {
        try {
            const response = await axiosInstance.get("/notifications");
            setNotificationsData(response.data.notifications || []);
        } catch (error) {
            console.error("Error fetching notifications data: ", error);
        }
    };

    const getDateLabels = () => {
        const labels = [];
        for (let i = 6; i >= 0; i--) {
            labels.push(new Date(new Date().setDate(new Date().getDate() - i)).toLocaleDateString());
        }
        return labels;
    };

    const bookingOverTime = useMemo(() => {
        const labels = getDateLabels();
        const data = labels.map((label) =>
            bookingData.filter((item) => new Date(item.createdAt).toLocaleDateString() === label).length
        );
        return { labels, data };
    }, [bookingData]);

    const usersOverTime = useMemo(() => {
        const labels = getDateLabels();
        const data = labels.map((label) =>
            usersData.filter((user) => new Date(user.createdAt).toLocaleDateString() === label).length
        );
        return { labels, data };
    }, [usersData]);

    useEffect(() => {
        fetchBookingData();
        fetchUsersData();
        fetchTestimonialsData();
        fetchMessagesData();
        fetchNotificationsData();
    }, []);

    return (
        <Box sx={{ p: 3, backgroundColor: 'background.default', minHeight: "100vh" }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
                Dashboard Overview
            </Typography>

            {/* Key Metrics Section */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <Card sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 3 }}>
                            <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                                <PieChart />
                            </Avatar>
                            <CardContent>
                                <Typography variant="h6">Total Bookings</Typography>
                                <Typography variant="h4">{bookingData.length}</Typography>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                <Grid item xs={12} md={4}>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <Card sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 3 }}>
                            <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
                                <BarChart />
                            </Avatar>
                            <CardContent>
                                <Typography variant="h6">Total Users</Typography>
                                <Typography variant="h4">{usersData.length}</Typography>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                <Grid item xs={12} md={4}>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <Card sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 3 }}>
                            <Avatar sx={{ bgcolor: "error.main", mr: 2 }}>
                                <LineAxis />
                            </Avatar>
                            <CardContent>
                                <Typography variant="h6">Testimonials</Typography>
                                <Typography variant="h4">{testimonialsData.length}</Typography>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
            </Grid>

            {/* Recent Messages Section and Notifications */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
                <Grid item xs={12} md={6}>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <Card sx={{ p: 2, boxShadow: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                                Recent Messages
                            </Typography>
                            <Messages messages={messagesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))} />
                        </Card>
                    </motion.div>
                </Grid>

                {/* recent testimonials */}
                <Grid item xs={12} md={6}>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <Card sx={{ p: 2, boxShadow: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                                Recent Testimonials
                            </Typography>
                            <List>
                                {testimonialsData.slice(0, 5).map((testimonial) => (
                                    <ListItem key={testimonial._id}>
                                        <ListItemText
                                            primary={
                                                <Tooltip title={testimonial.message} arrow>
                                                    <Typography variant="body1" noWrap>
                                                        {testimonial.quote} - {testimonial.name}
                                                    </Typography>
                                                </Tooltip>
                                            }
                                            secondary={
                                                <Typography variant="body2">
                                                    <strong>Rating:</strong> {testimonial.rating} - {testimonial.position}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    </motion.div>
                </Grid>

                {/* <Grid item xs={12} md={6}>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <Card sx={{ p: 2, boxShadow: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                                Recent Notifications
                            </Typography>
                            <Notifications notifications={notificationsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))} />
                        </Card>
                    </motion.div>
                </Grid> */}
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
                <Grid item xs={12} md={6}>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <Card sx={{ p: 2, boxShadow: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                                Bookings Over Time
                            </Typography>
                            <Box sx={{ height: "300px" }}>
                                <LineChart labels={bookingOverTime.labels} data={bookingOverTime.data} />
                            </Box>
                        </Card>
                    </motion.div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <Card sx={{ p: 2, boxShadow: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                                Users Over Time
                            </Typography>
                            <Box sx={{ height: "300px" }}>
                                <LineChart labels={usersOverTime.labels} data={usersOverTime.data} />
                            </Box>
                        </Card>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

const Messages = ({ messages }) => {
    return (
        <List>
            {messages.slice(0, 5).map((message) => (
                <ListItem key={message.id}>
                    <ListItemText
                        primary={
                            <Tooltip title={message.message} arrow>
                                <Typography variant="body1" noWrap>
                                    {message.message}
                                </Typography>
                            </Tooltip>
                        }
                        secondary={message.createdAt.toLocaleString()}
                    />
                </ListItem>
            ))}
        </List>
    );
};

const Notifications = ({ notifications }) => {
    return (
        <List>
            {notifications.slice(0, 5).map((notification) => (
                <ListItem key={notification.id}>
                    <ListItemText
                        primary={
                            <Tooltip title={notification.message} arrow>
                                <Typography variant="body1" noWrap>
                                    {notification.message}
                                </Typography>
                            </Tooltip>
                        }
                        secondary={notification.createdAt.toLocaleString()}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default MainContentPage;
