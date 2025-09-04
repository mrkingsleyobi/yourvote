const otpService = require('../services/otpService');
const smsService = require('../services/smsService');
const emailService = require('../services/emailService');
const rateLimitService = require('../services/rateLimitService');

class OTPController {
  /**
   * Generate a new OTP secret and QR code
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async generateSecret(req, res) {
    try {
      // In a real implementation, you would associate this with a user
      const userId = req.body.userId || 'default';
      
      // Generate a new secret
      const secret = otpService.generateSecret();
      
      // Encrypt the secret for secure storage
      const encryptedSecret = otpService.encryptSecret(secret.base32);
      
      // Generate QR code URL for authenticator apps
      const accountName = req.body.accountName || `user-${userId}`;
      const qrCodeUrl = otpService.generateQRCodeURL(secret.base32, accountName);
      
      // In a real implementation, you would store the encrypted secret in a database
      // associated with the user ID
      
      res.status(200).json({
        success: true,
        data: {
          secret: encryptedSecret, // Store this securely in your database
          qrCodeUrl: qrCodeUrl,
          accountName: accountName
        }
      });
    } catch (error) {
      console.error('Error generating OTP secret:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to generate OTP secret'
      });
    }
  }

  /**
   * Generate a TOTP token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async generateToken(req, res) {
    try {
      const { encryptedSecret } = req.body;
      
      if (!encryptedSecret) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Encrypted secret is required'
        });
      }
      
      // Decrypt the secret
      const decryptedSecret = otpService.decryptSecret(encryptedSecret);
      
      // Generate TOTP token
      const token = otpService.generateTOTP(decryptedSecret);
      
      res.status(200).json({
        success: true,
        data: {
          token: token,
          expiresAt: new Date(Date.now() + 30000) // 30 seconds from now
        }
      });
    } catch (error) {
      console.error('Error generating OTP token:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to generate OTP token'
      });
    }
  }

  /**
   * Validate a TOTP token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async validateToken(req, res) {
    try {
      const { encryptedSecret, token } = req.body;
      
      if (!encryptedSecret || !token) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Both encrypted secret and token are required'
        });
      }
      
      // Decrypt the secret
      const decryptedSecret = otpService.decryptSecret(encryptedSecret);
      
      // Verify TOTP token
      const isValid = otpService.verifyTOTP(decryptedSecret, token);
      
      res.status(200).json({
        success: true,
        data: {
          valid: isValid
        }
      });
    } catch (error) {
      console.error('Error validating OTP token:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to validate OTP token'
      });
    }
  }

  /**
   * Send OTP via different delivery methods
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async sendOTP(req, res) {
    try {
      const { encryptedSecret, method, destination } = req.body;
      
      if (!encryptedSecret || !method || !destination) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Encrypted secret, method, and destination are required'
        });
      }
      
      // Decrypt the secret
      const decryptedSecret = otpService.decryptSecret(encryptedSecret);
      
      // Generate TOTP token
      const token = otpService.generateTOTP(decryptedSecret);
      
      // In a real implementation, you would send the token via the specified method:
      // - SMS: Use a service like Twilio
      // - Email: Use a service like Nodemailer
      // - Authenticator app: Already handled by the QR code
      
      let success = false;
      let message = '';
      let result = {};
      
      switch (method.toLowerCase()) {
        case 'sms':
          // Validate phone number
          if (!smsService.validatePhoneNumber(destination)) {
            return res.status(400).json({
              success: false,
              error: 'Bad Request',
              message: 'Invalid phone number format. Please use E.164 format (e.g., +1234567890)'
            });
          }
          
          // Send OTP via SMS
          result = await smsService.sendOTPSMS(destination, token);
          success = result.success;
          message = result.success 
            ? `OTP token sent via SMS to ${destination}` 
            : `Failed to send OTP via SMS: ${result.error}`;
          break;
        case 'email':
          // Validate email address
          if (!emailService.validateEmail(destination)) {
            return res.status(400).json({
              success: false,
              error: 'Bad Request',
              message: 'Invalid email address format'
            });
          }
          
          // Send OTP via email
          result = await emailService.sendOTPEmail(destination, token, req.body.accountName || 'YourVote User');
          success = result.success;
          message = result.success 
            ? `OTP token sent via email to ${destination}` 
            : `Failed to send OTP via email: ${result.error}`;
          break;
        case 'authenticator':
          success = true;
          message = `OTP token ${token} ready for authenticator app`;
          break;
        default:
          return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Invalid delivery method. Supported methods: sms, email, authenticator'
          });
      }
      
      res.status(200).json({
        success: success,
        message: message,
        data: {
          token: success ? token : undefined,
          method: method,
          destination: destination,
          providerResponse: result.success ? result : undefined
        }
      });
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to send OTP'
      });
    }
  }
}

module.exports = new OTPController();