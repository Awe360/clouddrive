const express = require('express');
const authController = require('../controller/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected Routes
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
