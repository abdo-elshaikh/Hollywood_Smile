import React, { useState, useEffect } from "react";
import {
    Box, Grid, Typography, Button, IconButton,
    Divider, Container, Card, CardContent,
    CardMedia, Stack, Rating, Tooltip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Facebook, Twitter, LinkedIn, Instagram } from "@mui/icons-material";
import doctorService from "../../services/doctorService";
import { useCustomTheme } from "../../contexts/ThemeProvider";

const TeamSection = () => {
    const { t, i18n } = useTranslation();
    const [staffMembers, setStaffMembers] = useState([]);
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const { mode } = useCustomTheme();
    const darkMode = mode === "dark";

    useEffect(() => {
        const fetchStaffMembers = async () => {
            try {
                const doctors = await doctorService.fetchDoctors();
                setStaffMembers(doctors.slice(0, 5));
            } catch (error) {
                console.error(error);
            }
        };
        fetchStaffMembers();
    }, []);

    const teamMembers = staffMembers.map((member) => ({
        id: member._id,
        name: isArabic ? member.name.ar : member.name.en,
        role: isArabic ? member.position.ar : member.position.en,
        description: isArabic ? member.description.ar : member.description.en,
        image: member.imageUrl,
        socials: member.socialLinks,
        rating: member.rating,
    }));

    const socialIcons = {
        twitter: { icon: <Twitter />, color: '#1DA1F2' },
        facebook: { icon: <Facebook />, color: '#1877F2' },
        linkedin: { icon: <LinkedIn />, color: '#0A66C2' },
        instagram: { icon: <Instagram />, color: '#C13584' },
    };

    return (
        <Box py={6} px={{ xs: 2, md: 10 }} sx={{
            minHeight: "100vh",
            // backgroundColor: darkMode ? "#1a1a1a" : "#f9f9f9",
        }}>
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    {/* Section Title */}
                    <Grid item xs={12} md={3}>
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                backgroundColor: darkMode ? "#252839" : "#EEF7FF",
                                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
                                padding: "30px",
                                borderRadius: "12px",
                                border: "1px solid #ddd",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Stack direction="column" spacing={3}>
                                <Typography variant="h3" fontWeight="700" sx={{ color: darkMode ? "#fff" : "#333" }}>
                                    {isArabic ? "فريقنا" : "Meet Our Team"}
                                </Typography>
                                <Divider sx={{ bgcolor: "text.primary" }} />
                                <Typography variant="subtitle1" sx={{ color: darkMode ? "#bbb" : "#555" }}>
                                    {isArabic ? "نحن نعمل معًا لتقديم أفضل الخدمات لك" : "We work together to provide the best services for you"}
                                </Typography>
                            </Stack>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    mt: 4,
                                    width: "100%",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    py: 1.5,
                                    transition: "all 0.3s ease",
                                    '&:hover': { transform: "scale(1.05)" },
                                }}
                                onClick={() => navigate("/contact-us")}
                            >
                                {isArabic ? "تواصل معنا" : "Contact Us"}
                            </Button>
                        </motion.div>
                    </Grid>

                    {/* Team Members */}
                    {teamMembers.map((member, index) => (
                        <Grid item xs={12} md={3} key={member.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.3 }}
                            >
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
                                        borderRadius: "12px",
                                        bgcolor: darkMode ? "#252839" : "#EEF7FF",
                                        '&:hover': { transform: "scale(1.02)", transition: "0.3s ease-in-out" },
                                    }}
                                >
                                    <CardMedia>
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            onClick={() => navigate(`/doctors/${member.id}`)}
                                            style={{
                                                width: "100%",
                                                height: "350px",
                                                objectFit: "cover",
                                                objectPosition: "top",
                                                borderTopLeftRadius: "12px",
                                                borderTopRightRadius: "12px",
                                                cursor: "pointer",
                                            }}
                                        />
                                    </CardMedia>

                                    {/* Social Media Links */}
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{ p: 2 }}
                                    >
                                        {Object.keys(member.socials).map((social, index) => (
                                            <Tooltip title={social.charAt(0).toUpperCase() + social.slice(1)} key={index}>
                                                <IconButton
                                                    component="a"
                                                    href={member.socials[social]}
                                                    target="_blank"
                                                    sx={{
                                                        borderRadius: "50%",
                                                        bgcolor: socialIcons[social].color,
                                                        color: "white",
                                                        mx: 0.7,
                                                        '&:hover': {
                                                            bgcolor: "white",
                                                            color: socialIcons[social].color,
                                                            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
                                                            border: "1px solid #ddd",
                                                        },
                                                    }}
                                                >
                                                    {socialIcons[social].icon}
                                                </IconButton>
                                            </Tooltip>
                                        ))}
                                    </Box>

                                    <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                                        <Typography variant="h5" fontWeight="700">{member.name}</Typography>
                                        <Typography variant="subtitle1" color="primary">{member.role}</Typography>
                                        <Typography variant="body2" color="text.secondary" mt={1} mb={2}>{member.description}</Typography>
                                        {member.rating && member.rating.length > 0 && (
                                            <Rating value={member.rating.reduce((acc, r) => acc + r.stars, 0) / member.rating.length} readOnly size="large" />
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default TeamSection;
