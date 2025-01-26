import React, { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Tooltip,
    Typography,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const WhatsAppMessage = ({ phone, text, status }) => {
    const [phoneNumber, setPhoneNumber] = useState(phone);
    const [message, setMessage] = useState(text);
    const [open, setOpen] = useState(false);

   
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const sendMessage = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
        handleClose();
    };

    return (
        <>
            <MenuItem
                onClick={handleOpen}
                disabled={status !== "Confirmed"}
            >
                <ListItemIcon>
                    <WhatsAppIcon />
                </ListItemIcon>
                <ListItemText primary="Send WhatsApp Message" />
            </MenuItem>

            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>Send WhatsApp Message</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Phone Number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number (e.g., +1234567890)"
                    />
                    <TextField
                        label="Message"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error" variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={sendMessage}
                        color="success"
                        variant="contained"
                        startIcon={<WhatsAppIcon />}
                    >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default WhatsAppMessage;
