const request = require('supertest');
const app = require('../server');

describe('Validation Middleware', () => {
  describe('validateGenerateToken', () => {
    it('should reject requests with missing encrypted secret', async () => {
      const response = await request(app)
        .post('/api/otp/token')
        .send({})
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bad Request');
    });

    it('should reject requests with invalid encrypted secret format', async () => {
      const response = await request(app)
        .post('/api/otp/token')
        .send({ encryptedSecret: 'ab' })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bad Request');
    });
  });

  describe('validateValidateToken', () => {
    it('should reject requests with missing parameters', async () => {
      const response = await request(app)
        .post('/api/otp/validate')
        .send({})
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bad Request');
    });

    it('should reject requests with invalid token format', async () => {
      const response = await request(app)
        .post('/api/otp/validate')
        .send({ 
          encryptedSecret: 'valid-secret-format-for-testing',
          token: 'abc123' 
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('6 digits');
    });
  });

  describe('validateSendOTP', () => {
    it('should reject requests with missing parameters', async () => {
      const response = await request(app)
        .post('/api/otp/send')
        .send({})
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bad Request');
    });

    it('should reject requests with invalid delivery method', async () => {
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await request(app)
        .post('/api/otp/send')
        .send({
          encryptedSecret: 'valid-secret-format-for-testing',
          method: 'invalid-method',
          destination: 'test@example.com'
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('Supported methods');
    });
  });
});