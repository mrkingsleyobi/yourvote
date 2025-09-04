const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/authUtils');

class AuthController {
  /**
   * User login endpoint
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      // In a real application, you would validate credentials against a database
      // For this demo, we'll accept any non-empty username/password
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Username and password are required'
        });
      }
      
      // For demo purposes, we'll create a mock user
      // In a real application, you would fetch user from database
      const user = {
        id: `user_${Date.now()}`,
        username: username,
        role: 'voter' // Default role
      };
      
      // Generate JWT token
      const token = generateToken(user);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token: token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Login failed'
      });
    }
  }
  
  /**
   * User registration endpoint
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async register(req, res) {
    try {
      const { username, password, email } = req.body;
      
      // Validate required fields
      if (!username || !password || !email) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Username, password, and email are required'
        });
      }
      
      // In a real application, you would:
      // 1. Check if user already exists
      // 2. Hash the password
      // 3. Store user in database
      // 4. Perform email verification
      
      // For demo purposes, we'll create a mock user
      const user = {
        id: `user_${Date.now()}`,
        username: username,
        email: email,
        role: 'voter'
      };
      
      // Generate JWT token
      const token = generateToken(user);
      
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          token: token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('Registration error:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Registration failed'
      });
    }
  }
  
  /**
   * Get current user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProfile(req, res) {
    try {
      // User information is attached to req.user by authentication middleware
      const user = req.user;
      
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('Get profile error:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to retrieve profile'
      });
    }
  }
}

module.exports = new AuthController();