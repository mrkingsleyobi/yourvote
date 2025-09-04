const request = require('supertest');
const app = require('../server');

describe('OTP Controller', () => {
  describe('POST /api/otp/secret', () => {
    it('should generate a new OTP secret', async () => {
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await request(app)
        .post('/api/otp/secret')
        .send({ userId: 'testuser' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('secret');
      expect(response.body.data).toHaveProperty('qrCodeUrl');
      expect(response.body.data).toHaveProperty('accountName');
    });
  });

  describe('POST /api/otp/token', () => {
    it('should generate a TOTP token', async () => {
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // First generate a secret
      const secretResponse = await request(app)
        .post('/api/otp/secret')
        .send({ userId: 'testuser' });
      
      // Log the response for debugging
      console.log('Secret response:', secretResponse.body);
      
      const encryptedSecret = secretResponse.body.data.secret;
      
      // Then generate a token
      const response = await request(app)
        .post('/api/otp/token')
        .send({ encryptedSecret })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.token).toMatch(/^\d{6}$/);
    });

    it('should return error for missing encrypted secret', async () => {
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await request(app)
        .post('/api/otp/token')
        .send({})
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bad Request');
    });
  });

  describe('POST /api/otp/validate', () => {
    it('should validate a correct TOTP token', async () => {
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // First generate a secret
      const secretResponse = await request(app)
        .post('/api/otp/secret')
        .send({ userId: 'testuser' });
      
      // Log the response for debugging
      console.log('Secret response:', secretResponse.body);
      
      // Check if we got a successful response
      if (!secretResponse.body.success) {
        throw new Error('Failed to generate secret: ' + JSON.stringify(secretResponse.body));
      }
      
      const encryptedSecret = secretResponse.body.data.secret;
      
      // Generate a token
      const tokenResponse = await request(app)
        .post('/api/otp/token')
        .send({ encryptedSecret });
      
      // Log the response for debugging
      console.log('Token response:', tokenResponse.body);
      
      // Check if we got a successful response
      if (!tokenResponse.body.success) {
        throw new Error('Failed to generate token: ' + JSON.stringify(tokenResponse.body));
      }
      
      const token = tokenResponse.body.data.token;
      
      // Validate the token
      const response = await request(app)
        .post('/api/otp/validate')
        .send({ encryptedSecret, token })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(true);
    });

    it('should reject an incorrect TOTP token', async () => {
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // First generate a secret
      const secretResponse = await request(app)
        .post('/api/otp/secret')
        .send({ userId: 'testuser' });
      
      // Check if we got a successful response
      if (!secretResponse.body.success) {
        throw new Error('Failed to generate secret: ' + JSON.stringify(secretResponse.body));
      }
      
      const encryptedSecret = secretResponse.body.data.secret;
      
      // Validate with wrong token
      const response = await request(app)
        .post('/api/otp/validate')
        .send({ encryptedSecret, token: '123456' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(false);
    });

    it('should return error for missing parameters', async () => {
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await request(app)
        .post('/api/otp/validate')
        .send({})
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bad Request');
    });
  });

  describe('POST /api/otp/send', () => {
    it('should send OTP via authenticator method', async () => {
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // First generate a secret
      const secretResponse = await request(app)
        .post('/api/otp/secret')
        .send({ userId: 'testuser' });
      
      // Check if we got a successful response
      if (!secretResponse.body.success) {
        throw new Error('Failed to generate secret: ' + JSON.stringify(secretResponse.body));
      }
      
      const encryptedSecret = secretResponse.body.data.secret;
      
      const response = await request(app)
        .post('/api/otp/send')
        .send({
          encryptedSecret,
          method: 'authenticator',
          destination: 'test@example.com'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('authenticator');
    });

    it('should return error for invalid delivery method', async () => {
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await request(app)
        .post('/api/otp/send')
        .send({
          encryptedSecret: 'test',
          method: 'invalid',
          destination: 'test@example.com'
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bad Request');
    });

    it('should return error for missing parameters', async () => {
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await request(app)
        .post('/api/otp/send')
        .send({})
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bad Request');
    });
  });
});