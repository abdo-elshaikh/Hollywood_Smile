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
        <Box py={5} px={{ xs: 2, md: 10 }} bgcolor="background.default">
            <Container maxWidth="xl" sx={{ position: "relative" }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                position: "relative",
                                backgroundColor: darkMode ? "#333" : "#E3F2FD",
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                padding: "20px",
                                borderRadius: 0,
                                border: "1px solid #ddd",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                // justifyContent: "space-between",
                            }}
                        >
                            <Stack direction="column" spacing={2} justifyContent="center" mb={10}>
                                <Typography gutterBottom variant="h3" fontWeight="bold" component="div" mb={2}>
                                    {isArabic ? "فريقنا" : "Meet Our Team"}
                                </Typography>
                                <Divider sx={{ bgcolor: "text.primary" }} />
                                <Typography variant="subtitle1" mt={2}>
                                    {isArabic ? "نحن نعمل معًا لتقديم أفضل الخدمات لك" : "We work together to provide the best services for you"}
                                </Typography>
                            </Stack>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    mt: 4,
                                    width: "100%",
                                    border: "1px solid #ddd",
                                    borderRadius: 0,
                                }}
                                onClick={() => navigate("/contact-us")}
                            >
                                {isArabic ? "تواصل معنا" : "Contact Us"}
                            </Button>
                        </motion.div>
                    </Grid>

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
                                        position: "relative",
                                        boxShadow: 1,
                                        borderRadius: 0,
                                        border: "none",
                                        bgcolor: darkMode ? "#333" : "#E3F2FD",
                                        '&:hover': { boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.4)' },
                                    }}
                                >
                                    <CardMedia>
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            onClick={() => navigate(`/doctors/${member.id}`)}
                                            style={{
                                                width: "100%",
                                                height: "400px",
                                                objectFit: "cover",
                                                objectPosition: "top",
                                                cursor: "pointer",
                                                '&:hover': { boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.4)' },
                                            }}
                                        />
                                    </CardMedia>

                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{
                                            p: 1,
                                            position: "absolute",
                                            top: '375px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                        }}
                                    >
                                        {Object.keys(member.socials).map((social, index) => (
                                            <Tooltip title={social.charAt(0).toUpperCase() + social.slice(1)} key={index}>
                                                <IconButton
                                                    component="a"
                                                    href={member.socials[social]}
                                                    target="_blank"
                                                    sx={{
                                                        border: "1px solid",
                                                        borderColor: "divider",
                                                        bgcolor: socialIcons[social].color,
                                                        color: "common.white",
                                                        mx: 0.7,
                                                        boxShadow: 4,
                                                        transition: "background-color 0.3s, color 0.3s",
                                                        '&:hover': {
                                                            bgcolor: "common.white",
                                                            color: socialIcons[social].color,
                                                            border: `1px solid ${socialIcons[social].color}`,
                                                        },
                                                    }}
                                                >
                                                    {socialIcons[social].icon}
                                                </IconButton>
                                            </Tooltip>
                                        ))}
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1, pt: 4, backgroundColor: darkMode ? "#333" : "#E3F2FD" }}>
                                        <Typography gutterBottom variant="h4" fontWeight="bold" component="div">
                                            {member.name}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            fontFamily='"Open Sans", sans-serif'
                                            color="primary.dark"
                                            fontWeight="bold"
                                        >
                                            {member.role}
                                        </Typography>
                                        <Typography variant="body1" fontFamily='"Open Sans", sans-serif' color="text.secondary" mt={2}>
                                            {member.description}
                                        </Typography>
                                        <Typography align="center" variant="body2" fontFamily='"Open Sans", sans-serif' color="text.secondary" mt={2}>
                                            {member.rating && member.rating.length > 0 ? (
                                                <Rating
                                                    name="read-only"
                                                    size="large"
                                                    value={member.rating.reduce((acc, rating) => acc + rating.stars, 0) / member.rating.length}
                                                    readOnly
                                                />
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">No ratings yet</Typography>
                                            )}
                                        </Typography>
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
