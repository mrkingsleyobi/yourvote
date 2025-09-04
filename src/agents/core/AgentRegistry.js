const Agent = require('./Agent');

class AgentRegistry {
  constructor() {
    this.agents = new Map();
    this.agentTypes = new Set();
  }

  registerAgent(agent) {
    if (!(agent instanceof Agent)) {
      throw new Error('Only Agent instances can be registered');
    }
    
    this.agents.set(agent.id, agent);
    this.agentTypes.add(agent.type);
    console.log(`Agent ${agent.id} registered`);
  }

  getAgent(id) {
    return this.agents.get(id);
  }

  getAgentsByType(type) {
    return Array.from(this.agents.values()).filter(agent => agent.type === type);
  }

  getAllAgents() {
    return Array.from(this.agents.values());
  }

  removeAgent(id) {
    const agent = this.agents.get(id);
    if (agent) {
      this.agents.delete(id);
      console.log(`Agent ${id} removed`);
    }
  }

  getAgentTypes() {
    return Array.from(this.agentTypes);
  }
}

module.exports = AgentRegistry;