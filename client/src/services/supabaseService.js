import axiosInstance from './axiosInstance';

const uploadFile = async (file, directory) => {
    try {
        if (!file || !directory) {
            throw new Error('File and directory are required.');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('directory', directory);

        const response = await axiosInstance.post('/supabase/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            // timeout: 60000,
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log('Upload progress:', percentCompleted);
            },
        });

        console.log('File uploaded:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 413) {
                console.error('File size exceeds the limit of 50 MB');
            } else {
                toast.error(data?.error || 'Unknown error');
            }
        } else {
            console.error('Error uploading file:', error.message);
        }
        throw error;
    }
};

const uploadLargeFile = async (file, directory) => {
    try {
        if (!file || !directory) {
            throw new Error('File and directory are required.');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('directory', directory);

        const response = await axiosInstance.post('/supabase/upload-large', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 120000, // 2 minutes
        });

        console.log('File uploaded:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 413) {
                console.error('File size exceeds the limit of 50 MB');
            } else {
                console.error(data?.error || 'Unknown error');
            }
        } else {
            console.error('Error uploading file:', error.message);
        }
        throw error;
    }
}

// delete file from Supabase storage
const deleteFile = async (filePath) => {
    try {
        const response = await axiosInstance.delete(`/supabase/delete/${filePath}`);
        console.log('File deleted:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting file:', error.message);
        throw error;
    }
};

export { uploadFile, uploadLargeFile, deleteFile };
