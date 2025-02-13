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
    useMediaQuery,
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
    FiberManualRecordTwoTone,
    SupportAgent,
    RssFeed,
    Diversity3,
    BurstMode,
    ChangeCircle,
    Grade,
    AutoAwesome,
    Message,
    Notifications,
} from "@mui/icons-material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import SidebarItems from "./SidebarItems";
import { useAuth } from "../../contexts/AuthContext";
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import ConfirmationDialog from "../common/ConfirmationDialog";

const Sidebar = ({ open, sidebarWidth, onToggleDrawer, setCurrentPage, setOpen }) => {
    const { logout } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [expanded, setExpanded] = React.useState({ settings: false });

    const items = [
        { title: "Home", icon: <HomeIcon />, link: "/admin-dashboard" },
        { title: "Users", icon: <PersonIcon />, link: "/admin-dashboard/users" },
        { title: "Clinic Information", icon: <MedicalInformationIcon />, link: "/admin-dashboard/clinic-info" },
        { title: "Online Bookings", icon: <BookOnlineIcon />, link: "/admin-dashboard/online-bookings" },
        { title: "Services", icon: <HandymanIcon />, link: "/admin-dashboard/services" },
        { title: "Doctors", icon: <Diversity3 />, link: "/admin-dashboard/doctors" },
        { title: "Offers", icon: <LocalOfferIcon />, link: "/admin-dashboard/offers" },
        { title: "Gallery", icon: <BurstMode />, link: "/admin-dashboard/gallery" },
        { title: "Befor & After", icon: <ChangeCircle />, link: "/admin-dashboard/before-after" },
        { title: "Testimonials", icon: <Grade />, link: "/admin-dashboard/testimonials" },
        { title: "FAQs", icon: <QuizIcon />, link: "/admin-dashboard/faqs" },
        { title: "Subscriptions", icon: <BookmarkIcon />, link: "/admin-dashboard/subscriptions" },
        { title: "Blog Dashboard", icon: <RssFeed />, link: "/blog-dashboard" },
        { title: "Support Dashboard", icon: <SupportAgent />, link: "/support-dashboard" },
        {
            title: "Settings", icon: <SettingsIcon />, subItems: [
                { title: "Theme Customize", icon: <AutoAwesome />, link: "/admin-dashboard/settings/customization" },
                { title: "Messages", icon: <Message />, link: "/admin-dashboard/messages" },
                { title: "Notifications", icon: <Notifications />, link: "/admin-dashboard/notifications" },
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
        if (isMobile) {
            setOpen(false);
        }
    };

    const toggleExpand = (key) => {
        setExpanded({ ...expanded, [key]: !expanded[key] });
    };

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            security="left"
            sx={{
                width: sidebarWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: sidebarWidth,
                    boxSizing: "border-box",
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    borderRight: `1px solid ${theme.palette.divider}`,
                    transition: theme.transitions.create("width", {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    overflowX: "hidden",
                    "&::-webkit-scrollbar": {
                        width: 8,
                        height: 8,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 8,
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: theme.palette.primary.dark,
                    },
                    "&::-webkit-scrollbar-thumb:active": {
                        backgroundColor: theme.palette.primary.dark,
                    },
                },
            }}
            open={open}
            anchor="left"
        >
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={onToggleDrawer}>
                    {open ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    Dashboard
                </Typography>
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
                                            onToggleDrawer={onToggleDrawer}
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
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
