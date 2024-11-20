// src/components/SendSMS.js
import React, { useState, useEffect } from "react";
import smsService from "../services/smsService";
import {
    Box, TextField, Button, Typography, Paper, Tooltip, Container,
    IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { Message } from "@mui/icons-material";

const SendSMS = ({ smsContent, phoneNumber }) => {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [messageData, setMessageData] = useState({
        url: "http://192.168.1.30:8080/SendSMS",
        username: "abdo",
        password: "1234",
        phone: phoneNumber || '',
        message: smsContent || "",
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

    const handleSendSMS = async () => {
        setLoading(true);
        try {
            const response = await smsService.sendLocalSms(messageData);
            setResponseMessage(response.data.message);
        } catch (error) {
            setResponseMessage(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMessageData({
            ...messageData,
            [name]: value,
        });
    }

    return (
        <>
            <Tooltip title="Send SMS">
                <IconButton onClick={handleOpen}>
                    <Message />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Send SMS</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Send SMS to the customer, Enter phone number and message.
                    </DialogContentText>
                    <Typography variant="body1" component="p">
                        {messageData.url} ? {messageData.username} :{messageData.password}
                    </Typography>
                    <TextField
                        label="Phone"
                        name="phone"
                        value={messageData.phone}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
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
