const { createClient } = require('@supabase/supabase-js');
const tus = require('tus-js-client');
const dotenv = require('dotenv');
const fs = require('fs'); // Used for file streaming if necessary

// Load environment variables from a .env file
dotenv.config();

// Get Supabase URL and key from environment variables
const supabaseUrl = process.env.Project_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const uploadFile = async (bucketName, fileName, file) => {
  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      // Correct endpoint for resumable uploads
      endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000], // Retry delay settings
      headers: {
        // Authorization is required; typically a Bearer token or session token
        authorization: `Bearer ${supabaseKey}`,
        'x-upsert': 'true', // Allows overwriting of existing files
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true, // Remove the fingerprint after upload success
      metadata: {
        bucketName: bucketName,
        objectName: fileName,
        contentType: file.type, // Use file's MIME type
        cacheControl: 3600, // Optional: You can adjust cache control if needed
      },
      chunkSize: 6 * 1024 * 1024, // Supabase requires chunk size to be 6MB for now
      onError: (error) => {
        console.error('Upload failed because: ', error);
        reject(error); // Reject the promise with the error
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(`Uploaded: ${bytesUploaded} / ${bytesTotal} (${percentage}%)`);
      },
      onSuccess: () => {
        console.log('Upload complete:', upload);
        resolve(upload.url); // Resolve the promise with the upload URL
      },
    });

    // Check if there are previous uploads that we can resume
    upload.findPreviousUploads().then((previousUploads) => {
      // Resume the first previous upload if found
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      // Start the upload
      upload.start();
    });
  });
};

module.exports = {
  supabase,
  uploadFile,
};
