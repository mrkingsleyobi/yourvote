const securityUtils = require('../utils/securityUtils');

/**
 * Validate OTP generation request
 */
const validateGenerateSecret = (req, res, next) => {
  // Optional validation - in a real app you might want to validate userId
  next();
};

/**
 * Validate token generation request
 */
const validateGenerateToken = (req, res, next) => {
  const { encryptedSecret } = req.body;
  
  if (!encryptedSecret) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Encrypted secret is required'
    });
  }
  
  // Basic validation - in a real app you might want more thorough validation
  if (typeof encryptedSecret !== 'string' || encryptedSecret.length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Invalid encrypted secret format'
    });
  }
  
  next();
};

/**
 * Validate token validation request
 */
const validateValidateToken = (req, res, next) => {
  const { encryptedSecret, token } = req.body;
  
  if (!encryptedSecret || !token) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Both encrypted secret and token are required'
    });
  }
  
  // Validate token format
  if (!securityUtils.isValidToken(token)) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Invalid token format. Token must be 6 digits.'
    });
  }
  
  // Basic validation of encrypted secret
  if (typeof encryptedSecret !== 'string' || encryptedSecret.length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Invalid encrypted secret format'
    });
  }
  
  next();
};

/**
 * Validate OTP sending request
 */
const validateSendOTP = (req, res, next) => {
  const { encryptedSecret, method, destination } = req.body;
  
  if (!encryptedSecret || !method || !destination) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Encrypted secret, method, and destination are required'
    });
  }
  
  // Validate method
  const validMethods = ['sms', 'email', 'authenticator'];
  if (!validMethods.includes(method.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Invalid delivery method. Supported methods: sms, email, authenticator'
    });
  }
  
  // Basic validation of encrypted secret
  if (typeof encryptedSecret !== 'string' || encryptedSecret.length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Invalid encrypted secret format'
    });
  }
  
  // Basic validation of destination
  if (typeof destination !== 'string' || destination.length < 3) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Invalid destination format'
    });
  }
  
  next();
};

/**
 * Validate KYC request
 */
const validateKYCRequest = (req, res, next) => {
  const { kycData } = req.body;
  
  if (!kycData) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'KYC data is required'
    });
  }
  
  // Basic validation - in a real app you might want more thorough validation
  if (typeof kycData !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Invalid KYC data format'
    });
  }
  
  next();
};

/**
 * Validate document data
 */
const validateDocumentData = (req, res, next) => {
  const { documentData } = req.body;
  
  if (!documentData) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Document data is required'
    });
  }
  
  // Check required fields
  const requiredFields = ['type', 'number'];
  for (const field of requiredFields) {
    if (!documentData[field]) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: `Document ${field} is required`
      });
    }
  }
  
  next();
};

/**
 * Validate biometric data
 */
const validateBiometricData = (req, res, next) => {
  const { biometricData } = req.body;
  
  if (!biometricData) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Biometric data is required'
    });
  }
  
  // Check required fields
  if (!biometricData.faceImage) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Face image is required'
    });
  }
  
  next();
};

/**
 * Validate government data
 */
const validateGovernmentData = (req, res, next) => {
  const { userData } = req.body;
  
  if (!userData) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'User data is required'
    });
  }
  
  // Check required fields
  const requiredFields = ['firstName', 'lastName', 'dateOfBirth'];
  for (const field of requiredFields) {
    if (!userData[field]) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: `User ${field} is required`
      });
    }
  }
  
  next();
};

module.exports = {
  validateGenerateSecret,
  validateGenerateToken,
  validateValidateToken,
  validateSendOTP,
  validateKYCRequest,
  validateDocumentData,
  validateBiometricData,
  validateGovernmentData
};