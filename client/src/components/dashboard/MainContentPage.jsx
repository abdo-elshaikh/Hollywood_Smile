import { useState, useEffect, useMemo } from "react";
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
    Paper,
    Button,
    Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { PieChart, BarChart, LineAxis, Message } from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import axiosInstance from "../../services/axiosInstance";

const LineChart = ({ labels, data }) => {
    const chartData = {
        labels,
        datasets: [
            {
                label: "Activity",
                data,
                fill: false,
                backgroundColor: "#3f51b5",
                borderColor: "#3f51b5",

            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        hover: {
            mode: "nearest",
            intersect: true,
        },
        scales: {
            x: {
                grid: {
                    color: "#e0e0e0",
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "#e0e0e0",
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

const MainContentPage = () => {
    const [bookingData, setBookingData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [testimonialsData, setTestimonialsData] = useState([]);
    const [messagesData, setMessagesData] = useState([]);
    const [notificationsData, setNotificationsData] = useState([]);

    const fetchData = async () => {
        try {
            const bookingResponse = (await axiosInstance.get("/bookings")).data;
            setBookingData(bookingResponse.data);

            const usersResponse = await axiosInstance.get("/users");
            setUsersData(usersResponse.data.users);

            const testimonialsResponse = await axiosInstance.get("/testimonials");
            setTestimonialsData(testimonialsResponse.data);

            const messagesResponse = await axiosInstance.get("/messages");
            setMessagesData(messagesResponse.data);

            const notificationsResponse = await axiosInstance.get("/notifications");
            setNotificationsData(notificationsResponse.data);

        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const getDateLabels = () => {
        const labels = [];
        for (let i = 6; i >= 0; i--) {
            labels.push(
                new Date(new Date().setDate(new Date().getDate() - i)).toLocaleDateString()
            );
        }
        return labels;
    };

    const bookingOverTime = useMemo(() => {
        const labels = getDateLabels();
        const data = labels.map((label) =>
            bookingData.filter(
                (item) => new Date(item.createdAt).toLocaleDateString() === label
            ).length
        );
        return { labels, data };
    }, [bookingData]);

    const usersOverTime = useMemo(() => {
        const labels = getDateLabels();
        const data = labels.map((label) =>
            usersData.filter(
                (user) => new Date(user.createdAt).toLocaleDateString() === label
            ).length
        );
        return { labels, data };
    }, [usersData]);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Box
            sx={{
                p: 3,
                backgroundColor: "background.default",
                minHeight: "100vh",
                color: "text.primary",
            }}
        >
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
                Dashboard Overview
            </Typography>

            {/* Metrics Section */}
            <Grid container spacing={2}>
                {[
                    {
                        title: "Total Bookings",
                        count: bookingData.length,
                        icon: <PieChart />,
                        color: "primary.main",
                    },
                    {
                        title: "Total Users",
                        count: usersData.length,
                        icon: <BarChart />,
                        color: "secondary.main",
                    },
                    {
                        title: "Testimonials",
                        count: testimonialsData.length,
                        icon: <LineAxis />,
                        color: "error.main",
                    },
                    {
                        title: "Messages",
                        count: messagesData.length,
                        icon: <Message />,
                        color: "info.main",
                    }
                ].map((metric, index) => (
                    <Grid item xs={12} md={3} key={index}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 3 }}>
                                <Avatar sx={{ bgcolor: metric.color, mr: 2 }}>{metric.icon}</Avatar>
                                <CardContent>
                                    <Typography variant="h6">{metric.title}</Typography>
                                    <Typography variant="h4">{metric.count}</Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {[
                    {
                        title: "Bookings Over Time",
                        chart: <LineChart labels={bookingOverTime.labels} data={bookingOverTime.data} />,
                    },
                    {
                        title: "Users Over Time",
                        chart: <LineChart labels={usersOverTime.labels} data={usersOverTime.data} />,
                    },
                ].map((chart, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card sx={{ p: 2, boxShadow: 3 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 2,
                                        fontWeight: "bold",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    {chart.title}
                                    <Button variant="outlined" size="small">
                                        View All
                                    </Button>
                                </Typography>
                                <Box sx={{ height: "300px" }}>{chart.chart}</Box>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Messages & Testimonials Section */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {[{ title: "Messages", data: messagesData }, { title: "Testimonials", data: testimonialsData }].map(
                    (section, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    backgroundColor: "background.paper",
                                    borderRadius: 2,
                                    color: "text.primary",
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    {section.title}
                                </Typography>
                                <Divider />
                                {section.data.length ? (
                                    <List>
                                        {section.data.slice(0, 5).map((item, idx) => (
                                            <ListItem key={idx}>
                                                <Tooltip title={item.message || item.quote} arrow>
                                                    <ListItemText
                                                        primary={item.subject || item.name}
                                                        secondary={item.content || item.rating}
                                                        primaryTypographyProps={{ variant: "body2", fontWeight: "bold", color: "primary.main", cursor: "pointer" }}
                                                        secondaryTypographyProps={{ variant: "body2", color: "text.secondary" }}
                                                    />
                                                </Tooltip>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body1" color="text.secondary">
                                        No {section.title.toLowerCase()} available.
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                    )
                )}
            </Grid>
        </Box>
    );
};

export default MainContentPage;
