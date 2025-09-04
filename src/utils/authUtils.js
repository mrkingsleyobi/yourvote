const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object containing user information
 * @param {string} user.id - User ID
 * @param {string} user.role - User role
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  };
  
  return jwt.sign(payload, config.jwtSecret);
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};