import React, { useState } from "react";
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    ListItemButton,
    useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SidebarItems = ({ item, open, setOpen, handleItemClick, onToggleDrawer }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [subOpen, setSubOpen] = useState(false);

    const handleSubClick = (link) => {
        navigate(link);
    };

    // Item link
    const handleClick = () => {
        if (item.subItems?.length > 0) {
            setSubOpen((prev) => !prev);
            return;
        }
        handleItemClick(item.title);
        navigate(item.link);
    };

    return (
        <>
            <ListItem
                disablePadding
                sx={{
                    display: "block",
                    "&:hover": {
                        backgroundColor: theme.palette.grey[200],
                    },
                }}
            >
                <ListItemButton
                    sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                        backgroundColor: subOpen ? theme.palette.grey[300] : "transparent",
                    }}
                    onClick={handleClick}
                    aria-expanded={subOpen}
                    aria-controls={subOpen ? `sub-list-${item.title}` : undefined}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                        }}
                    >
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.title}
                        sx={{ opacity: open ? 1 : 0 }}
                    />
                    {item.subItems?.length > 0 && open && (
                        subOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />
                    )}
                </ListItemButton>
            </ListItem>
            <Collapse in={subOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding id={`sub-list-${item.title}`}>
                    {item.subItems?.map((subItem, index) => (
                        <ListItem
                            key={index}
                            disablePadding
                            onClick={() => handleSubClick(subItem.link)}
                            sx={{
                                display: "block",
                                paddingLeft: theme.spacing(4),
                                "&:hover": {
                                    backgroundColor: theme.palette.grey[200],
                                },
                            }}
                        >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                    backgroundColor: subItem.isActive ? theme.palette.grey[300] : "transparent",
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    {subItem.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={subItem.title}
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Collapse>
        </>
    );
};


export default SidebarItems;
