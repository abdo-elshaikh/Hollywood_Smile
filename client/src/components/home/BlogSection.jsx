import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,

} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCustomTheme } from "../../contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import ChatIcon from "@mui/icons-material/Chat";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShareIcon from "@mui/icons-material/Share";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axiosInstance from "../../services/axiosInstance";


// Blog Section Component
const BlogSection = () => {
  const { mode } = useCustomTheme();
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const [blogs, setBlogs] = React.useState([]);

  // Fetch blogs from the server
  const fetchBlogs = async () => {
    try {
      const res = await axiosInstance.get("/blogs");

      const latestBlogs = res.data.filter((blog) => blog.published).sort((a, b) => new Date(b.date) - new Date(a.date));
      const mostLikesAndLoves = await latestBlogs.sort((a, b) => (b.likes + b.loves + b.views) - (a.likes + a.loves + a.views)).slice(0, 3);
      setBlogs(mostLikesAndLoves);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);


  // Animation variants for Blog Cards
  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    whileHover: { scale: 1.05, boxShadow: "0px 15px 30px rgba(0,0,0,0.2)" },
  };

  return (
    <Box
      component="section"
      sx={{
        py: 8,
        bgcolor: mode === "dark" ? "background.default" : "background.light",
      }}
    >
      <Container>
        {/* Section Header */}
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{ mb: 2, fontWeight: "bold", color: "primary.main", fontSize: 50 }}
          >
            {t("BlogSection.title")}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {t("BlogSection.description")}
          </Typography>
        </Box>

        {/* Blog Grid */}
        <BlogContent blogs={blogs} />
        {/* reade more */}
        <Box textAlign="center" sx={{ mt: 6 }}>
          <Typography 
          variant="h6" 
          component={Link}
          to="/blog"
          sx={{ fontWeight: "bold", color: "primary.main" }}>
            {t("BlogSection.readMore")} ...
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

const BlogContent = ({ blogs }) => (
  <Grid container spacing={4}>
    {blogs.map((blog) => (
      <Grid item xs={12} sm={6} md={4} key={blog._id}>
        <motion.div
          variants={{
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            whileHover: { scale: 1.05, boxShadow: "0px 15px 30px rgba(0,0,0,0.2)" },
          }}
          initial="initial"
          animate="animate"
          whileHover="whileHover"
          style={{ height: "100%" }}
        >
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            {/* Blog Image */}
            <CardMedia
              component="div"
              image={blog.imageUrl}
              sx={{
                height: 250,
                backgroundSize: "cover",
                position: "relative",
                "&:hover .overlay": { opacity: 1, transform: "translateY(0)" },
              }}
            >
              {/* Image Hover Overlay */}
              <Box
                className="overlay"
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.5s ease-in-out",
                  transform: "translateY(100%)",
                  opacity: 0,
                }}
              >
                <Typography id='blog-link' component={Link} to={`/blog/post/${blog._id}`} variant="h5" sx={{ color: "white" }} />
                <ArrowForwardIosIcon
                  fontSize="large"
                  onClick={() => document.getElementById('blog-link').click()}
                  sx={{
                    fontSize: 40,
                    color: "white",
                    bgcolor: "primary.main",
                    p: 1,
                    borderRadius: "50%",
                    cursor: "pointer",
                    transform: "rotate(0deg)",
                    transition: "all 0.5s ease-in-out",
                    "&:hover": { transform: "rotate(360deg)", bgcolor: "secondary.main" },
                  }}
                />

              </Box>
            </CardMedia>

            {/* Blog Text Content */}
            <CardContent sx={{ p: 3, flexGrow: 1 }}>
              {/* Metadata */}
              <Box sx={{ display: "flex", mb: 1, gap: 1, color: "text.secondary" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AccessTimeIcon fontSize="small" sx={{ color: "text.secondary" }} />
                  <Typography variant="body2">{blog.date.slice(0, 10)}</Typography>
                </Box>
                <Typography variant="body2">|</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <PersonIcon fontSize="small" sx={{ color: "text.secondary" }} />
                  <Typography variant="body2">{blog.author?.name}</Typography>
                </Box>
                <Typography variant="body2">|</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <ThumbUpIcon fontSize="small" sx={{ color: "text.secondary" }} />
                  <Typography variant="body2">{blog.likes}</Typography>
                </Box>
              </Box>
              {/* Blog Title */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                  "& a": {
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "secondary.main" },
                  },
                }}
              >
                <Link to={`/blog/post/${blog._id}`}>{blog.title}</Link>
              </Typography>
              {/* Blog Description */}
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                {blog.content.slice(0, 100)}...
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Grid>
    ))}
  </Grid>
);

export default BlogSection;
