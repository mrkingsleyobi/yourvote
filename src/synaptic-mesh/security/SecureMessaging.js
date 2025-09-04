const crypto = require('crypto');

class SecureMessaging {
  constructor() {
    this.encryptionAlgorithm = 'aes-256-gcm';
    this.key = crypto.randomBytes(32); // In production, this should be securely managed
    this.ivLength = 12;
  }

  // Encrypt a message
  encryptMessage(message, recipientPublicKey) {
    try {
      // Generate a random initialization vector
      const iv = crypto.randomBytes(this.ivLength);
      
      // Create cipher
      const cipher = crypto.createCipherGCM(this.encryptionAlgorithm, this.key, iv);
      
      // Encrypt the message
      let encrypted = cipher.update(JSON.stringify(message), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Get the authentication tag
      const authTag = cipher.getAuthTag();
      
      // In a real implementation, we would also encrypt with the recipient's public key
      // For now, we'll just return the encrypted data with IV and auth tag
      return {
        encryptedData: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Encryption failed: ${error.message}`);
      throw error;
    }
  }

  // Decrypt a message
  decryptMessage(encryptedPacket, privateKey) {
    try {
      const { encryptedData, iv, authTag } = encryptedPacket;
      
      // Create decipher
      const decipher = crypto.createDecipherGCM(this.encryptionAlgorithm, this.key, Buffer.from(iv, 'hex'));
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      
      // Decrypt the message
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      // Parse the JSON message
      return JSON.parse(decrypted);
    } catch (error) {
      console.error(`Decryption failed: ${error.message}`);
      throw error;
    }
  }

  // Sign a message for authentication
  signMessage(message, privateKey) {
    try {
      const messageString = JSON.stringify(message);
      const signature = crypto.sign('sha256', Buffer.from(messageString), privateKey);
      
      return {
        message: message,
        signature: signature.toString('hex'),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Message signing failed: ${error.message}`);
      throw error;
    }
  }

  // Verify a signed message
  verifyMessage(signedMessage, publicKey) {
    try {
      const { message, signature } = signedMessage;
      const messageString = JSON.stringify(message);
      const verified = crypto.verify('sha256', Buffer.from(messageString), publicKey, Buffer.from(signature, 'hex'));
      
      return {
        verified,
        message,
        timestamp: signedMessage.timestamp
      };
    } catch (error) {
      console.error(`Message verification failed: ${error.message}`);
      return {
        verified: false,
        message: signedMessage.message,
        timestamp: signedMessage.timestamp
      };
    }
  }

  // Send a secure message between nodes
  async sendSecureMessage(senderNode, recipientNode, message) {
    try {
      // Sign the message
      // const signedMessage = this.signMessage(message, senderNode.privateKey);
      
      // Encrypt the message
      // const encryptedMessage = this.encryptMessage(signedMessage, recipientNode.publicKey);
      
      // In a real implementation, this would send the encrypted message over the network
      console.log(`Secure message sent from ${senderNode.id} to ${recipientNode.id}`);
      
      // For demo purposes, we'll just return a mock result
      return {
        success: true,
        messageId: crypto.randomUUID(),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Failed to send secure message: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate key pair for a node
  generateKeyPair() {
    // In a real implementation, this would generate actual RSA or ECC key pairs
    // For demo purposes, we'll generate mock keys
    return {
      publicKey: `mock-public-key-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      privateKey: `mock-private-key-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }
}

module.exports = SecureMessaging;