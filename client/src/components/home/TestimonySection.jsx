import React, { useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Box, Typography, Avatar, Container, Rating, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../services/axiosInstance";

const TestimonySection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const fetchTestimonials = async () => {
    try {
      const response = await axiosInstance.get("/testimonials");
      const dataFilter = response.data.filter((item) => item.show);
      setTestimonials(dataFilter);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const cardData = useMemo(() => {
    return testimonials.map((item) => ({
      id: item._id,
      name: item.name,
      position: item.position,
      quote: item.quote,
      imgUrl: item.imageUrl,
      rating: item.rating,
    }));
  }, [testimonials]);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box textAlign="center" sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, color: "primary.main", fontFamily: '"Cairo Play", serif' }}>
          {t("testimonials.title")}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {t("testimonials.description")}
        </Typography>
        <Box
          sx={{
            textAlign: "center",
            mb: 4,
            width: 100,
            borderBottom: "4px solid",
            borderColor: 'primary.main',
            margin: "0 auto",
          }}
        />
      </Box>

      <Grid container spacing={0}>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={2}
          slidesPerGroup={2}
          loop={true}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          breakpoints={{
            0: { type: 'bullets', slidesPerView: 1, slidesPerGroup: 1 },
            600: { type: 'bullets', slidesPerView: 1, slidesPerGroup: 1 },
            960: { type: 'bullets', slidesPerView: 2, slidesPerGroup: 2 },
          }}
        >
          {cardData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SwiperSlide>
                <TestimonyCard
                  name={item.name}
                  position={item.position}
                  quote={item.quote}
                  imgUrl={item.imgUrl}
                  rating={item.rating}
                  t={t}
                  isArabic={isArabic}
                />
              </SwiperSlide>
            </motion.div>
          ))}
        </Swiper>
      </Grid>
    </Container>
  );
};

const TestimonyCard = ({ name, position, quote, imgUrl, rating, t, isArabic }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.7 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, type: "spring" }}
  >
    <Box
      sx={{
        backgroundColor: "background.paper",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        p: 4,
        mb: 8,
        mx: 2,
        minHeight: 250,
        textAlign: isArabic ? "right" : "left",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ":hover": {
          transform: "translateY(-5px)",
          boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.15)",
          transition: "all 0.3s ease-in-out",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar
          src={imgUrl}
          alt={name}
          sx={{
            width: 90,
            height: 90,
            border: "4px solid",
            borderColor: "primary.main",
            mr: isArabic ? 0 : 2,
            ml: isArabic ? 2 : 0,
          }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
            {t("testimonials.mr")} {name}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            {position}
          </Typography>
          <Rating value={rating} readOnly precision={0.5} sx={{ mt: 1, color: "primary.main" }} />
        </Box>
      </Box>

      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          fontStyle: "italic",
          lineHeight: 1.8,
          fontSize: "1rem",
        }}
      >
        "{quote}"
      </Typography>
    </Box>
  </motion.div>
);

export default TestimonySection;
