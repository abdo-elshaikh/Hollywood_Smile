// src/components/SendEmail.js
import React, { useState } from "react";
import mailService from "../services/mailService";
import { Box, TextField, Button, Typography, Paper, CircularProgress } from "@mui/material";

const SendEmail = () => {
    const [toEmail, setToEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const htmlContentTemplate = () => {
        return `
        < html >
            <body>
                <h1>${subject}</h1>
                <h5>Welcome to Hollywood Smile Center</h5>
                <p>${content}</p>
            </body>
        </html >
        `;
    }

    const handleSendEmail = async () => {
        if (!toEmail || !subject || !content) {
            setResponseMessage("Please enter recipient, subject, and content.");
            return;
        }
        if (!isValidEmail(toEmail)) {
            setResponseMessage("Please enter a valid email address.");
            return;
        }

        const emailData = {
            sender: { email: "hollywood_smile_center@hotmail.com", name: "Hollywood Smile Center" },
            to: [{ email: toEmail, name: toEmail.split("@")[0] }],
            subject: subject,
            htmlContent: htmlContentTemplate(),
        };

        setLoading(true);
        try {
            const response = await mailService.sendEmail(emailData);
            if (response.status === 201) {
                setResponseMessage("Email sent successfully!");
                setToEmail("");
                setSubject("");
                setContent("");
            } else {
                setResponseMessage("Failed to send email. Please try again.");
            }
        } catch (error) {
            setResponseMessage(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component={Paper}
            sx={{
                maxWidth: 500,
                mx: "auto",
                my: 4,
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
            }}
        >
            <Typography variant="h5" align="center" gutterBottom>
                Send Email
            </Typography>

            <TextField
                fullWidth
                variant="outlined"
                label="Recipient's Email"
                placeholder="recipient@example.com"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                error={toEmail && !isValidEmail(toEmail)}
                helperText={toEmail && !isValidEmail(toEmail) ? "Enter a valid email" : ""}
                sx={{ mb: 2 }}
            />

            <TextField
                fullWidth
                variant="outlined"
                label="Subject"
                placeholder="Enter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                sx={{ mb: 2 }}
            />

            <TextField
                fullWidth
                variant="outlined"
                label="Email Content"
                placeholder="Enter your email content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                multiline
                rows={4}
                sx={{ mb: 2 }}
            />

            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSendEmail}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
            >
                {loading ? "Sending..." : "Send Email"}
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

export default SendEmail;
