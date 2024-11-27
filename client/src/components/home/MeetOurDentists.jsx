import React, { useState, useEffect, useMemo } from "react";
import { Box, Grid, Typography, Card, CardContent, CardMedia, Avatar, Stack, Button, Link } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
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

  const fetchStaffMembers = async () => {
    try {
      const doctors = await doctorService.fetchDoctors();
      setStaffMembers(doctors);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  return (
    <Box component="section" id="team" sx={{ py: 5, px: { xs: 2, md: 8 }, position: "relative" }}>
      {/* Heading Section */}
      <Box textAlign="center" mb={5}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {t("MeetOurDentists.title")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: themeMode === "light" ? "text.secondary" : "#bbb",
              maxWidth: 600,
              margin: "auto",
              mt: 1,
            }}
          >
            {t("MeetOurDentists.descriptionText")}
          </Typography>
        </motion.div>
      </Box>

      {/* Staff Members Section */}
      <Grid container spacing={3} justifyContent="center">
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
                  maxWidth: 350,
                  mx: "auto",
                  borderRadius: 2,
                  boxShadow: 3,
                  color: 'text.primary',
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
              >
                {/* Profile Image */}
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    backgroundSize: "cover",
                    backgroundImage: `url(${member.imageUrl})`,
                    backgroundPosition: "center",
                  }}
                />

                {/* Information Section */}
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mt: 2 }}>
                    {isArabic ? member.name.ar : member.name.en}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                    {isArabic ? member.position.ar : member.position.en}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {isArabic ? member.description.ar : member.description.en}
                  </Typography>

                  {/* Social Media Links */}
                  <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
                    <Avatar sx={{ bgcolor: themeMode === "light" ? "#3b5998" : "#4267B2" }}>
                      <Link to={member.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                        <Facebook sx={{ color: "#fff" }} />
                      </Link>
                    </Avatar>
                    <Avatar sx={{ bgcolor: themeMode === "light" ? "#00acee" : "#1DA1F2" }}>
                      <Link to={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter sx={{ color: "#fff" }} />
                      </Link>
                    </Avatar>
                    <Avatar sx={{ bgcolor: themeMode === "light" ? "#dd4b39" : "#DB4437" }}>
                      <Link to={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram sx={{ color: "#fff" }} />
                      </Link>
                    </Avatar>
                    <Avatar sx={{ bgcolor: themeMode === "light" ? "#0077b5" : "#0A66C2" }}>
                      <Link to={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <LinkedIn sx={{ color: "#fff" }} />
                      </Link>
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Additional Text Section */}
      <Box textAlign="center" mt={8}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          <Typography variant="h5" sx={{ color: themeMode === "light" ? "text.secondary" : "#bbb", maxWidth: 800, margin: "auto" }}>
            {t("MeetOurDentists.additionalText")}
          </Typography>
        </motion.div>
      </Box>

      {/* view more */}
      <Box textAlign="center" sx={{ mt: 6 }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          <Button variant="contained" color="primary" onClick={() => navigate("/doctors")}>
            {t("MeetOurDentists.viewMore")}
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
};

export default MeetOurDentists;
