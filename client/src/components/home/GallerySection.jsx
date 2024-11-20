import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Link } from "@mui/material";
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
    <Box component="section" sx={{ py: 4, bgcolor: themeMode === "dark" ? "background.default" : "background.light" }}>
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
                    📸
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      {/* view more */}
      <Box textAlign="center" sx={{ mt: 6 }}>
        <Link onClick={() => navigate('/gallery')} sx={{ color: "primary.main", fontSize: 18 }}>
          {t("MeetOurDentists.viewMore")}
        </Link>
      </Box>
    </Box>
  );
};

export default GallerySection;
