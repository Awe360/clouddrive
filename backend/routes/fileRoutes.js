const express = require('express');
const fileController = require('../controller/fileController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Apply auth middleware to protect all routes
router.use(authMiddleware);

// File CRUD operations
router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/', fileController.listFiles);
router.get('/stats', fileController.getFileStats);
router.get('/:id/download', fileController.downloadFile);
router.delete('/:id', fileController.deleteFile);

module.exports = router;
