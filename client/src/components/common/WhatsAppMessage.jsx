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

const WhatsAppMessage = ({ phone, text }) => {
    const [phoneNumber, setPhoneNumber] = useState(phone);
    const [message, setMessage] = useState(text);
    const [open, setOpen] = useState(false);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "App f1e6da574a28ebb41bb6f27e3ac7608e-6368e51c-5b5f-448e-81a0-57898db26ad8");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    const raw = JSON.stringify({
        "messages": [
            {
                "from": "447860099299",
                "to": `+2${phoneNumber}`,
                "messageId": "a78afe56-8249-4a65-80cc-cbf35993f105",
                "content": {
                    "type": "template",
                    "template": {
                        "name": "test",
                        "language": {
                            "code": "en"
                        },
                        "components": [
                            {
                                "type": "body",
                                "parameters": [
                                    {
                                        "type": "text",
                                        "text": message
                                    }
                                ]
                            }
                        ]
                    },
                    "language": "en"
                }
            }
        ]
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    // fetch("https://lqmy92.api.infobip.com/whatsapp/1/message/template", requestOptions)
    //     .then((response) => response.text())
    //     .then((result) => console.log(result))
    //     .catch((error) => console.error(error));

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const sendMessage = () => {
        if (!phoneNumber || !message) {
            alert("Please enter both phone number and message!");
            return;
        }

        // WhatsApp URL schema
        // const formattedPhone = phoneNumber.replace(/\D/g, ""); // Remove non-numeric characters
        // const whatsappUrl = `https://wa.me/+2${formattedPhone}?text=${encodeURIComponent(message)}`;
        try {
            fetch("https://lqmy92.api.infobip.com/whatsapp/1/message/template", requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    console.log(result);
                })
                .catch((error) => console.error(error));
        } catch (error) {
            console.error(error);
        }

        // Open WhatsApp
        window.open(whatsappUrl, "_blank");

        // Reset and close dialog
        setPhoneNumber("");
        setMessage("");
        handleClose();
    };

    return (
        <>
            <MenuItem onClick={handleOpen}>
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
