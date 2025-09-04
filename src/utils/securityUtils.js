const bcrypt = require('bcryptjs');

class SecurityUtils {
  /**
   * Validate if a string is a valid TOTP token (6 digits)
   * @param {string} token - Token to validate
   * @returns {boolean} True if valid
   */
  isValidToken(token) {
    if (!token) return false;
    return /^\d{6}$/.test(token);
  }

  /**
   * Validate if a string is a valid Base32 secret
   * @param {string} secret - Secret to validate
   * @returns {boolean} True if valid
   */
  isValidBase32Secret(secret) {
    if (!secret) return false;
    return /^[A-Z2-7]+=*$/.test(secret) && secret.length >= 16;
  }

  /**
   * Sanitize input to prevent injection attacks
   * @param {string} input - Input to sanitize
   * @returns {string} Sanitized input
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[^a-zA-Z0-9@._-]/g, '');
  }

  /**
   * Hash a value using bcrypt
   * @param {string} value - Value to hash
   * @param {number} saltRounds - Number of salt rounds
   * @returns {string} Hashed value
   */
  async hashValue(value, saltRounds = 10) {
    return await bcrypt.hash(value, saltRounds);
  }

  /**
   * Compare a value with its hash
   * @param {string} value - Value to compare
   * @param {string} hash - Hash to compare against
   * @returns {boolean} True if they match
   */
  async compareHash(value, hash) {
    return await bcrypt.compare(value, hash);
  }

  /**
   * Generate a random string
   * @param {number} length - Length of the string
   * @returns {string} Random string
   */
  generateRandomString(length = 32) {
    return require('crypto').randomBytes(length).toString('hex');
  }
}

module.exports = new SecurityUtils();