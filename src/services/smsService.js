const config = require('../config/config');

class SMSService {
  /**
   * Send SMS message
   * @param {string} to - Recipient phone number
   * @param {string} message - Message content
   * @returns {Object} Result with success flag and message
   */
  async sendSMS(to, message) {
    try {
      // In a production environment, you would integrate with an SMS provider like:
      // - Twilio
      // - AWS SNS
      // - Nexmo/Vonage
      // - Plivo
      // - MessageBird
      
      // For now, we'll simulate the SMS sending
      console.log(`SMS sent to ${to}: ${message}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return {
        success: true,
        messageId: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        provider: 'simulated'
      };
    } catch (error) {
      console.error('Error sending SMS:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Send OTP via SMS
   * @param {string} to - Recipient phone number
   * @param {string} otp - OTP token
   * @param {string} accountName - Account name for context
   * @returns {Object} Result with success flag and message
   */
  async sendOTPSMS(to, otp, accountName = 'YourVote User') {
    try {
      const message = `Your YourVote verification code is: ${otp}. This code will expire in 5 minutes.`;
      return await this.sendSMS(to, message);
    } catch (error) {
      console.error('Error sending OTP SMS:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Validate phone number format
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} True if valid
   */
  validatePhoneNumber(phoneNumber) {
    // Basic phone number validation (E.164 format)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }
}

module.exports = new SMSService();