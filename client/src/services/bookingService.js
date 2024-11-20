import axiosInstance from './axiosInstance';

// Define the booking service functions
const bookingService = {
    // Create a new booking
    createBooking: async (bookingData) => {
        try {
            const response = await axiosInstance.post('/bookings', bookingData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get all bookings
    getAllBookings: async () => {
        try {
            const response = await axiosInstance.get('/bookings');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get a booking by ID
    getBookingById: async (id) => {
        try {
            const response = await axiosInstance.get(`/bookings/${id}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Update a booking
    updateBooking: async (id, bookingData) => {
        try {
            const response = await axiosInstance.put(`/bookings/${id}`, bookingData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Delete a booking
    deleteBooking: async (id) => {
        try {
            const response = await axiosInstance.delete(`/bookings/${id}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },
    getBookingsByClient: async (clientId) => {
        try {
            const response = await axiosInstance.get(`/bookings/client/${clientId}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    }
};

export default bookingService;
