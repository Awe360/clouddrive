const { GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3 = require('../config/s3');

const BUCKET = process.env.S3_BUCKET_NAME || 'clouddrive-files-dev-12345';

/**
 * Generate a S3 presigned URL for downloading a private object.
 * @param {string} s3Key - The key of the object in S3
 * @returns {Promise<string>} The temporary presigned GET URL
 */
async function getDownloadUrl(s3Key) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: s3Key
    });
    // Signature expires in 900 seconds (15 minutes)
    return await getSignedUrl(s3, command, { expiresIn: 900 });
  } catch (error) {
    console.error('Error generating presigned download URL:', error);
    throw error;
  }
}

/**
 * Generate a S3 presigned URL for uploading directly to S3.
 * @param {string} s3Key - The key path to upload the object to
 * @param {string} contentType - The expected mime-type of the upload
 * @returns {Promise<string>} The temporary presigned PUT URL
 */
async function getUploadUrl(s3Key, contentType) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      ContentType: contentType
    });
    // Signature expires in 300 seconds (5 minutes)
    return await getSignedUrl(s3, command, { expiresIn: 300 });
  } catch (error) {
    console.error('Error generating presigned upload URL:', error);
    throw error;
  }
}

module.exports = {
  getDownloadUrl,
  getUploadUrl
};
