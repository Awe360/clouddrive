const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const s3 = require('../config/s3');
const FileModel = require('../model/fileModel');
const { getDownloadUrl } = require('../utils/presignedUrl');

const BUCKET = process.env.S3_BUCKET_NAME || 'clouddrive-files-dev-12345';

/**
 * Upload file to S3 and save metadata in DB
 */
async function uploadFile(req, res, next) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Please upload a file.' });
    }

    const userId = req.user.id;
    const uniqueId = uuidv4();
    // Path layout inside bucket: users/{user_id}/{uuid}-{original_filename}
    const s3Key = `users/${userId}/${uniqueId}-${file.originalname}`;

    console.log(`Uploading file ${file.originalname} to S3 Key: ${s3Key}...`);

    // S3 Put Command
    const s3Params = {
      Bucket: BUCKET,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    await s3.send(new PutObjectCommand(s3Params));

    // Record in DB
    const fileId = await FileModel.create({
      user_id: userId,
      filename: file.originalname,
      s3_key: s3Key,
      size_bytes: file.size,
      mime_type: file.mimetype
    });

    const fileRecord = await FileModel.findById(fileId);

    res.status(201).json({
      message: 'File uploaded successfully.',
      file: fileRecord
    });
  } catch (error) {
    next(error);
  }
}

/**
 * List files for the current user
 */
async function listFiles(req, res, next) {
  try {
    const files = await FileModel.findByUserId(req.user.id);
    res.json({ files });
  } catch (error) {
    next(error);
  }
}

/**
 * Download a file by generating a presigned GET URL
 */
async function downloadFile(req, res, next) {
  try {
    const fileId = req.params.id;
    const file = await FileModel.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found.' });
    }

    // Security: Check if user owns the file
    if (file.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You do not own this file.' });
    }

    // Generate temporary S3 presigned GET URL
    const url = await getDownloadUrl(file.s3_key);

    res.json({
      url,
      expires_in: 900 // 15 minutes
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a file from S3 and DB
 */
async function deleteFile(req, res, next) {
  try {
    const fileId = req.params.id;
    const file = await FileModel.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found.' });
    }

    // Security check: Check ownership
    if (file.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You do not own this file.' });
    }

    console.log(`Deleting file ${file.filename} (S3 Key: ${file.s3_key}) from S3 and database...`);

    // 1. Delete from S3
    const s3Params = {
      Bucket: BUCKET,
      Key: file.s3_key
    };
    await s3.send(new DeleteObjectCommand(s3Params));

    // 2. Delete from DB
    await FileModel.deleteById(fileId);

    res.json({
      message: 'File deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get total file count and size in bytes
 */
async function getFileStats(req, res, next) {
  try {
    const stats = await FileModel.getStatsByUserId(req.user.id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadFile,
  listFiles,
  downloadFile,
  deleteFile,
  getFileStats
};
