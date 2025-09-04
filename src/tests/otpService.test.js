const otpService = require('../services/otpService');

describe('OTP Service', () => {
  describe('generateSecret', () => {
    it('should generate a valid secret object', () => {
      const secret = otpService.generateSecret();
      
      expect(secret).toHaveProperty('ascii');
      expect(secret).toHaveProperty('hex');
      expect(secret).toHaveProperty('base32');
      expect(secret).toHaveProperty('otpauth_url');
      
      // Check that base32 secret is valid
      expect(typeof secret.base32).toBe('string');
      expect(secret.base32.length).toBeGreaterThan(16);
    });
  });

  describe('generateTOTP', () => {
    it('should generate a 6-digit TOTP token', () => {
      const secret = otpService.generateSecret();
      const token = otpService.generateTOTP(secret.base32);
      
      expect(typeof token).toBe('string');
      expect(token).toMatch(/^\d{6}$/);
    });
  });

  describe('verifyTOTP', () => {
    it('should verify a valid TOTP token', () => {
      const secret = otpService.generateSecret();
      const token = otpService.generateTOTP(secret.base32);
      const isValid = otpService.verifyTOTP(secret.base32, token);
      
      expect(isValid).toBe(true);
    });

    it('should reject an invalid TOTP token', () => {
      const secret = otpService.generateSecret();
      const isValid = otpService.verifyTOTP(secret.base32, '123456');
      
      expect(isValid).toBe(false);
    });
  });

  describe('encryptSecret and decryptSecret', () => {
    it('should encrypt and decrypt a secret correctly', () => {
      const originalText = 'SUPERSECRETKEYFOROTP';
      const encrypted = otpService.encryptSecret(originalText);
      const decrypted = otpService.decryptSecret(encrypted);
      
      expect(typeof encrypted).toBe('string');
      expect(encrypted).toContain(':');
      expect(decrypted).toBe(originalText);
    });
  });

  describe('generateQRCodeURL', () => {
    it('should generate a valid QR code URL', () => {
      const secretBase32 = 'JBSWY3DPEHPK3PXP';
      const accountName = 'test@example.com';
      const qrCodeUrl = otpService.generateQRCodeURL(secretBase32, accountName);
      
      expect(typeof qrCodeUrl).toBe('string');
      expect(qrCodeUrl).toContain('otpauth://totp/');
      expect(qrCodeUrl).toContain(accountName);
      expect(qrCodeUrl).toContain(`secret=${secretBase32}`);
    });
  });
});