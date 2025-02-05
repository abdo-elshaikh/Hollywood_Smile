import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Button, Tooltip, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useCustomTheme } from "../../contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import galleryService from "../../services/galleryService";

const GallerySection = () => {
  const { mode: themeMode } = useCustomTheme();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const data = await galleryService.getGallery();
        const sortedData = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        setGalleryItems(sortedData);
      } catch (error) {
        console.error("Error fetching gallery items:", error);
      }
    };
    fetchGalleryItems();
  }, []);

  const galleryItemVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    whileHover: { scale: 1.08 },
  };

  return (
    <Box
      component="section"
      sx={{
        py: 8,
        px: 2,
        bgcolor: themeMode === "dark" ? "#121212" : "#f5f5f5",
      }}
    >
      <Typography
        variant="h3"
        align="center"
        sx={{
          mb: 4,
          fontWeight: "bold",
          fontFamily: "'Cairo', sans-serif",
          color: themeMode === "dark" ? "text.primary" : "text.secondary",
        }}
      >
        {isRTL ? "معرض الصور" : "Our Gallery"}
      </Typography>

      <Grid container spacing={0}>
        {galleryItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
            <motion.div
              variants={galleryItemVariants}
              initial="initial"
              animate="animate"
              whileHover="whileHover"
              style={{ width: "100%" }}
            >
              <Box
                sx={{
                  height: 350,
                  border: "1px solid",
                  borderColor: "divider",
                  overflow: "hidden",
                  position: "relative",
                  backgroundImage: `url(${item.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { transform: "translateY(-10px)", boxShadow: "0 6px 30px rgba(0, 0, 0, 0.15)" },
                }}
                onClick={() => navigate(`/gallery/${item._id}`)}
              >
                {/* Hover overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    opacity: 0,
                    transition: "opacity 0.4s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  {/* Rotating Search Icon */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <Tooltip title={isRTL ? "عرض التفاصيل" : "View Details"} arrow>
                      <SearchIcon sx={{ color: "white", fontSize: 32 }} />
                    </Tooltip>
                  </motion.div>
                  <Typography variant="h5" sx={{ color: "white", fontWeight: "bold", mt: 2 }}>
                    {isRTL ? "عرض التفاصيل" : "View Details"}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 6,
        }}
      >
        <Button
          variant="contained"
          onClick={() => navigate("/gallery")}
          sx={{
            px: 5,
            py: 1.5,
            fontSize: "1.2rem",
            fontWeight: "bold",
            textTransform: "uppercase",
            borderRadius: "30px",
            background: "linear-gradient(90deg, #2196F3, #21CBF3)",
            "&:hover": {
              background: "linear-gradient(90deg, #21CBF3, #2196F3)",
            },
          }}
        >
          {isRTL ? "عرض المزيد" : "View More"}
        </Button>
      </Box>
    </Box>
  );
};

export default GallerySection;
