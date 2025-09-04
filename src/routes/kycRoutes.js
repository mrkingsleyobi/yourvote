const express = require('express');
const kycController = require('../controllers/kycController');
const rateLimiter = require('../middleware/rateLimiter');
const {
  validateKYCRequest,
  validateDocumentData,
  validateBiometricData,
  validateGovernmentData
} = require('../middleware/validation');

const router = express.Router();

/**
 * @route POST /kyc/document/validate
 * @desc Validate identity document
 * @access Public
 */
router.post('/document/validate', rateLimiter(), validateDocumentData, kycController.validateDocument);

/**
 * @route POST /kyc/document/ocr
 * @desc Perform OCR on document image
 * @access Public
 */
router.post('/document/ocr', rateLimiter(), kycController.performOCR);

/**
 * @route POST /kyc/document/authenticity
 * @desc Validate document authenticity
 * @access Public
 */
router.post('/document/authenticity', rateLimiter(), validateDocumentData, kycController.validateDocumentAuthenticity);

/**
 * @route POST /kyc/biometric/verify
 * @desc Verify biometric data
 * @access Public
 */
router.post('/biometric/verify', rateLimiter(), validateBiometricData, kycController.verifyBiometric);

/**
 * @route POST /kyc/biometric/face-recognition
 * @desc Perform face recognition
 * @access Public
 */
router.post('/biometric/face-recognition', rateLimiter(), kycController.performFaceRecognition);

/**
 * @route POST /kyc/biometric/liveness
 * @desc Perform liveness detection
 * @access Public
 */
router.post('/biometric/liveness', rateLimiter(), kycController.performLivenessDetection);

/**
 * @route POST /kyc/biometric/comprehensive
 * @desc Perform comprehensive biometric verification
 * @access Public
 */
router.post('/biometric/comprehensive', rateLimiter(), validateBiometricData, kycController.performComprehensiveBiometricVerification);

/**
 * @route POST /kyc/government/crosscheck
 * @desc Cross-check with government database
 * @access Public
 */
router.post('/government/crosscheck', rateLimiter(), validateGovernmentData, kycController.crossCheckGovernment);

/**
 * @route POST /kyc/government/voter-registration
 * @desc Query voter registration database
 * @access Public
 */
router.post('/government/voter-registration', rateLimiter(), validateGovernmentData, kycController.queryVoterRegistration);

/**
 * @route POST /kyc/government/citizenship
 * @desc Verify citizenship status
 * @access Public
 */
router.post('/government/citizenship', rateLimiter(), validateGovernmentData, kycController.verifyCitizenship);

/**
 * @route POST /kyc/government/comprehensive
 * @desc Perform comprehensive government verification
 * @access Public
 */
router.post('/government/comprehensive', rateLimiter(), validateGovernmentData, kycController.performComprehensiveGovernmentVerification);

/**
 * @route POST /kyc/verify
 * @desc Perform complete KYC verification
 * @access Public
 */
router.post('/verify', rateLimiter(), validateKYCRequest, kycController.performKYC);

/**
 * @route POST /kyc/encrypt
 * @desc Encrypt KYC data
 * @access Public
 */
router.post('/encrypt', kycController.encryptKYCData);

/**
 * @route POST /kyc/decrypt
 * @desc Decrypt KYC data
 * @access Public
 */
router.post('/decrypt', kycController.decryptKYCData);

module.exports = router;