const otpService = require('../src/services/otpService');

// Example usage of the OTP service
async function example() {
  console.log('=== OTP Service Example ===\n');
  
  // 1. Generate a new secret
  console.log('1. Generating a new OTP secret...');
  const secret = otpService.generateSecret();
  console.log('Generated secret (base32):', secret.base32);
  console.log('QR Code URL:', secret.otpauth_url);
  console.log();
  
  // 2. Encrypt the secret for secure storage
  console.log('2. Encrypting the secret for secure storage...');
  const encryptedSecret = otpService.encryptSecret(secret.base32);
  console.log('Encrypted secret:', encryptedSecret);
  console.log();
  
  // 3. Decrypt the secret
  console.log('3. Decrypting the secret...');
  const decryptedSecret = otpService.decryptSecret(encryptedSecret);
  console.log('Decrypted secret:', decryptedSecret);
  console.log('Matches original:', decryptedSecret === secret.base32);
  console.log();
  
  // 4. Generate a TOTP token
  console.log('4. Generating a TOTP token...');
  const token = otpService.generateTOTP(secret.base32);
  console.log('Generated token:', token);
  console.log();
  
  // 5. Verify the token
  console.log('5. Verifying the token...');
  const isValid = otpService.verifyTOTP(secret.base32, token);
  console.log('Token is valid:', isValid);
  console.log();
  
  // 6. Try verifying an invalid token
  console.log('6. Verifying an invalid token...');
  const isInvalid = otpService.verifyTOTP(secret.base32, '123456');
  console.log('Invalid token is valid:', isInvalid);
  console.log();
  
  console.log('=== Example Complete ===');
}

// Run the example
example().catch(console.error);