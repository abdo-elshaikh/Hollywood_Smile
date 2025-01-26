import axiosInstance from './axiosInstance';

const accountSid = 'AC2c54d02b24ac512a798b7e30b709ea5c';
const authToken = '16eb493ba8a9e7cf842e51c2e4582e07';
const twilioNumber = '+18172709178';
const messagingServiceSid = 'MGb5fd0ebf8918bc4bcde67e342492a90e';


const sendTwilioSMS = async (to, body) => {
    try {
        const response = await axiosInstance.post('/sms/send-sms', {
            accountSid,
            authToken,
            messagingServiceSid,
            to,
            body,
        });
        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

export default sendTwilioSMS;