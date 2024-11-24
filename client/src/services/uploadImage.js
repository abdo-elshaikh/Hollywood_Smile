// This service uploads an image to Supabase Storage.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const uploadImage = async (file, directory, bucket = 'uploads') => {
    if (!file) {
        setError('Please select a file to upload.');
        return;
    }
    if (!directory) {
        setError('Please specify a directory.');
        return;
    }

    if (file.size > 50 * 1024 * 1024) {
        setError('File size exceeds the limit of 50MB.');
        return;
    }

    const fileKey = `${directory}/${file.name}`;

    try {
        const { data, error } = await supabase.storage.from(bucket).upload(fileKey, file, {
            cacheControl: 3600,
            upsert: true,
        });

        if (error) {
            throw new Error(error.message);
        }

        const fullUrl = `${import.meta.env.VITE_SUPABASE_VIEW_URL}/${data.fullPath}`;
        return { ...data, fullUrl };
    } catch (error) {
        throw error;
    }
};


const createBucket = async (bucketName, allowedMimeTypes) => {
    try {
        const { data, error } = await supabase.storage.createBucket(bucketName, { public: true, allowedMimeTypes });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
    catch (error) {
        throw error;
    }
}

const deleteFile = async (filePath, bucket = 'uploads') => {
    try {
        const { data, error } = await supabase.storage.from(bucket).remove([filePath]);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
    catch (error) {
        throw error;
    }
}

const moveFile = async (sourcePath, destinationPath, bucket = 'uploads') => {
    try {
        const { data, error } = await supabase.storage.from(bucket).move([sourcePath], destinationPath);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
    catch (error) {
        throw error;
    }
}

const copyFile = async (sourcePath, destinationPath, bucket = 'uploads') => {
    try {
        const { data, error } = await supabase.storage.from(bucket).copy([sourcePath], destinationPath);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export { supabase, uploadImage, createBucket, deleteFile, moveFile, copyFile };
