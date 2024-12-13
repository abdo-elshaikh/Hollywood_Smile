import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useCustomTheme } from "../../contexts/ThemeProvider";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@mui/system";

// Keyframe animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideInDown = keyframes`
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideLeft = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideRight = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const zoomIn = keyframes`
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const buttonHover = keyframes`
  from { transform: scale(1); }
  to {transform: scale(1.1)}
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
    image: `${baseUrl}/slide_7.jpg`,
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
    image: `${baseUrl}/slide_10.jpg`,
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
        // navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
        style={{ height: "100%" }}
      >
        {carouselItems.map((item) => (
          <SwiperSlide key={item.id}>
            {/* Background image */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                animation: `${fadeIn} 2s ease-in-out`,
              }}
            >
              {/* Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: isDark
                    ? "rgba(0, 0, 0, 0.5)"
                    : "rgba(255, 255, 255, 0.5)",
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
                  variant="h3"
                  color="primary.main"
                  sx={{
                    fontWeight: "bold",
                    textShadow: isDark
                      ? "2px 2px 4px rgba(0, 0, 0, 0.7)"
                      : "2px 2px 4px rgba(255, 255, 255, 0.7)",
                    mb: 2,
                    animation: `${slideInDown} 1s ease-in-out forwards`,
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
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{
                      animation: `${isArabic ? slideLeft : slideRight} 1.5s ease-in-out`,
                      borderRadius: 0,
                      fontWeight: "bold",
                      "&:hover": {
                        animation: `${buttonHover} 0.3s`,
                      },
                    }}
                    onClick={() => navigate("/booking")}
                  >
                    {isArabic ? 'احجز الان' : 'Book Now'}
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    sx={{
                      animation: `${isArabic ? slideRight : slideLeft} 1.5s ease-in-out`,
                      borderRadius: 0,
                      fontWeight: "bold",
                      "&:hover": {
                        animation: `${buttonHover} 0.3s ease-in-out forwards`,
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
