const Agent = require('../core/Agent');

class SpecializedAgent extends Agent {
  constructor(id, type, specialization, config = {}) {
    super(id, type, config);
    this.specialization = specialization;
    this.capabilities = [];
  }

  addCapability(capability) {
    this.capabilities.push(capability);
  }

  hasCapability(capability) {
    return this.capabilities.includes(capability);
  }

  async processTask(task) {
    // Default implementation - should be overridden by specific agents
    if (!this.hasCapability(task.requiredCapability)) {
      throw new Error(`Agent ${this.id} does not have required capability: ${task.requiredCapability}`);
    }
    
    return await this.executeSpecializedTask(task);
  }

  async executeSpecializedTask(task) {
    // To be implemented by specific agent types
    throw new Error('executeSpecializedTask must be implemented by specific agent types');
  }
}

module.exports = SpecializedAgent;