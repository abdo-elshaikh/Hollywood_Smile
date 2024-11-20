import React from "react";
import { Box, Grid, Typography, Button, Container } from "@mui/material";
import { motion } from "framer-motion";
import { CheckCircleOutline } from "@mui/icons-material";
import { useCustomTheme } from "../../contexts/ThemeProvider";

// Sample pricing data
const pricingPlans = [
    { name: "Basic", price: 24.5, features: ["Diagnostic Services", "Professional Consultation", "Tooth Implants", "Surgical Extractions", "Teeth Whitening"] },
    { name: "Standard", price: 34.5, features: ["Diagnostic Services", "Professional Consultation", "Tooth Implants", "Surgical Extractions", "Teeth Whitening"] },
    { name: "Premium", price: 54.5, features: ["Diagnostic Services", "Professional Consultation", "Tooth Implants", "Surgical Extractions", "Teeth Whitening"], active: true },
    { name: "Platinum", price: 89.5, features: ["Diagnostic Services", "Professional Consultation", "Tooth Implants", "Surgical Extractions", "Teeth Whitening"] },
];

const PricingSection = () => {
    const { themeMode } = useCustomTheme();

    return (
        <Box component="section" sx={{ py: 10, backgroundColor: themeMode === "dark" ? "#121212" : "#f9f9f9" }}>
            <Container>
                <Grid container justifyContent="center" spacing={5} sx={{ mb: 5 }}>
                    <Grid item xs={12} md={7} textAlign="center">
                        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: 'text.title' }}>
                            Our Best Pricing
                        </Typography>
                        <Typography variant="body1" >
                            Discover our competitive pricing options designed to cater to your dental needs with exceptional quality and service.
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    {pricingPlans.map((plan, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Box
                                    sx={{
                                        p: 4,
                                        textAlign: "center",
                                        border: plan.active ? "2px solid #00acc1" : themeMode === "dark" ? "#333" : "#f5f5f5",
                                        borderRadius: 2,
                                        position: "relative",
                                        backgroundColor: themeMode === "dark" ? "#1f1f1f" : "#fff",
                                        boxShadow: 3,
                                        transition: "all 0.3s",
                                        "&:hover": {
                                            border: "2px solid #00acc1",
                                            boxShadow: 6,
                                            '& .order-button': {
                                                visibility: "visible",
                                                opacity: 1,
                                                transition: "opacity 0.5s",
                                            },
                                        },
                                    }}
                                >
                                    <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#00796b" }}>
                                        {plan.name}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: themeMode === "dark" ? "#fff" : "#333",
                                            "& .price": {
                                                fontWeight: "bold",
                                                fontSize: "2rem",
                                                color: plan.active ? "#00acc1" : "#00796b",
                                            },
                                            "& .per": {
                                                fontSize: "1.2rem",
                                                color: themeMode === "dark" ? "#bbb" : "#888",
                                            },
                                        }}
                                    >
                                        <span className="price">${plan.price.toFixed(2)}</span> <span className="per">/ session</span>
                                    </Typography>
                                    <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0" }}>
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} style={{ display: "flex", alignItems: "center", margin: "0.5rem 0", color: themeMode === "dark" ? "#bbb" : "#666" }}>
                                                <CheckCircleOutline sx={{ color: "#00acc1", mr: 1 }} />
                                                {feature.trim()}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="order-button"
                                        sx={{
                                            px: 4,
                                            py: 2,
                                            borderRadius: 5,
                                            position: "absolute",
                                            bottom: "-30px",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            opacity: 0,
                                            visibility: "hidden",
                                            transition: "all 0.3s",
                                            zIndex: 10,
                                        }}
                                    >
                                        Order now
                                    </Button>
                                </Box>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default PricingSection;
