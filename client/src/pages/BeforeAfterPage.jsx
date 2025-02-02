import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
    TextField,
    useTheme,
    Container,
} from "@mui/material";
import { motion } from "framer-motion";
import axiosInstance from "../services/axiosInstance";
import { useTranslation } from "react-i18next";
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import TestimonySection from '../components/home/TestimonySection';
import HeaderSection from '../components/home/HeaderSection';
import Footer from '../components/home/Footer';

const BeforeAfterCard = ({ beforeImage, afterImage, title }) => {
    const theme = useTheme();
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <Grid
            item
            xs={12}
            sm={6}
            md={3}
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box
                sx={{
                    position: "relative",
                    borderRadius: 2,
                    boxShadow: 3,
                    overflow: "hidden",
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    backgroundColor: theme.palette.grey[200],
                    "&:hover": { transform: "scale(1.05)", transition: "0.3s" },
                }}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <motion.img
                    src={isFlipped ? afterImage : beforeImage}
                    alt={isFlipped ? "After" : "Before"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                />
                <Typography
                    variant="subtitle1"
                    sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                    }}
                >
                    {isFlipped ? "After" : "Before"}
                </Typography>
            </Box>
            <Typography
                variant="h6"
                sx={{
                    mt: 2,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: theme.palette.primary.main,
                }}
            >
                {title}
            </Typography>
        </Grid>
    );
};

const BeforeAfterPage = () => {
    const theme = useTheme();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const { t, i18n } = useTranslation();
    const EN = i18n.language === "en";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosInstance.get("/before-after");
                setData(data);
                setFilteredData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = data.filter((item) =>
            item.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredData(filtered);
    }, [search, data]);

    return (
        <Box>
            <HeaderSection />
            {/* Hero Section */}
            <Box
                sx={{
                    height: 350,
                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    color: 'white',
                    textAlign: 'center',
                    p: 3
                }}
            >
                <Typography variant="h3" component={motion.h3} initial={{ opacity: 0 }} animate={{ opacity: 1 }} sx={{ fontWeight: "bold", mb: 2 }}>
                    {EN ? "Before & After Gallery" : "معرض قبل وبعد"}
                </Typography>
                <Typography variant="h6" component={motion.p} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {EN ? "Explore our before and after gallery" : "استكشف معرضنا قبل وبعد"}
                </Typography>
            </Box>

            {/* Search Bar */}
            <Container sx={{ mt: -3, mb: 4, textAlign: "center" }}>
                <TextField
                    label={EN ? "Search" : "بحث"}
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ maxWidth: 400, mx: "auto", bgcolor: "white", borderRadius: 1 }}
                />
            </Container>

            <Typography
                variant="h5"
                component={motion.h5}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
            >
                {EN ? "Our Work" : "أعمالنا"}
            </Typography>
            <Typography
                variant="subtitle1"
                component={motion.p}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                sx={{ textAlign: "center", mb: 4, maxWidth: 800, mx: "auto" }}
            >
                {EN ? "Click on the image to see the transformation" : "اضغط على الصورة لرؤية التحول"}
            </Typography>

            {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
                    <CircularProgress size={50} />
                </Box>
            ) : (
                <Grid container spacing={4} sx={{ justifyContent: "center", mt: 2, px: 2 }}>
                    {filteredData.map((patient, index) => (
                        <BeforeAfterCard
                            key={patient.id || index}
                            beforeImage={patient.beforeImage}
                            afterImage={patient.afterImage}
                            title={patient.title}
                        />
                    ))}
                </Grid>
            )}

            <TestimonySection />
            <ScrollToTopButton />
            <Footer />
        </Box>
    );
};

export default BeforeAfterPage;
