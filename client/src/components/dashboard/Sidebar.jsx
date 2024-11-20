import React from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    Toolbar,
    Typography,
    Collapse,
    Box,
    useTheme,
} from "@mui/material";
import {
    Home as HomeIcon,
    Info as InfoIcon,
    Settings as SettingsIcon,
    LocalOffer as LocalOfferIcon,
    BookOnline as BookOnlineIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    DriveFileMove as DriveFileMoveIcon,
    Medication as MedicationIcon,
    MedicalInformation as MedicalInformationIcon,
    Handyman as HandymanIcon,
    Speed as SpeedIcon,
    Logout as LogoutIcon,
    Quiz as QuizIcon,
    Bookmark as BookmarkIcon,
    Person as PersonIcon,
    MedicationSharp as MedicationSharpIcon,

} from "@mui/icons-material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import SidebarItems from "./SidebarItems";
import { useAuth } from "../../contexts/AuthContext";
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';

const Sidebar = ({ open, sidebarWidth, onToggleDrawer, setCurrentPage }) => {
    const { user, logout } = useAuth();
    const theme = useTheme();
    const [expanded, setExpanded] = React.useState({ settings: false });

    const items = [
        { title: "Home", icon: <HomeIcon />, link: "/dashboard" },
        { title: "Users", icon: <PersonIcon />, link: "/dashboard/users" },
        { title: "Online Bookings", icon: <BookOnlineIcon />, link: "/dashboard/online-bookings" },
        { title: "Services", icon: <HandymanIcon />, link: "/dashboard/services" },
        { title: "Doctors", icon: <MedicationIcon />, link: "/dashboard/doctors" },
        { title: "Manage Offers", icon: <LocalOfferIcon />, link: "/dashboard/offers" },
        { title: "Clinic Information", icon: <MedicalInformationIcon />, link: "/dashboard/clinic-info" },
        { title: "Gallery", icon: <MedicationSharpIcon />, link: "/dashboard/gallery" },
        { title: "Befor & After", icon: <TransferWithinAStationIcon />, link: "/dashboard/before-after" },
        { title: "Testimonials", icon: <SpeedIcon />, link: "/dashboard/testimonials" },
        { title: "Subscriptions", icon: <BookmarkIcon />, link: "/dashboard/subscriptions" },
        { title: "FAQs", icon: <QuizIcon />, link: "/dashboard/faqs" },
        { title: "Blogs", icon: <InfoIcon />, link: "/blog-dashboard" },
        {
            title: "Settings", icon: <SettingsIcon />, subItems: [
                { title: "Theme", icon: <LightModeIcon />, link: "/dashboard/settings/theme" },
                { title: "Customs", icon: <DarkModeIcon />, link: "/dashboard/settings/customization" },
                { title: "Manage Files", icon: <DriveFileMoveIcon />, link: "/dashboard/files" },
            ]
        },
    ];

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            logout();
        }
    };

    const handleItemClick = (link) => {
        setCurrentPage(link);
    };

    const toggleExpand = (key) => {
        setExpanded({ ...expanded, [key]: !expanded[key] });
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: sidebarWidth,
                transition: theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: sidebarWidth,
                    boxSizing: "border-box",
                    backgroundColor: "background.default",
                    transition: "width 0.3s ease",
                    overflowX: "hidden",
                },
            }}
            open={open}
            anchor="left"
        >
            <Toolbar>
                <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: "bold", display: open ? "block" : "none" }}>
                    Admin Dashboard
                </Typography>
                <IconButton edge="start" color="inherit" onClick={onToggleDrawer}>
                    {open ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
            </Toolbar>
            <Divider />
            <List>
                {items.map((item, index) => (
                    item.subItems ? (
                        <Box key={index}>
                            <ListItem button='true' onClick={() => toggleExpand(item.title)}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                {open && <ListItemText sx={{ transition: "color 0.3s ease" }} primary={item.title} />}
                                {open && (expanded[item.title] ? <ExpandLess /> : <ExpandMore />)}
                            </ListItem>
                            <Collapse in={expanded[item.title]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.subItems.map((subItem, subIndex) => (
                                        <SidebarItems
                                            key={subIndex}
                                            item={subItem}
                                            open={open}
                                            handleItemClick={handleItemClick}
                                            nested
                                        />
                                    ))}
                                </List>
                            </Collapse>
                        </Box>
                    ) : (
                        <SidebarItems
                            key={index}
                            item={item}
                            open={open}
                            handleItemClick={handleItemClick}
                        />
                    )
                ))}
                <Divider sx={{ marginTop: "auto", color: "#f07167" }} />

            </List>
        </Drawer>
    );
};

export default Sidebar;
