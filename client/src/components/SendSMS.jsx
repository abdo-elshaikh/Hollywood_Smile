import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
    Tooltip
} from "@mui/material";
import { Message } from "@mui/icons-material";
import smsService from "../services/smsService";

const SendSMS = ({ smsContent, phoneNumber, status }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [messageData, setMessageData] = useState({
        phone: phoneNumber || "",
        message: smsContent || "",
    });

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setResponseMessage("");
        setLoading(false);
        setMessageData({
            phone: phoneNumber || "",
            message: smsContent || "",
        });
    };

    const handleSendSMS = async () => {
        if (!messageData.phone || !messageData.message) {
            setResponseMessage("Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            const data = {
                type: "transactional",
                unicodeEnabled: true,
                sender: "HS Center",
                recipient: `+2${messageData.phone}`,
                content: messageData.message,
            };
            const response = await smsService.sendSms(data);
            if (response.status === 201) {
                setResponseMessage("SMS sent successfully.");
            } else {
                setResponseMessage("Failed to send Brevo Sms.");
            }
        } catch (error) {
            console.error("Error sending SMS:", error);
            setResponseMessage("An error occurred while sending SMS.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMessageData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <>
            <MenuItem onClick={handleOpen} disabled={status !== "Confirmed"}>
                <Tooltip title="Send SMS">
                    <ListItemIcon>
                        <Message />
                    </ListItemIcon>
                </Tooltip>
                <ListItemText primary="Send SMS" />
            </MenuItem>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Send SMS</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the phone number and message to send SMS to the customer.
                    </DialogContentText>

                    <TextField
                        label="Phone Number"
                        name="phone"
                        value={messageData.phone}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        size="small"
                        variant="outlined"
                    />
                    <TextField
                        label="Message"
                        name="message"
                        value={messageData.message}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        variant="outlined"
                    />

                    {responseMessage && (
                        <Typography
                            color={responseMessage.includes("successfully") ? "success.main" : "error.main"}
                            variant="body2"
                            mt={2}
                        >
                            {responseMessage}
                        </Typography>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="secondary" disabled={loading}>
                        Close
                    </Button>
                    <Button
                        onClick={handleSendSMS}
                        color="primary"
                        startIcon={loading && <CircularProgress size={20} />}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SendSMS;
