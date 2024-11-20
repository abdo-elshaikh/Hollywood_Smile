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
    sendLocalSms: async (messageData) => {
        console.log(messageData, 'messageData');
        const { username, password, phone, message, url } = messageData;
        try {
            const response = await axios.post(url, null, {
                params: { username, password, phone, message },
               
            });
            console.log(response, 'success message sent');
            return response;
        } catch (error) {
            console.error(error, 'error sending message');
            return error.response?.data?.message || error.message;
        }
    },
}

export default smsService;
