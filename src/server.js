const express = require('express');
const dotenv = require('dotenv');
const otpRoutes = require('./routes/otpRoutes');
const kycRoutes = require('./routes/kycRoutes');
const authRoutes = require('./routes/authRoutes');
const { authenticate } = require('./middleware/auth');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AI-Native Election Voting System is running' });
});

// Authentication routes (no authentication required)
app.use('/api/auth', authRoutes);

// Apply authentication middleware to all other API routes
app.use('/api/otp', authenticate, otpRoutes);
app.use('/api/kyc', authenticate, kycRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'Route not found'
  });
});

// Only start server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`AI-Native Election Voting System running on port ${PORT}`);
    console.log('All API routes require authentication');
  });
}

module.exports = app;