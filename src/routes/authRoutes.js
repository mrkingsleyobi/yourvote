const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

/**
 * @route POST /auth/login
 * @desc User login
 * @access Public
 */
router.post('/login', rateLimiter(), authController.login);

/**
 * @route POST /auth/register
 * @desc User registration
 * @access Public
 */
router.post('/register', rateLimiter(), authController.register);

/**
 * @route GET /auth/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile', rateLimiter(), authenticate, authController.getProfile);

module.exports = router;