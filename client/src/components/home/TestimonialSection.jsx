import React from "react";
import { Box, Typography, Avatar, Divider, Container } from "@mui/material";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";

const testimonials = [
    {
        img: "img/testimonial-1.jpg",
        feedback:
            "Dolores sed duo clita justo dolor et stet lorem kasd dolore lorem ipsum. At lorem lorem magna ut et, nonumy labore diam erat. Erat dolor rebum sit ipsum.",
        name: "Client Name",
    },
    {
        img: "img/testimonial-2.jpg",
        feedback:
            "Dolores sed duo clita justo dolor et stet lorem kasd dolore lorem ipsum. At lorem lorem magna ut et, nonumy labore diam erat. Erat dolor rebum sit ipsum.",
        name: "Client Name",
    },
    {
        img: "img/testimonial-3.jpg",
        feedback:
            "Dolores sed duo clita justo dolor et stet lorem kasd dolore lorem ipsum. At lorem lorem magna ut et, nonumy labore diam erat. Erat dolor rebum sit ipsum.",
        name: "Client Name",
    },
    {
        img: "img/testimonial-4.jpg",
        feedback:
            "Dolores sed duo clita justo dolor et stet lorem kasd dolore lorem ipsum. At lorem lorem magna ut et, nonumy labore diam erat. Erat dolor rebum sit ipsum.",
        name: "Client Name",
    },
];

const TestimonialSection = () => {
    const { t } = useTranslation();

    return (
        <Box
            sx={{

                py: 5,
                my: 5,
                color: "white",
                backgroundColor: "background.default",
            }}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Container
                maxWidth="md"
                sx={{
                    textAlign: "center",
                    borderRadius: 1,
                    p: 2,
                    mx: "auto",
                }}
            >
                <Box display="flex" justifyContent="center" mb={3}>
                    <Typography
                        variant="h4"
                        component={motion.h4}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        sx={{
                            fontWeight: "bold",
                            color: "secondary.main",
                        }}
                    >
                        {t("Testimonials")}
                    </Typography>
                </Box>
                <Swiper
                    modules={[Pagination, Navigation, Autoplay]}
                    spaceBetween={50}
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation
                    loop
                    className="mySwiper"
                    // style={{ padding: "20px 0" }}
                >
                    {testimonials.map((testimonial, index) => (
                        <SwiperSlide key={index}>
                            <Box
                                textAlign="center"
                                component={motion.div}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                                sx={{
                                    mx: 4,
                                    p: 4,
                                    mb: 4,
                                    borderRadius: 1,
                                    background: 'linear-gradient(45deg, #2F89FC, #21AAC4)',
                                }}
                            >
                                <Avatar
                                    src={testimonial.img}
                                    alt={testimonial.name}
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        mx: "auto",
                                        mb: 2,
                                    }}
                                />
                                <Typography variant="body1" color="white" fontStyle="italic" gutterBottom>
                                    "{t(testimonial.feedback)}"
                                </Typography>
                                <Divider
                                    sx={{
                                        width: "25%",
                                        mx: "auto",
                                        my: 2,
                                        backgroundColor: "white",
                                    }}
                                />
                                <Typography variant="h6">{t(testimonial.name)}</Typography>
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Container>
        </Box>
    );
};

export default TestimonialSection;
