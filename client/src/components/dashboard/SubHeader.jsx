import React from "react";
import { Box, TextField, Breadcrumbs, Typography, Link, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import { useCustomTheme } from "../../contexts/ThemeProvider";

const SubHeader = ({ currentPage }) => {
    const { mode } = useCustomTheme();
    const isDarkMode = mode === "dark";

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
                    padding: 2,
                    mb: 2,
                    backgroundColor: 'background',
                    color: 'text.primary',
                    border: "1px solid #ccc",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    width: "100%",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                }}
            >
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" href="/" sx={{ color: isDarkMode ? "#fff" : "#1976d2" }}>
                        Home
                    </Link>
                    <Link underline="hover" href="/dashboard" sx={{ color: isDarkMode ? "#fff" : "#1976d2" }}>
                        Dashboard
                    </Link>
                    <Typography sx={{ fontWeight: "bold", textTransform: "capitalize", color: isDarkMode ? "#fff" : "#000" }}>
                        {currentPage}
                    </Typography>
                </Breadcrumbs>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                        variant="outlined"
                        placeholder="Search..."
                        size="small"
                        sx={{
                            background: isDarkMode ? "#444" : "#eee",
                            borderRadius: "8px",
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
                        }}
                    />
                    <IconButton type="submit" sx={{ marginLeft: 1 }}>
                        <SearchIcon sx={{ color: isDarkMode ? "#f5f5f5" : "#000" }} />
                    </IconButton>
                </Box>
            </Box>
        </motion.div>
    );
};

export default SubHeader;
