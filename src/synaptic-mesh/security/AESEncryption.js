const crypto = require('crypto');

class AESEncryption {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32; // 256 bits
    this.ivLength = 12;  // 96 bits for GCM
    this.authTagLength = 16; // 128 bits
  }

  // Generate a random encryption key
  generateKey() {
    return crypto.randomBytes(this.keyLength);
  }

  // Encrypt data using AES-256-GCM
  encrypt(plaintext, key) {
    try {
      // Generate a random initialization vector
      const iv = crypto.randomBytes(this.ivLength);
      
      // Create cipher
      const cipher = crypto.createCipherGCM(this.algorithm, key, iv);
      
      // Encrypt the data
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Get the authentication tag
      const authTag = cipher.getAuthTag();
      
      return {
        encryptedData: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Encryption failed:', error.message);
      throw error;
    }
  }

  // Decrypt data using AES-256-GCM
  decrypt(encryptedPacket, key) {
    try {
      const { encryptedData, iv, authTag } = encryptedPacket;
      
      // Create decipher
      const decipher = crypto.createDecipherGCM(this.algorithm, key, Buffer.from(iv, 'hex'));
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      
      // Decrypt the data
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error.message);
      throw error;
    }
  }

  // Encrypt an object
  encryptObject(obj, key) {
    const plaintext = JSON.stringify(obj);
    return this.encrypt(plaintext, key);
  }

  // Decrypt an object
  decryptObject(encryptedPacket, key) {
    const plaintext = this.decrypt(encryptedPacket, key);
    return JSON.parse(plaintext);
  }

  // Generate key from password using PBKDF2
  generateKeyFromPassword(password, salt, iterations = 100000) {
    return crypto.pbkdf2Sync(password, salt, iterations, this.keyLength, 'sha256');
  }

  // Securely store a key (in practice, use a key management system)
  storeKey(key, passphrase) {
    const salt = crypto.randomBytes(16);
    const keyEncryptionKey = this.generateKeyFromPassword(passphrase, salt);
    const encryptedKey = this.encrypt(key.toString('hex'), keyEncryptionKey);
    
    return {
      encryptedKey: encryptedKey,
      salt: salt.toString('hex'),
      timestamp: Date.now()
    };
  }

  // Retrieve a stored key
  retrieveKey(storedKeyData, passphrase) {
    const salt = Buffer.from(storedKeyData.salt, 'hex');
    const keyEncryptionKey = this.generateKeyFromPassword(passphrase, salt);
    const keyHex = this.decrypt(storedKeyData.encryptedKey, keyEncryptionKey);
    return Buffer.from(keyHex, 'hex');
  }

  // Get encryption configuration
  getConfiguration() {
    return {
      algorithm: this.algorithm,
      keyLength: this.keyLength,
      ivLength: this.ivLength,
      authTagLength: this.authTagLength,
      securityLevel: '256-bit'
    };
  }
}

// Export a singleton instance
module.exports = new AESEncryption();