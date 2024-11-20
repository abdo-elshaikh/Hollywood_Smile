import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";

// Custom Image Imports (Update paths as needed)
import ImplantIcon from "../../assets/implant.png";
import ToothIcon from "../../assets/tooth.png";
import DentistImage from "../../assets/dentist.png";
import ToothbrushIcon from "../../assets/toothbrush.png";

// Sample data for each card
const cardData = [
    {
        title: "Dental Implants",
        subtitle: "Let's transform your smile",
        discount: "20% OFF",
        contact: "+123 456 789",
        imgSrc: ImplantIcon,
        gradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", // Dark teal gradient
    },
    {
        title: "Take care of your smile",
        discount: "40% OFF",
        imgSrc: ToothIcon,
        gradient: "linear-gradient(135deg, #ff7e5f, #feb47b)", // Orange gradient
    },
    {
        title: "Expert Dental Care",
        imgSrc: DentistImage,
        contact: "+123 456 789",
        gradient: "linear-gradient(135deg, #4568dc, #b06ab3)", // Blue-Purple gradient
    },
    {
        title: "Oral Hygiene Tips",
        subtitle: "What you should do every day",
        buttonText: "New Blog Post",
        imgSrc: ToothbrushIcon,
        gradient: "linear-gradient(135deg, #a1c4fd, #c2e9fb)", // Light Blue gradient
    },
];

// Main Card Component
const DentalCard = ({ title, subtitle, discount, contact, imgSrc, buttonText, gradient }) => {
    const theme = useTheme();

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                scale: 1.05,
                boxShadow: "0px 20px 40px rgba(0,0,0,0.2)",
            }}
            transition={{ duration: 0.3 }}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 500,
                width: 300,
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                background: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)', // Light Blue gradient
                color: "#ffffff",
                p: 3,
                m: 2,
                boxShadow: "0px 15px 35px rgba(0, 0, 0, 0.15)",
            }}
        >
            {/* Background Image */}
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    background: `url(${imgSrc}) center center / cover no-repeat`,
                    position: "absolute",
                    zIndex: -1,
                    opacity: 0.4, // Dim background image
                    //   filter: "blur(5px)",
                }}
            />

            {/* Overlay Gradient */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: gradient,
                    zIndex: -2,
                    opacity: 0.6,
                }}
            />

            {/* Discount Badge */}
            {discount && (
                <motion.div
                    whileHover={{ scale: 1.2 }}
                    style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        padding: "10px 20px",
                        borderRadius: "50%",
                        background: "rgba(255, 255, 255, 0.3)",
                        color: "#ffffff",
                        fontWeight: "bold",
                    }}
                >
                    {discount}
                </motion.div>
            )}

            {/* Card Text */}
            <Typography
                component={motion.div}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                variant="h5"
                sx={{ mb: 2, fontWeight: "bold", color: "#ffffff", textAlign: "center" }}
            >
                {title}
            </Typography>
            {subtitle && (
                <Typography
                    component={motion.div}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    variant="body1"
                    sx={{ mb: 3, textAlign: "center", px: 2, lineHeight: 1.5, color: "#ffffff" }}
                >
                    {subtitle}
                </Typography>
            )}

            {/* Contact Button */}
            {contact && (
                <Button
                    variant="contained"
                    sx={{
                        mt: 3,
                        textTransform: "none",
                        borderRadius: 30,
                        px: 3,
                        py: 1,
                        background: "#f5f5f5",
                        color: theme.palette.text.primary,
                        boxShadow: "0px 5px 15px rgba(255, 255, 255, 0.4)",
                        "&:hover": {
                            background: "#ffffff",
                            color: "#2196f3",
                            boxShadow: "0px 10px 30px rgba(255, 255, 255, 0.4)",
                        },
                    }}
                >
                    Contact Us: {contact}
                </Button>
            )}

            {/* CTA Button */}
            {buttonText && (
                <Button
                    variant="outlined"
                    sx={{
                        mt: 3,
                        textTransform: "none",
                        color: "#ffffff",
                        borderColor: "#ffffff",
                        borderRadius: 20,
                        "&:hover": {
                            background: "#ffffff",
                            color: theme.palette.primary.main,
                            borderColor: theme.palette.primary.main,
                        },
                    }}
                >
                    {buttonText}
                </Button>
            )}
        </Box>
    );
};

// Main Section Container
const DentalCardsSection = () => (
    <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ py: 10, px: 2, bgcolor: "background.default" }}
    >
        {/* Section Title */}
        <Typography variant="h3" sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}>
            Our Dental Services
        </Typography>

        {/* Section Subtitle */}
        <Typography variant="h6" sx={{ mb: 5, color: "text.secondary", textAlign: "center" }}>
            Explore the range of professional dental services we offer to keep your smile healthy and bright!
        </Typography>

        {/* Card Grid Container */}
        <Box display="flex" justifyContent="center" alignItems="center" gap={4} flexWrap="wrap">
            {cardData.map((data, index) => (
                <DentalCard key={index} {...data} />
            ))}
        </Box>
    </Box>
);


export default DentalCardsSection;
