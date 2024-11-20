import React from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Tooltip,
    Badge,
    Box,
    useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MessageIcon from "@mui/icons-material/Message";
import ThemeToggleButton from "../common/ThemeToggleButton";
import MessagePopupMenu from "../common/MessagePopupMenu";
import NotificationPopupMenu from "../common/NotificationPopupMenu";
import SettingsMenu from "../common/SettingsMenu";
import { useAuth } from "../../contexts/AuthContext";

const Header = ({ onToggleDrawer, sidebarWidth }) => {
    const { user } = useAuth();
    const theme = useTheme();


    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                width: { xs: "100%", md: `calc(100% - ${sidebarWidth}px)` },
                transition: theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                boxShadow: "none",
                borderBottom: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={onToggleDrawer}
                    sx={{ display: { xs: "block", md: "none" } }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="body1"
                    sx={{
                        flexGrow: 1,
                        textAlign: { xs: "center", md: "left" },
                        fontWeight: "bold",
                    }}
                >
                    Welcome back, {user?.name || "Guest"}!
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* <ThemeToggleButton /> */}
                    <NotificationPopupMenu />
                    <MessagePopupMenu />
                    <SettingsMenu />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
