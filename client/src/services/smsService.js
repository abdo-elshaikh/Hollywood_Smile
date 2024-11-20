import axios from 'axios';

const apiKey = import.meta.env.VITE_BREVO_API_KEY;
const baseUrl = 'https://api.brevo.com/v3/transactionalSMS/sms';

const smsService = {
    sendSms: async (data) => {
        try {
            const response = await axios.post(baseUrl, data, {
                headers: {
                    'api-key': apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            return response;
        } catch (error) {
            return error.response.data.message || error.message;
        }
    },
}

export default smsService;