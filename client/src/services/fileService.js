import axiosInstance from "./axiosInstance";

const fileService = {
    uploadFile: async (file, directoryPath) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await axiosInstance.post(`/files/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                params: {
                    directoryPath,
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Failed to upload file");
        }
    },

    uploadMultipleFiles: async (formData) => {
        try {
            const response = await axiosInstance.post(`/files/upload-multiple`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Failed to upload files");
        }
    },

    getFilesInDirectory: async (directoryPath) => {
        try {
            const response = await axiosInstance.get('/files', { params: { directoryPath } });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to fetch files");
        }
    },

    deleteFile: async (directoryPath, itemName) => {
        try {
            const response = await axiosInstance.delete(`/files/delete`, {
                params: { directoryPath, itemName }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Failed to delete file");
        }
    },

    createItem: async (data) => {
        try {
            const response = await axiosInstance.post(`/files/create`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Failed to create item");
        }
    },

    getAllFiles: async () => {
        try {
            const response = await axiosInstance.get(`/files/all-files`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to fetch all files");
        }
    },

    getRootFolderAndFiles: async () => {
        try {
            const response = await axiosInstance.get(`/files/root`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to fetch root folder and files");
        }
    },

    copyFile: async (source, destination) => {
        try {
            const response = await axiosInstance.post(`/files/copy`, { source, destination });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Failed to copy file");
        }
    },

    moveFile: async (source, destination) => {
        try {
            const response = await axiosInstance.post(`/files/move`, { source, destination });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Failed to move file");
        }
    },

    renameFile: async (currentPath, oldName, newName) => {
        try {
            const response = await axiosInstance.post(`/files/rename`, { currentPath, oldName, newName });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Failed to rename file");
        }
    },
};

export default fileService;
