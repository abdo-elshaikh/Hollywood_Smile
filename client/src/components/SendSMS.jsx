// src/components/SendSMS.js
import React, { useState, useEffect } from "react";
import {
    Box, TextField, Button, Typography,
    Paper, Tooltip, Container, MenuItem,
    ListItemIcon, ListItemText, IconButton,
    CircularProgress, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions
} from "@mui/material";

import { Message, Visibility, VisibilityOff } from "@mui/icons-material";
import axiosInstance from "../services/axiosInstance";

const SendSMS = ({ smsContent, phoneNumber, status }) => {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [messageData, setMessageData] = useState({
        url: "http://192.168.1.30:8080/SendSMS",
        username: "admin",
        password: "admin",
        phone: phoneNumber,
        message: smsContent,
    });

    useEffect(() => {
        setMessageData({
            ...messageData,
            phone: phoneNumber,
            message: smsContent,
        });
    }, [smsContent, phoneNumber]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setResponseMessage("");
        setLoading(false);
        setMessageData({
            ...messageData,
            phone: "",
            message: "",
        });
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSendSMS = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/sms/send-sms', messageData);
            if (response.status === 200) {
                setResponseMessage(response.data.message);
            }
        } catch (error) {
            console.error(error);
            setResponseMessage("Failed to send SMS");
        }
    }



    const handleChange = (e) => {
        const { name, value } = e.target;
        setMessageData({
            ...messageData,
            [name]: value,
        });
    }

    return (
        <>
            <MenuItem
                onClick={handleOpen}
                disabled={status !== "Confirmed"}
            >
                <ListItemIcon>
                    <Message />
                </ListItemIcon>
                <ListItemText primary="Send SMS" />
            </MenuItem>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Send SMS</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Send SMS to the customer, Enter phone number and message.
                    </DialogContentText>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        bgcolor="background.default"
                        borderBottom='1px solid'
                        borderBottomColor="divider"
                        p={1}
                        gap={2}
                        mb={2}
                    >
                        <TextField
                            label="URL"
                            name="url"
                            value={messageData.url}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            size="small"
                        />
                        <TextField
                            label="Username"
                            name="username"
                            value={messageData.username}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            size="small"
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={messageData.password}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <Tooltip title={showPassword ? "Hide Password" : "Show Password"}>
                                        <IconButton onClick={handleShowPassword}>
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </Tooltip>
                                ),
                            }}
                        />
                    </Box>
                    <TextField
                        label="Phone"
                        name="phone"
                        value={messageData.phone}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        size="small"
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
                    />

                    {responseMessage && (
                        <Box mt={2}>
                            <Typography color="success" variant="body1" component="p">
                                {responseMessage}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {loading ? "Cancel" : "Close"}
                    </Button>
                    <Button onClick={handleSendSMS} color="primary">
                        {loading ? "Sending..." : "Send"}
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
};

export default SendSMS;
