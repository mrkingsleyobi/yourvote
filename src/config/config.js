module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your-default-jwt-secret',
  encryptionKey: process.env.ENCRYPTION_KEY || 'your-default-encryption-key-that-is-32-characters-long!!',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null
  },
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW || 3600000, // 1 hour (10 requests per hour per user)
    max: process.env.RATE_LIMIT_MAX || 10 // limit each user to 10 requests per hour
  }
};