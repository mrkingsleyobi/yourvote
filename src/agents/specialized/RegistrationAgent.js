const SpecializedAgent = require('../core/SpecializedAgent');

class RegistrationAgent extends SpecializedAgent {
  constructor(id, config = {}) {
    super(id, 'daa', 'registration', config);
    this.addCapability('user-registration');
    this.addCapability('voter-validation');
    this.registeredVoters = new Map();
  }

  async executeSpecializedTask(task) {
    switch (task.action) {
      case 'register-voter':
        return await this.registerVoter(task.data);
      case 'validate-voter':
        return await this.validateVoter(task.data);
      default:
        throw new Error(`Unknown action: ${task.action}`);
    }
  }

  async registerVoter(voterData) {
    // Validate voter data
    if (!voterData.id || !voterData.name) {
      throw new Error('Invalid voter data');
    }
    
    // Register voter
    this.registeredVoters.set(voterData.id, {
      ...voterData,
      registeredAt: new Date(),
      status: 'active'
    });
    
    console.log(`Voter ${voterData.id} registered`);
    return { success: true, voterId: voterData.id };
  }

  async validateVoter(voterId) {
    const voter = this.registeredVoters.get(voterId);
    if (!voter) {
      return { valid: false, reason: 'Voter not found' };
    }
    
    return { valid: true, voter };
  }
}

module.exports = RegistrationAgent;