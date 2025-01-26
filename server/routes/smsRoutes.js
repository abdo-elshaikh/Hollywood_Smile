const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Send Twilio SMS
router.post('/send-sms', async (req, res) => {
    const { accountSid, authToken, messagingServiceSid, to, body } = req.body;
    try {
        const client = twilio(accountSid, authToken);
        const message = await client.messages.create({
            body,
            messagingServiceSid,
            to: `+2${to}`,
        });
        console.log(`Message sent: ${message.sid}`);
        return res.status(200).json({ message: 'SMS sent successfully', message });
    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).json({ message: 'Failed to send SMS' });
    }
});

// Send WhatsApp message
router.post('/send-whatsapp', async (req, res) => {
    const { from, contentSid, contentVariables, to, accountSid, authToken } = req.body;

    try {
        const client = twilio(accountSid, authToken);
        const message = await client.messages.create({
            from: `whatsapp:${from}`,
            body: contentSid,
            to: `whatsapp:${to}`,
            mediaUrl: contentVariables,
        });
        console.log(`Message sent: ${message.sid}`);
        return res.status(200).json({ message: 'WhatsApp message sent successfully', message });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        res.status(500).json({ message: 'Failed to send WhatsApp message' });
    }
});

// router.post('/send-sms', async (req, res) => {
//     const { username, password, phone, message, url } = req.body;
//     try {
//         const response = await fetch(`${url}?username=${username}&password=${password}&phone=${phone}&message=${message}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (!response.status === 200) {
//             res.status(400).json({ message: 'Failed to send SMS' });
//         }
//         const data = JSON.parse(response.body);
//         console.log("response data: ", data);
//         return res.status(200).json({ message: 'SMS sent successfully', data });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to send SMS' });
//     }
// });

// get sms
router.post('/receive-sms', async (req, res) => {
    const { username, password, url } = req.body;
    try {
        const response = await fetch(`${url}?username=${username}&password=${password}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            res.status(400).json({ message: 'Failed to get SMS' });
        }
        const responseData = response.json();
        res.status(200).json({ message: 'SMS received successfully', responseData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get SMS' });
    }
});

module.exports = router;