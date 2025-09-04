class Agent {
  constructor(id, type, config = {}) {
    this.id = id;
    this.type = type;
    this.config = config;
    this.state = 'initialized';
    this.createdAt = new Date();
    this.lastActive = new Date();
  }

  async initialize() {
    this.state = 'ready';
    console.log(`Agent ${this.id} initialized`);
  }

  async execute(task) {
    this.state = 'executing';
    this.lastActive = new Date();
    
    try {
      const result = await this.processTask(task);
      this.state = 'ready';
      return result;
    } catch (error) {
      this.state = 'error';
      throw error;
    }
  }

  async processTask(task) {
    // To be implemented by specialized agents
    throw new Error('processTask must be implemented by specialized agents');
  }

  async shutdown() {
    this.state = 'shutdown';
    console.log(`Agent ${this.id} shutdown`);
  }
}

module.exports = Agent;