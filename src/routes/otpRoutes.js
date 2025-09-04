const express = require('express');
const otpController = require('../controllers/otpController');
const rateLimiter = require('../middleware/rateLimiter');
const {
  validateGenerateSecret,
  validateGenerateToken,
  validateValidateToken,
  validateSendOTP
} = require('../middleware/validation');

const router = express.Router();

/**
 * @route POST /otp/secret
 * @desc Generate a new OTP secret
 * @access Public
 */
router.post('/secret', rateLimiter(), validateGenerateSecret, otpController.generateSecret);

/**
 * @route POST /otp/token
 * @desc Generate a TOTP token
 * @access Public
 */
router.post('/token', rateLimiter(), validateGenerateToken, otpController.generateToken);

/**
 * @route POST /otp/validate
 * @desc Validate a TOTP token
 * @access Public
 */
router.post('/validate', rateLimiter(), validateValidateToken, otpController.validateToken);

/**
 * @route POST /otp/send
 * @desc Send OTP via specified delivery method
 * @access Public
 */
router.post('/send', rateLimiter(), validateSendOTP, otpController.sendOTP);

module.exports = router;