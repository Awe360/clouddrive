const multer = require('multer');

// Configure multer to store file uploads in memory buffer before sending to S3
const storage = multer.memoryStorage();

// File limits (e.g. max size 50MB)
const limits = {
  fileSize: 50 * 1024 * 1024 // 50 Megabytes
};

// Mime types allowed in CloudDrive
const allowedMimeTypes = [
  // Images
  'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp',
  // Documents
  'application/pdf', 'text/plain', 'text/csv', 'text/html', 'text/css', 'text/javascript',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Archives
  'application/zip', 'application/x-zip-compressed', 'application/x-tar', 'application/x-gzip', 'application/x-rar-compressed'
];

/**
 * Filter files by their mime type
 */
function fileFilter(req, file, cb) {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Mime type "${file.mimetype}" is not supported. Please upload documents, images or archives.`), false);
  }
}

const upload = multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter
});

module.exports = upload;
