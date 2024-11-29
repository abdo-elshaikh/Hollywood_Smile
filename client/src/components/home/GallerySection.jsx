import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Link, Button, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import { useCustomTheme } from "../../contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import galleryService from "../../services/galleryService";

// Gallery Section Component
const GallerySection = () => {
  const { mode: themeMode } = useCustomTheme();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const navigate = useNavigate()
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const data = await galleryService.getGallery();
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
        setGalleryItems(sortedData);
      } catch (error) {
        console.error("Error fetching gallery items:", error);
      }
    };
    fetchGalleryItems();
  }, []);

  // Animation variants for gallery items
  const galleryItemVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
    whileHover: { scale: 1.05 },
  };

  return (
    <Box component="section" sx={{ bgcolor: themeMode === "dark" ? "background.default" : "background.light" }}>
      <Grid container spacing={0}>
        {galleryItems.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item._id}>
            <motion.div
              variants={galleryItemVariants}
              initial="initial"
              animate="animate"
              whileHover="whileHover"
              style={{ width: "100%" }}
            >
              {/* Gallery Image Container */}
              <Box
                sx={{
                  height: 400,
                  borderRadius: 0,
                  position: "relative",
                  cursor: "pointer",
                  backgroundImage: `url(${item.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  overflow: "hidden",
                }}
                onClick={() => navigate(`/gallery/${item._id}`)}
              >
                {/* Hover Overlay with Rotate Icon */}
                <Box
                  component={motion.div}
                  whileHover={{ scale: 1.2 }}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    opacity: 0,
                    transition: "opacity 0.4s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  {/* Rotating Background with Search Icon */}
                  <Box
                    component={motion.div}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <Tooltip title={isRTL ? "عرض التفاصيل" : "View Details"} arrow>
                      <SearchIcon sx={{ color: "white", fontSize: 40 }} />
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      {/* view more */}
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
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "uppercase",
            borderRadius: 50,
            background: "linear-gradient(90deg, #2196F3, #21CBF3)",
            "&:hover": {
              background: "linear-gradient(90deg, #21CBF3, #2196F3)",
            },
          }}
          endIcon={<SearchIcon sx={{ mx: 2 }} />}
        >
          {isRTL ? "عرض المزيد" : "View More"}
        </Button>
      </Box>

    </Box>
  );
};

export default GallerySection;
