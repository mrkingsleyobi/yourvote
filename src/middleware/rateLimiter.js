const rateLimitService = require('../services/rateLimitService');
const config = require('../config/config');

/**
 * Rate limiting middleware
 * @param {number} limit - Maximum number of requests
 * @param {number} windowMs - Time window in milliseconds
 */
const rateLimiter = (limit = config.rateLimit.max, windowMs = config.rateLimit.windowMs) => {
  return async (req, res, next) => {
    try {
      // Use user ID if available, otherwise fall back to IP address
      let key = req.ip || req.connection.remoteAddress;
      if (req.user && req.user.id) {
        key = `user:${req.user.id}`;
      } else if (req.body.userId) {
        key = `user:${req.body.userId}`;
      }
      
      const result = await rateLimitService.isAllowed(key, limit, windowMs);
      
      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': limit,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': Date.now() + result.resetIn
      });
      
      if (!result.allowed) {
        return res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          resetIn: result.resetIn
        });
      }
      
      next();
    } catch (error) {
      console.error('Rate limiting error:', error.message);
      // Fail open - allow the request through if rate limiting fails
      next();
    }
  };
};

module.exports = rateLimiter;