import axios from 'axios';

const VITE_BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const VITE_BREVO_API = 'https://api.brevo.com/v3/smtp/email';

const mailService = {
    sendEmail: async (data) => {
        try {
            const response = await axios.post(VITE_BREVO_API, data, {
                headers: {
                    'api-key': VITE_BREVO_API_KEY,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            if (response.status === 201) {
                console.log('Email sent successfully:', response.data);
            }
            return response;
        } catch (error) {
            console.error('Error sending email:', error);
            return error;
        }
    },
}

export default mailService;