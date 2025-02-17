import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCustomTheme } from "../../contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import doctorService from "../../services/doctorService";

const MeetOurDentists = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { mode: themeMode } = useCustomTheme();
  const [staffMembers, setStaffMembers] = useState([]);
  const isArabic = i18n.language === "ar";

  // Fetch staff members
  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        const doctors = await doctorService.fetchDoctors();
        setStaffMembers(doctors);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStaffMembers();
  }, []);

  return (
    <Box
      component="section"
      id="team"
      sx={{
        py: 8,
        px: { xs: 2, md: 8 },
      }}
    >
      {/* Heading Section */}
      <Box textAlign="center" mb={6}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}
          >
            {t("MeetOurDentists.title")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: themeMode === "light" ? "text.secondary" : "#bbb",
              maxWidth: 600,
              mx: "auto",
              // mb: 4,
            }}
          >
            {t("MeetOurDentists.descriptionText")}
          </Typography>
        </motion.div>
      </Box>

      {/* Staff Members Section */}
      <Grid container spacing={4} justifyContent="center">
        {staffMembers.slice(0, 4).map((member, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card
                sx={{
                  mx: "auto",
                  borderRadius: 3,
                  boxShadow: 4,
                  overflow: "hidden",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.01)",
                    boxShadow: 6,
                    cursor: "pointer",
                  },
                }}
                onClick={() => navigate(`/doctors/${member._id}`)}
              >
                {/* Profile Image */}
                <CardMedia
                  component="div"
                  sx={{
                    height: 300,
                    backgroundImage: `url(${member.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                {/* Information Section */}
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mt: 2 }}>
                    {isArabic ? member.name.ar : member.name.en}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 1 }}
                  >
                    {isArabic ? member.position.ar : member.position.en}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                    {isArabic ? member.description.ar : member.description.en}
                  </Typography>

                  {/* Social Media Links */}
                  <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
                    {member.socialLinks.facebook && (
                      <IconButton
                        component="a"
                        href={member.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          bgcolor: "#4267B2",
                          color: "white",
                          "&:hover": { bgcolor: "#365899" },
                        }}
                      >
                        <Facebook />
                      </IconButton>
                    )}
                    {member.socialLinks.twitter && (
                      <IconButton
                        component="a"
                        href={member.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          bgcolor: "#1DA1F2",
                          color: "white",
                          "&:hover": { bgcolor: "#0a95d0" },
                        }}
                      >
                        <Twitter />
                      </IconButton>
                    )}
                    {member.socialLinks.instagram && (
                      <IconButton
                        component="a"
                        href={member.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          bgcolor: "#E1306C",
                          color: "white",
                          "&:hover": { bgcolor: "#c82d5f" },
                        }}
                      >
                        <Instagram />
                      </IconButton>
                    )}
                    {member.socialLinks.linkedin && (
                      <IconButton
                        component="a"
                        href={member.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          bgcolor: "#0077b5",
                          color: "white",
                          "&:hover": { bgcolor: "#005582" },
                        }}
                      >
                        <LinkedIn />
                      </IconButton>
                    )}
                  </Stack>
                </CardContent>
              </Card>
              <Button
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 2, color: "primary.main" }}
                onClick={() => navigate(`/rate-doctor/${member._id}`)}
              >
                {t("MeetOurDentists.rateDoctor")}
              </Button>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="h6"
          sx={{ color: "text.secondary", mt: 6 }}
          align="center"
        >
          {t("MeetOurDentists.additionalText")}
        </Typography>
      </motion.div>

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
          onClick={() => navigate("/doctors")}
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
        >
          {isArabic ? "عرض المزيد" : "View More"}
        </Button>
      </Box>
    </Box>
  );
};

export default MeetOurDentists;
