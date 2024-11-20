// src/components/SendSMS.js
import React, { useState } from "react";
import smsService from "../services/smsService";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

const SendSMS = () => {
    const [recipient, setRecipient] = useState("");
    const [content, setContent] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    const handleSendSMS = async () => {
        if (!recipient || !content) {
            setResponseMessage("Please enter recipient and content.");
            return;
        }

        const data = {
            sender: "Hollywood", 
            recipient: recipient,
            content: content,
            type: "transactional",
            unicodeEnabled: true,
            tag: "Notification",
            webUrl: "http://localhost:3000",
        };

        try {
            const response = await smsService.sendSms(data);
            if (response.status === 201) {
                setResponseMessage("SMS sent successfully!");
                setRecipient("");
                setContent("");
            } else {
                setResponseMessage(response.data.message || "Failed to send SMS. Please try again.");
                alert("Failed to send SMS. Please try again.");
            }
        } catch (error) {
            setResponseMessage(`Error: ${error.response?.data || error.message}`);
            console.error(error);
            alert("Error sending SMS:", error.response?.data || error.message);
        }
    };

    return (
        <Box
            component={Paper}
            sx={{
                maxWidth: 400,
                mx: "auto",
                my: 4,
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
            }}
        >
            <Typography variant="h5" align="center" gutterBottom>
                Send Transactional SMS
            </Typography>

            <TextField
                fullWidth
                variant="outlined"
                label="Recipient Phone Number"
                placeholder="e.g., 1234567890"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                sx={{ mb: 2 }}
            />

            <TextField
                fullWidth
                variant="outlined"
                label="Message Content"
                placeholder="Enter your SMS content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                multiline
                rows={3}
                sx={{ mb: 2 }}
            />

            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSendSMS}
            >
                Send SMS
            </Button>

            {responseMessage && (
                <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    sx={{ mt: 2, textAlign: "center" }}
                >
                    {responseMessage}
                </Typography>
            )}
        </Box>
    );
};

export default SendSMS;
