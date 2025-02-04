import React, { useState, useEffect } from "react";
import { Box, IconButton, Tooltip, Fade, Stack } from "@mui/material";
import { Facebook, Instagram, Twitter, LinkedIn, Public, Close, YouTube, Telegram } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useClinicContext } from '../../contexts/ClinicContext';


const SocialPopup = () => {
    const [open, setOpen] = useState(false);
    const { clinicInfo } = useClinicContext();
    const socialLinks = clinicInfo?.socialLinks;

    // Array holding the social links data
    const SOCIAL_LINKS = [
        {
            title: "Facebook",
            icon: <Facebook />,
            href: socialLinks?.facebook || "https://facebook.com",
            backgroundColor: "#1877F2",
            hoverColor: "rgba(24, 119, 242, 0.9)",
        },
        {
            title: "Instagram",
            icon: <Instagram />,
            href: socialLinks?.instagram || "https://instagram.com",
            backgroundColor: "#E1306C",
            hoverColor: "rgba(225, 48, 108, 0.9)",
        },
        {
            title: "Twitter",
            icon: <Twitter />,
            href: socialLinks?.twitter || "https://twitter.com",
            backgroundColor: "#1DA1F2",
            hoverColor: "rgba(29, 161, 242, 0.9)",
        },
        {
            title: "LinkedIn",
            icon: <LinkedIn />,
            href: socialLinks?.linkedin || "https://linkedin.com",
            backgroundColor: "#0077B5",
            hoverColor: "rgba(0, 119, 181, 0.9)",
        },
        {
            title: "YouTube",
            icon: <YouTube />,
            href: socialLinks?.youtube || "https://youtube.com",
            backgroundColor: "#FF0000",
            hoverColor: "rgba(255, 0, 0, 0.9)",
        }
    ];

    // Toggle the popup state
    const togglePopup = () => {
        setOpen((prev) => !prev);
    };

    // Automatically close the popup after 7 seconds if it's open
    useEffect(() => {
        if (open) {
            const timeoutId = setTimeout(() => {
                setOpen(false);
            }, 10000);
            return () => clearTimeout(timeoutId);
        }
    }, [open]);

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 100,
                left: 25,
                zIndex: 1000,
            }}
        >
            {/* Social Links Button */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ scale: 1.03, opacity: 0.9 }}
                whileTap={{ scale: 0.9, rotate: 360 }}
            >
                <IconButton
                    onClick={togglePopup}
                    aria-label="Toggle social links popup"
                    sx={{
                        width: 50,
                        height: 50,
                        backgroundColor: 'primary.main',
                        boxShadow: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        color: "white",
                        "&:hover": { backgroundColor: "background.paper", color: "primary.main" },
                    }}
                >
                    {open ? <Close /> : <Telegram />}
                </IconButton>
            </motion.div>

            {/* Social Links Popup */}
            <Fade in={open} timeout={300}>
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 60,
                        right: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderRadius: 2,
                    }}
                >
                    <Stack direction="column" spacing={1}>
                        {SOCIAL_LINKS.map(({ title, icon, href, backgroundColor, hoverColor }, index) => (
                            <Tooltip key={index} title={title} placement="left">
                                <IconButton
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Visit ${title}`}
                                    sx={{
                                        backgroundColor,
                                        color: "white",
                                        "&:hover": { backgroundColor: hoverColor },
                                        width: 50,
                                        height: 50,
                                    }}
                                >
                                    {icon}
                                </IconButton>
                            </Tooltip>
                        ))}
                    </Stack>
                </Box>
            </Fade>
        </Box>
    );
};

export default SocialPopup;
