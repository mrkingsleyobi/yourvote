# OTP Service Implementation

This is a secure OTP (One-Time Password) service implementation using the TOTP standard (RFC 6238) with the speakeasy.js library.

## Features

- TOTP (Time-based One-Time Password) generation and validation
- Secure secret storage with AES-256 encryption
- Rate limiting with Redis or in-memory store
- REST API endpoints for OTP generation and validation
- Multiple delivery methods (SMS, Email, Authenticator apps)
- Comprehensive error handling and input validation
- Unit and integration tests with high code coverage

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Redis (optional, for distributed rate limiting)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd yourvote
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file and configure it:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file to set your configuration values.

## Usage

1. Start the server:
   ```bash
   npm start
   ```
   or for development with auto-restart:
   ```bash
   npm run dev
   ```

2. The API will be available at `http://localhost:3000`

## API Endpoints

### Generate OTP Secret
```
POST /api/otp/secret
```
Generates a new OTP secret and QR code URL for authenticator apps.

### Generate TOTP Token
```
POST /api/otp/token
```
Generates a TOTP token from an encrypted secret.

### Validate TOTP Token
```
POST /api/otp/validate
```
Validates a TOTP token against an encrypted secret.

### Send OTP
```
POST /api/otp/send
```
Sends an OTP via the specified delivery method (SMS, Email, or Authenticator app).

## Security Features

- Secrets are encrypted using AES-256 before storage
- Rate limiting to prevent abuse
- Input validation and sanitization
- Secure token generation following RFC 6238
- Error handling that doesn't leak sensitive information

## Testing

Run the test suite:
```bash
npm test
```

## Dependencies

- express: Web framework
- speakeasy: TOTP implementation
- crypto: Built-in Node.js module for encryption
- bcryptjs: Password hashing
- redis: Rate limiting storage
- jsonwebtoken: JWT implementation
- dotenv: Environment variable management

## Development Dependencies

- jest: Testing framework
- supertest: HTTP assertions for testing
- nodemon: Development server with auto-restart

## License

This project is licensed under the ISC License.