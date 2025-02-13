import React from "react";
import { Box, TextField, Breadcrumbs, Typography, Link, IconButton, Grid, useMediaQuery, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import { useCustomTheme } from "../../contexts/ThemeProvider";

const SubHeader = ({ currentPage }) => {
    const { mode } = useCustomTheme();
    const theme = useTheme();
    const isDarkMode = mode === "dark";
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 3,
                    mb: 2,
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    border: isDarkMode ? "1px solid #333" : "1px solid #ccc",
                    borderRadius: "16px",
                    boxShadow: isDarkMode ? "0px 4px 20px rgba(0, 0, 0, 0.3)" : "0px 2px 10px rgba(0, 0, 0, 0.1)",
                    width: "100%",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    flexDirection: isSmallScreen ? "column" : "row",
                    gap: isSmallScreen ? 2 : 0,
                }}
            >
                {/* Breadcrumb Section */}
                <Box sx={{ flex: 1, overflow: "hidden" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            href="/"
                            sx={{
                                color: isDarkMode ? "#fff" : "#1976d2",
                                fontWeight: 500,
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            Home
                        </Link>
                        <Link
                            underline="hover"
                            href="/admin-dashboard"
                            sx={{
                                color: isDarkMode ? "#fff" : "#1976d2",
                                fontWeight: 500,
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            Dashboard
                        </Link>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                textTransform: "capitalize",
                                color: isDarkMode ? "#fff" : "#000",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {currentPage}
                        </Typography>
                    </Breadcrumbs>
                </Box>

                {/* Search Section */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: isSmallScreen ? 2 : 0 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Search..."
                        size="small"
                        sx={{
                            background: isDarkMode ? "#444" : "#f4f4f4",
                            borderRadius: "12px",
                            width: isSmallScreen ? "100%" : "auto",
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "transparent",
                                },
                                "&:hover fieldset": {
                                    borderColor: "transparent",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "transparent",
                                },
                            },
                            "& .MuiInputBase-input": {
                                padding: "8px 16px",
                            },
                        }}
                    />
                    <IconButton type="submit" sx={{ padding: 1, background: isDarkMode ? "#444" : "#f0f0f0", borderRadius: "50%" }}>
                        <SearchIcon sx={{ color: isDarkMode ? "#f5f5f5" : "#000" }} />
                    </IconButton>
                </Box>
            </Box>
        </motion.div>
    );
};

export default SubHeader;
