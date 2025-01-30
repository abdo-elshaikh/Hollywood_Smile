import React, { useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useCustomTheme } from "../../contexts/ThemeProvider";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@mui/system";

// Keyframe animations
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const slideInDown = keyframes`
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideInUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideLeft = keyframes`
  from { transform: translateX(50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideRight = keyframes`
  from { transform: translateX(-50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const zoomIn = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

// Carousel images and text
const baseUrl = import.meta.env.VITE_SUPABASE_VIEW_URL + '/uploads/slides';
const carouselItems = [
  {
    id: 1,
    image: `${baseUrl}/slide_1.jpg`,
    title: {
      ar: "ابتسامة صحية",
      en: "Healthy Smile"
    },
    subtitle: {
      ar: "نحن هنا من أجلك لابتسامة مشرقة.",
      en: "We are here for your bright smile."
    }
  },
  {
    id: 2,
    image: `${baseUrl}/slide_2.jpg`,
    title: {
      ar: "خدماتنا",
      en: "Our Services"
    },
    subtitle: {
      ar: "تقدم عيادتنا خدمات علاجية وفحص شامل.",
      en: "Our clinic offers comprehensive treatments and check-ups."
    }
  },
  {
    id: 3,
    image: `${baseUrl}/slide_3.jpg`,
    title: {
      ar: "أفضل أطباء الأسنان",
      en: "Best Dentists"
    },
    subtitle: {
      ar: "فريقنا من المتخصصين يضمن لك أفضل رعاية.",
      en: "Our team of specialists ensures the best care for you."
    }
  },
  {
    id: 4,
    image: `${baseUrl}/slide_4.jpg`,
    title: {
      ar: "ابتسامة جديدة",
      en: "New Smile"
    },
    subtitle: {
      ar: "ابدأ اليوم في تحويل ابتسامتك.",
      en: "Start today in transforming your smile."
    }
  },
  {
    id: 5,
    image: `${baseUrl}/slide_5.jpg`,
    title: {
      ar: "الراحة أولاً",
      en: "Comfort First"
    },
    subtitle: {
      ar: "نحن نقدم لك بيئة مريحة وآمنة.",
      en: "We offer you a comfortable and safe environment."
    }
  }
];

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const { mode } = useCustomTheme();
  const navigate = useNavigate();
  const isDark = mode === "dark";
  const isArabic = i18n.language === "ar";

  
  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: '70vh', md: '80vh' },
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        style={{ width: "100%", height: "100%" }}

      >
        {carouselItems.map((item) => (
          <SwiperSlide key={item.id}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              {/* Background Image */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  zIndex: 0,
                }}
              />
              {/* Gradient Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: isDark
                    ? "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8))"
                    : "linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.7))",
                  zIndex: 1,
                }}
              />
              {/* Content */}
              <Container
                maxWidth="sm"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                  textAlign: "center",
                  color: isDark ? "#fff" : "#000",
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    fontSize: { xs: '2rem', md: '3rem' },
                    animation: `${slideInDown} 1s ease-in-out forwards`,
                    textShadow: isDark
                      ? "2px 2px 8px rgba(0, 0, 0, 0.8)"
                      : "2px 2px 8px rgba(255, 255, 255, 0.8)",
                  }}
                >
                  {isArabic ? item.title.ar : item.title.en}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    fontStyle: "italic",
                    animation: `${zoomIn} 1.5s ease-in-out forwards`,
                    textShadow: isDark
                      ? "1px 1px 4px rgba(0, 0, 0, 0.6)"
                      : "1px 1px 4px rgba(255, 255, 255, 0.6)",
                  }}
                >
                  {isArabic ? item.subtitle.ar : item.subtitle.en}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      animation: `${isArabic ? slideLeft : slideRight} 1.5s ease`,
                      borderRadius: "25px",
                      fontWeight: "bold",
                      px: 4,
                      py: 1.5,
                      "&:hover": {
                        transform: 'translateY(-2px)',
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                        transition: "all 0.3s ease-in-out",
                      },
                    }}
                    onClick={() => navigate("/booking")}
                  >
                    {isArabic ? 'احجز الان' : 'Book Now'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    sx={{
                      animation: `${isArabic ? slideRight : slideLeft} 1.5s ease-in-out`,
                      borderRadius: "25px",
                      fontWeight: "bold",
                      px: 4,
                      py: 1.5,
                      borderWidth: "2px",
                      "&:hover": {
                        transform: 'translateY(-2px)',
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                        transition: "all 0.3s ease-in-out",
                      },
                    }}
                    onClick={() => navigate("/contact-us")}
                  >
                    {isArabic ? 'تواصل معنا' : 'Contact Us'}
                  </Button>
                </Box>
              </Container>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default HeroSection;