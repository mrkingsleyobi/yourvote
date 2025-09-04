const redis = require('redis');
const config = require('../config/config');

class RateLimitService {
  constructor() {
    this.redisClient = null;
    this.memoryStore = new Map();
    
    // Try to connect to Redis
    this.initRedis();
  }

  /**
   * Initialize Redis connection
   */
  async initRedis() {
    try {
      // Only try to connect if Redis host is configured
      if (config.redis.host && config.redis.host !== 'localhost') {
        this.redisClient = redis.createClient({
          host: config.redis.host,
          port: config.redis.port,
          password: config.redis.password
        });
        
        await this.redisClient.connect();
        console.log('Connected to Redis for rate limiting');
      } else {
        console.log('Using in-memory store for rate limiting');
      }
    } catch (error) {
      console.warn('Failed to connect to Redis, using in-memory store:', error.message);
      this.redisClient = null;
    }
  }

  /**
   * Check if a request is within rate limits
   * @param {string} key - Unique identifier (e.g., IP address, user ID)
   * @param {number} limit - Maximum number of requests
   * @param {number} windowMs - Time window in milliseconds
   * @returns {Object} Result with allowed flag and remaining requests
   */
  async isAllowed(key, limit, windowMs) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (this.redisClient) {
      return await this.isAllowedRedis(key, limit, windowMs, now, windowStart);
    } else {
      return this.isAllowedMemory(key, limit, windowMs, now, windowStart);
    }
  }

  /**
   * Check rate limit using Redis
   */
  async isAllowedRedis(key, limit, windowMs, now, windowStart) {
    const redisKey = `rate_limit:${key}`;
    
    try {
      // Remove old entries
      await this.redisClient.zRemRangeByScore(redisKey, 0, windowStart);
      
      // Get current count
      const currentCount = await this.redisClient.zCard(redisKey);
      
      if (currentCount >= limit) {
        // Get time until oldest request expires
        const oldest = await this.redisClient.zRange(redisKey, 0, 0, { withScores: true });
        const resetTime = oldest.length > 1 ? parseInt(oldest[1]) + windowMs : now;
        const resetIn = Math.max(0, resetTime - now);
        
        return {
          allowed: false,
          remaining: 0,
          resetIn: resetIn
        };
      }
      
      // Add current request
      await this.redisClient.zAdd(redisKey, { score: now, value: now.toString() });
      await this.redisClient.expire(redisKey, Math.ceil(windowMs / 1000));
      
      return {
        allowed: true,
        remaining: limit - currentCount - 1,
        resetIn: windowMs
      };
    } catch (error) {
      console.error('Redis rate limiting error, falling back to memory:', error.message);
      return this.isAllowedMemory(key, limit, windowMs, now, windowStart);
    }
  }

  /**
   * Check rate limit using in-memory store
   */
  isAllowedMemory(key, limit, windowMs, now, windowStart) {
    // Clean up old entries
    if (this.memoryStore.has(key)) {
      const requests = this.memoryStore.get(key);
      const validRequests = requests.filter(timestamp => timestamp > windowStart);
      
      if (validRequests.length >= limit) {
        const oldest = validRequests[0];
        const resetTime = oldest + windowMs;
        const resetIn = Math.max(0, resetTime - now);
        
        return {
          allowed: false,
          remaining: 0,
          resetIn: resetIn
        };
      }
      
      validRequests.push(now);
      this.memoryStore.set(key, validRequests);
      
      return {
        allowed: true,
        remaining: limit - validRequests.length,
        resetIn: windowMs
      };
    } else {
      this.memoryStore.set(key, [now]);
      return {
        allowed: true,
        remaining: limit - 1,
        resetIn: windowMs
      };
    }
  }

  /**
   * Get rate limit info
   * @param {string} key - Unique identifier
   * @param {number} limit - Maximum number of requests (optional, defaults to config)
   * @param {number} windowMs - Time window in milliseconds (optional, defaults to config)
   * @returns {Object} Rate limit information
   */
  async getRateLimitInfo(key, limit = config.rateLimit.max, windowMs = config.rateLimit.windowMs) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (this.redisClient) {
      const redisKey = `rate_limit:${key}`;
      try {
        await this.redisClient.zRemRangeByScore(redisKey, 0, windowStart);
        const currentCount = await this.redisClient.zCard(redisKey);
        
        return {
          limit: limit,
          remaining: Math.max(0, limit - currentCount),
          resetIn: windowMs
        };
      } catch (error) {
        console.error('Redis error getting rate limit info:', error.message);
        return null;
      }
    } else {
      if (this.memoryStore.has(key)) {
        const requests = this.memoryStore.get(key);
        const validRequests = requests.filter(timestamp => timestamp > windowStart);
        return {
          limit: limit,
          remaining: Math.max(0, limit - validRequests.length),
          resetIn: windowMs
        };
      } else {
        return {
          limit: limit,
          remaining: limit,
          resetIn: windowMs
        };
      }
    }
  }
}

module.exports = new RateLimitService();