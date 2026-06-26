const express = require('express');
const userController = require('../controller/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to protect all routes
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);

module.exports = router;
