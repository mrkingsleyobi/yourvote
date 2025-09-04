const config = require('../config/config');

class EmailService {
  /**
   * Send email
   * @param {string} to - Recipient email address
   * @param {string} subject - Email subject
   * @param {string} html - HTML content
   * @param {string} text - Plain text content
   * @returns {Object} Result with success flag and message
   */
  async sendEmail(to, subject, html, text) {
    try {
      // In a production environment, you would integrate with an email provider like:
      // - Nodemailer with SMTP
      // - AWS SES
      // - SendGrid
      // - Mailgun
      // - Postmark
      
      // For now, we'll simulate the email sending
      console.log(`Email sent to ${to} with subject: ${subject}`);
      console.log(`HTML content: ${html}`);
      console.log(`Text content: ${text}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return {
        success: true,
        messageId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        provider: 'simulated'
      };
    } catch (error) {
      console.error('Error sending email:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Send OTP via email
   * @param {string} to - Recipient email address
   * @param {string} otp - OTP token
   * @param {string} accountName - Account name for context
   * @returns {Object} Result with success flag and message
   */
  async sendOTPEmail(to, otp, accountName = 'YourVote User') {
    try {
      const subject = 'Your YourVote Verification Code';
      const text = `Hello ${accountName},

Your YourVote verification code is: ${otp}

This code will expire in 5 minutes. If you didn't request this code, please ignore this email.

Thank you for using YourVote!
The YourVote Team`;
      
      const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>YourVote Verification Code</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50;">Your YourVote Verification Code</h2>
        <p>Hello ${accountName},</p>
        <p>Your verification code is:</p>
        <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; padding: 15px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #2c3e50;">${otp}</span>
        </div>
        <p>This code will expire in 5 minutes. If you didn't request this code, please ignore this email.</p>
        <p>Thank you for using YourVote!</p>
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
            The YourVote Team
        </p>
    </div>
</body>
</html>`;
      
      return await this.sendEmail(to, subject, html, text);
    } catch (error) {
      console.error('Error sending OTP email:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Validate email address format
   * @param {string} email - Email address to validate
   * @returns {boolean} True if valid
   */
  validateEmail(email) {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = new EmailService();