// This service uploads an image to Supabase Storage.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Upload an image to Supabase Storage
const uploadFile = async (file, filePath, fileName, bucket = 'uploads') => {
    if (!file) {
        setError('Please select a file to upload.');
        return;
    }
    if (!filePath) {
        setError('Please specify a directory.');
        return;
    }

    if (file.size > 50 * 1024 * 1024) {
        setError('File size exceeds the limit of 50MB.');
        return;
    }
    console.log("file :", file);
    const path = `${filePath}/${fileName}`;

    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: 3600,
                upsert: true,
            });

        if (error) {
            return { error: error.message };
        }

        const fullUrl = `${import.meta.env.VITE_SUPABASE_VIEW_URL}/${data.fullPath}`;
        return { ...data, fullUrl };
    } catch (error) {
        return { error: error.message };
    }
};

// Replace an existing file
const replaceFile = async (file, filePath, fileName, bucket = 'uploads') => {
    if (!file) {
        setError('Please select a file to upload.');
        return;
    }
    if (!filePath) {
        setError('Please specify a directory.');
        return;
    }

    if (file.size > 50 * 1024 * 1024) {
        setError('File size exceeds the limit of 50MB.');
        return;
    }
    const path = `${filePath}/${fileName}`;
    try {
        const { data, error } = await supabase.storage.from(bucket)
            .update(path, file, {
                cacheControl: 3600,
                upsert: true,
            });

        if (error) {
            console.error(error);
            return { error: error.message };
        }

        const fullUrl = `${import.meta.env.VITE_SUPABASE_VIEW_URL}/${data.fullPath}`;
        return { ...data, fullUrl };
    } catch (error) {
        return { error: error.message };
    }
}

// Create a new bucket
const createBucket = async (bucketName, allowedMimeTypes) => {
    const { data, error } = await supabase.storage.createBucket(bucketName, { public: true, allowedMimeTypes });

    if (error) {
        return { error: error.message };
    }

    return data;

}

// Delete a file
const deleteFile = async (filePath, bucket = 'uploads') => {
    try {
        const { data, error } = await supabase.storage.from(bucket).remove([filePath]);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
    catch (error) {
        return { error: error.message };
    }
}

// Move a file to a different location
const moveFile = async (sourcePath, destinationPath, bucket = 'uploads') => {
    try {
        const { data, error } = await supabase.storage.from(bucket).move([sourcePath], destinationPath);

        if (error) {
            return { error: error.message };
        }

        return data;
    }
    catch (error) {
        return { error: error.message };
    }
}

// Copy file
const copyFile = async (sourcePath, destinationPath, bucket = 'uploads') => {
    try {
        const { data, error } = await supabase.storage.from(bucket).copy([sourcePath], destinationPath);

        if (error) {
            return { error: error.message };
        }

        return data;
    } catch (error) {
        return { error: error.message };
    }
}

// List all files in a bucket
const listFiles = async (bucket = 'uploads', folder = '') => {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .list(folder, { limit: 100, offset: 0, sortBy: { column: 'name', order: 'asc' } });
        if (error) {
            return { error: error.message };
        }
        return data;
    } catch (error) {
        return { error: error.message };
    }
}


export { supabase, uploadFile, createBucket, deleteFile, moveFile, copyFile, listFiles, replaceFile };
