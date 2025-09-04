const kycService = require('../services/kycService');
const rateLimiter = require('../middleware/rateLimiter');

class KYCController {
  /**
   * Validate identity document
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async validateDocument(req, res) {
    try {
      const { documentData } = req.body;
      
      if (!documentData) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Document data is required'
        });
      }
      
      const result = await kycService.validateDocument(documentData);
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to validate document',
          details: result.error
        });
      }
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error validating document:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to validate document'
      });
    }
  }
  
  /**
   * Perform OCR on document image
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async performOCR(req, res) {
    try {
      const { documentImage } = req.body;
      
      if (!documentImage) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Document image is required'
        });
      }
      
      const result = await kycService.performOCR(documentImage);
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to perform OCR',
          details: result.error
        });
      }
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error performing OCR:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to perform OCR'
      });
    }
  }
  
  /**
   * Validate document authenticity
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async validateDocumentAuthenticity(req, res) {
    try {
      const { documentData } = req.body;
      
      if (!documentData) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Document data is required'
        });
      }
      
      const result = await kycService.validateDocumentAuthenticity(documentData);
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to validate document authenticity',
          details: result.error
        });
      }
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error validating document authenticity:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to validate document authenticity'
      });
    }
  }
  
  /**
   * Verify biometric data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async verifyBiometric(req, res) {
    try {
      const { biometricData } = req.body;
      
      if (!biometricData) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Biometric data is required'
        });
      }
      
      const result = await kycService.verifyBiometric(biometricData);
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to verify biometric data',
          details: result.error
        });
      }
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error verifying biometric data:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to verify biometric data'
      });
    }
  }
  
  /**
   * Perform face recognition
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async performFaceRecognition(req, res) {
    try {
      const { faceImage, referenceImage } = req.body;
      
      if (!faceImage || !referenceImage) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Both face image and reference image are required'
        });
      }
      
      const result = await kycService.performFaceRecognition(faceImage, referenceImage);
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to perform face recognition',
          details: result.error
        });
      }
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error performing face recognition:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to perform face recognition'
      });
    }
  }
  
  /**
   * Perform liveness detection
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async performLivenessDetection(req, res) {
    try {
      const { livenessData } = req.body;
      
      if (!livenessData) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Liveness data is required'
        });
      }
      
      const result = await kycService.performLivenessDetection(livenessData);
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to perform liveness detection',
          details: result.error
        });
      }
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error performing liveness detection:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to perform liveness detection'
      });
    }
  }
  
  /**
   * Perform comprehensive biometric verification
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async performComprehensiveBiometricVerification(req, res) {
    try {
      const { biometricData } = req.body;
      
      if (!biometricData) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Biometric data is required'
        });
      }
      
      const result = await kycService.performComprehensiveBiometricVerification(biometricData);
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to perform comprehensive biometric verification',
          details: result.error
        });
      }
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error performing comprehensive biometric verification:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to perform comprehensive biometric verification'
      });
    }
  }
  
  /**
   * Cross-check with government database
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async crossCheckGovernment(req, res) {
    try {
      const { userData } = req.body;
      
      if (!userData) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'User data is required'
        });
      }
      
      const result = await kycService.crossCheckGovernmentDatabase(userData);
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to cross-check government database',
          details: result.error
        });
      }
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error cross-checking government database:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to cross-check government database'
      });
    }
  }
  
  /**
   * Query voter registration database
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async queryVoterRegistration(req, res) {
    try {
      const { voterData } = req.body;
      
      if (!voterData) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Voter data is required'
        });
      }
      
      const result = await kycService.queryVoterRegistration(voterData);
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to query voter registration',
          details: result.error
        });
      }
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error querying voter registration:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to query voter registration'
      });
    }
  }
  
  /**
   * Verify citizenship status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async verifyCitizenship(req, res) {
    try {
      const { citizenData } = req.body;
      
      if (!citizenData) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Citizen data is required'
        });
      }
      
      const result = await kycService.verifyCitizenship(citizenData);
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to verify citizenship',
          details: result.error
        });
      }
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error verifying citizenship:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to verify citizenship'
      });
    }
  }
  
  /**
   * Perform comprehensive government verification
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async performComprehensiveGovernmentVerification(req, res) {
    try {
      const { govData } = req.body;
      
      if (!govData) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Government data is required'
        });
      }
      
      const result = await kycService.performComprehensiveGovernmentVerification(govData);
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to perform comprehensive government verification',
          details: result.error
        });
      }
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error performing comprehensive government verification:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to perform comprehensive government verification'
      });
    }
  }
  
  /**
   * Perform complete KYC verification
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async performKYC(req, res) {
    try {
      const { kycData } = req.body;
      
      if (!kycData) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'KYC data is required'
        });
      }
      
      const result = await kycService.performKYCVerification(kycData);
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to perform KYC verification',
          details: result.error
        });
      }
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error performing KYC verification:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to perform KYC verification'
      });
    }
  }
  
  /**
   * Encrypt KYC data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async encryptKYCData(req, res) {
    try {
      const { data } = req.body;
      
      if (!data) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Data is required'
        });
      }
      
      const encryptedData = kycService.encryptKYCData(data);
      
      res.status(200).json({
        success: true,
        data: {
          encryptedData: encryptedData
        }
      });
    } catch (error) {
      console.error('Error encrypting KYC data:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to encrypt KYC data'
      });
    }
  }
  
  /**
   * Decrypt KYC data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async decryptKYCData(req, res) {
    try {
      const { encryptedData } = req.body;
      
      if (!encryptedData) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Encrypted data is required'
        });
      }
      
      const decryptedData = kycService.decryptKYCData(encryptedData);
      
      res.status(200).json({
        success: true,
        data: {
          decryptedData: decryptedData
        }
      });
    } catch (error) {
      console.error('Error decrypting KYC data:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to decrypt KYC data'
      });
    }
  }
}

module.exports = new KYCController();