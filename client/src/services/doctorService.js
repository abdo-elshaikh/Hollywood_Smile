import axiosInstance from "../services/axiosInstance";

const doctorService = {
    fetchDoctors: async () => {
        try {
            const response = await axiosInstance.get('/doctors');
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    createDoctor: async (doctorData) => {
        try {
            const response = await axiosInstance.post('/doctors', doctorData);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    updateDoctor: async (doctorId, doctorData) => {
        try {
            const response = await axiosInstance.put(`/doctors/${doctorId}`, doctorData);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    deleteDoctor: async (doctorId) => {
        try {
            const response = await axiosInstance.delete(`/doctors/${doctorId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    getDoctorById: async (doctorId) => {
        try {
            const response = await axiosInstance.get(`/doctors/${doctorId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    getDoctorBySpeciality: async (speciality) => {
        try {
            const response = await axiosInstance.get(`/doctors/speciality/${speciality}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    addRating: async (doctorId, ratingData) => {
        try {
            const response = await axiosInstance.post(`/doctors/${doctorId}/rating`, ratingData);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
}

export default doctorService