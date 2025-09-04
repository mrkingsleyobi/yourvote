class AgentCommunication {
  constructor() {
    this.messageQueue = [];
  }

  async sendMessage(senderId, receiverId, message, priority = 'normal') {
    const envelope = {
      id: this.generateMessageId(),
      senderId,
      receiverId,
      message,
      priority,
      timestamp: new Date(),
      status: 'queued'
    };
    
    this.messageQueue.push(envelope);
    console.log(`Message queued from ${senderId} to ${receiverId}`);
    
    // Process message asynchronously
    setImmediate(() => this.processMessage(envelope));
    
    return envelope.id;
  }

  async processMessage(envelope) {
    try {
      envelope.status = 'processing';
      // In a real implementation, this would send to the actual agent
      console.log(`Processing message from ${envelope.senderId} to ${envelope.receiverId}`);
      envelope.status = 'delivered';
    } catch (error) {
      envelope.status = 'failed';
      console.error(`Failed to process message: ${error.message}`);
    }
  }

  generateMessageId() {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getPendingMessages() {
    return this.messageQueue.filter(msg => msg.status === 'queued');
  }
}

module.exports = AgentCommunication;