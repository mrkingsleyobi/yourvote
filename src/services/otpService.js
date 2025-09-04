const speakeasy = require('speakeasy');
const crypto = require('crypto');
const config = require('../config/config');

class OTPService {
  /**
   * Generate a secret for TOTP
   * @returns {Object} Secret object with ascii, hex, base32, and otpauth_url properties
   */
  generateSecret() {
    return speakeasy.generateSecret({
      name: 'YourVote OTP',
      issuer: 'YourVote'
    });
  }

  /**
   * Generate a TOTP token
   * @param {string} secretBase32 - Base32 encoded secret
   * @returns {string} TOTP token
   */
  generateTOTP(secretBase32) {
    return speakeasy.totp({
      secret: secretBase32,
      encoding: 'base32',
      algorithm: 'sha1',
      step: 30, // 30 seconds
      digits: 6 // 6 digits
    });
  }

  /**
   * Verify a TOTP token
   * @param {string} secretBase32 - Base32 encoded secret
   * @param {string} token - TOTP token to verify
   * @param {number} window - Acceptable time window in steps (default: 1)
   * @returns {boolean} True if token is valid
   */
  verifyTOTP(secretBase32, token, window = 1) {
    return speakeasy.totp.verify({
      secret: secretBase32,
      encoding: 'base32',
      token: token,
      window: window,
      algorithm: 'sha1',
      step: 30
    });
  }

  /**
   * Encrypt a secret using AES-256
   * @param {string} text - Text to encrypt
   * @returns {string} Encrypted text
   */
  encryptSecret(text) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(config.encryptionKey, 'GfG', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypt a secret using AES-256
   * @param {string} encryptedText - Encrypted text to decrypt
   * @returns {string} Decrypted text
   */
  decryptSecret(encryptedText) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(config.encryptionKey, 'GfG', 32);
    
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encrypted = parts.join(':');
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Generate QR code URL for authenticator apps
   * @param {string} secretBase32 - Base32 encoded secret
   * @param {string} accountName - Account name (e.g., user email)
   * @returns {string} QR code URL
   */
  generateQRCodeURL(secretBase32, accountName) {
    return speakeasy.otpauthURL({
      secret: secretBase32,
      label: accountName,
      issuer: 'YourVote',
      encoding: 'base32'
    });
  }
}

module.exports = new OTPService();