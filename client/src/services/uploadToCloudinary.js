import axiosInstance from './axiosInstance';

const uploadToCloudinary = async (file) => {
    if (!file) {
        console.error('No file provided.');
        return null; // Return early if no file is provided
    }
    console.log('Uploading file to Cloudinary:', file);
    
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post('/cloudinary/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data && response.data.url) {
            console.log('File uploaded successfully:', response.data.url);
            return response.data.url; // Return the URL from Cloudinary response
        } else {
            console.error('Cloudinary upload failed, no URL found in response.');
            return null;
        }
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return null; // Return null in case of error
    }
}

export default uploadToCloudinary;
