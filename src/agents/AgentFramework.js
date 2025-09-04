const AgentRegistry = require('./core/AgentRegistry');
const AgentCommunication = require('./core/AgentCommunication');
const MRAraloop = require('./loop/MRAraloop');
const RegistrationAgent = require('./specialized/RegistrationAgent');
const AuthenticationAgent = require('./specialized/AuthenticationAgent');
const BallotAgent = require('./specialized/BallotAgent');
const ValidationAgent = require('./specialized/ValidationAgent');
const TabulationAgent = require('./specialized/TabulationAgent');
const AuditAgent = require('./specialized/AuditAgent');
const VoteToken = require('../tokens/VoteToken');
const ValidToken = require('../tokens/ValidToken');
const StakingManager = require('../tokens/StakingManager');
const QuantumResistantCrypto = require('../crypto/QuantumResistantCrypto');
const ZeroKnowledgeProofs = require('../zkp/ZeroKnowledgeProofs');

class AgentFramework {
  constructor() {
    this.agentRegistry = new AgentRegistry();
    this.communication = new AgentCommunication();
    this.mraraLoop = new MRAraloop(this.agentRegistry, this.communication);
    this.voteToken = new VoteToken();
    this.validToken = new ValidToken();
    this.stakingManager = new StakingManager(this.validToken);
    this.crypto = new QuantumResistantCrypto();
    this.zkp = new ZeroKnowledgeProofs();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) {
      console.log('Agent framework already initialized');
      return;
    }

    // Initialize core components
    console.log('Initializing agent framework...');

    // Create and register specialized agents
    const registrationAgent = new RegistrationAgent('reg-001');
    const authenticationAgent = new AuthenticationAgent('auth-001');
    const ballotAgent = new BallotAgent('ballot-001');
    const validationAgent = new ValidationAgent('valid-001');
    const tabulationAgent = new TabulationAgent('tab-001');
    const auditAgent = new AuditAgent('audit-001');

    this.agentRegistry.registerAgent(registrationAgent);
    this.agentRegistry.registerAgent(authenticationAgent);
    this.agentRegistry.registerAgent(ballotAgent);
    this.agentRegistry.registerAgent(validationAgent);
    this.agentRegistry.registerAgent(tabulationAgent);
    this.agentRegistry.registerAgent(auditAgent);

    // Initialize staking manager
    this.stakingManager.createStakingPool('validation-pool', 0.05);
    this.stakingManager.createStakingPool('audit-pool', 0.03);

    // Initialize agents
    await registrationAgent.initialize();
    await authenticationAgent.initialize();
    await ballotAgent.initialize();
    await validationAgent.initialize();
    await tabulationAgent.initialize();
    await auditAgent.initialize();

    this.isInitialized = true;
    console.log('Agent framework initialized successfully');
  }

  async start() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    console.log('Starting agent framework...');
    
    // Start the M-R-A-R-A loop
    setImmediate(() => this.mraraLoop.start());
    
    console.log('Agent framework started');
  }

  async stop() {
    console.log('Stopping agent framework...');
    
    // Stop the M-R-A-R-A loop
    await this.mraraLoop.stop();
    
    // Shutdown all agents
    const agents = this.agentRegistry.getAllAgents();
    for (const agent of agents) {
      await agent.shutdown();
    }
    
    console.log('Agent framework stopped');
  }

  getAgent(id) {
    return this.agentRegistry.getAgent(id);
  }

  getAgentsByType(type) {
    return this.agentRegistry.getAgentsByType(type);
  }

  getAllAgents() {
    return this.agentRegistry.getAllAgents();
  }

  async sendMessage(senderId, receiverId, message) {
    return await this.communication.sendMessage(senderId, receiverId, message);
  }

  getVoteToken() {
    return this.voteToken;
  }

  getValidToken() {
    return this.validToken;
  }

  getStakingManager() {
    return this.stakingManager;
  }

  getCrypto() {
    return this.crypto;
  }

  getZKP() {
    return this.zkp;
  }
}

module.exports = AgentFramework;