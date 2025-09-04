const rateLimitService = require('../services/rateLimitService');
const config = require('../config/config');

describe('Rate Limit Service', () => {
  const testKey = 'test-key';
  const limit = 5; // Use a smaller limit for testing
  const windowMs = 1000; // 1 second for testing

  beforeEach(() => {
    // Clear the memory store before each test
    rateLimitService.memoryStore.clear();
  });

  describe('isAllowed', () => {
    it('should allow requests within the limit', async () => {
      for (let i = 0; i < limit; i++) {
        const result = await rateLimitService.isAllowed(testKey, limit, windowMs);
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(limit - i - 1);
      }
    });

    it('should reject requests exceeding the limit', async () => {
      // Use all allowed requests
      for (let i = 0; i < limit; i++) {
        await rateLimitService.isAllowed(testKey, limit, windowMs);
      }

      // Next request should be rejected
      const result = await rateLimitService.isAllowed(testKey, limit, windowMs);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset the limit after the window expires', async () => {
      // Use all allowed requests
      for (let i = 0; i < limit; i++) {
        await rateLimitService.isAllowed(testKey, limit, windowMs);
      }

      // Next request should be rejected
      let result = await rateLimitService.isAllowed(testKey, limit, windowMs);
      expect(result.allowed).toBe(false);

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, windowMs + 100));

      // Next request should be allowed
      result = await rateLimitService.isAllowed(testKey, limit, windowMs);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(limit - 1);
    });
  });

  describe('getRateLimitInfo', () => {
    it('should return correct rate limit info', async () => {
      // Make one request
      await rateLimitService.isAllowed(testKey, limit, windowMs);

      const info = await rateLimitService.getRateLimitInfo(testKey, limit, windowMs);
      expect(info.limit).toBe(limit);
      expect(info.remaining).toBe(limit - 1);
    });

    it('should return default info for unused keys', async () => {
      const info = await rateLimitService.getRateLimitInfo('unused-key', limit, windowMs);
      expect(info.limit).toBe(limit);
      expect(info.remaining).toBe(limit);
    });
  });
});