const { generateToken } = require('../utils/authUtils');

/**
 * Generate authentication token for an agent
 * @param {Object} agent - Agent object
 * @param {string} agent.id - Agent ID
 * @param {string} agent.type - Agent type
 * @param {string} agent.role - Agent role (default: 'agent')
 * @returns {string} JWT token for agent authentication
 */
const generateAgentToken = (agent) => {
  const agentUser = {
    id: agent.id,
    type: agent.type,
    role: agent.role || 'agent',
    capabilities: agent.capabilities || []
  };
  
  return generateToken(agentUser);
};

/**
 * Register an agent with authentication
 * @param {Object} agent - Agent to register
 * @param {string} agent.id - Agent ID
 * @param {string} agent.type - Agent type
 * @param {Array} agent.capabilities - Agent capabilities
 * @returns {Object} Registered agent with authentication token
 */
const registerAuthenticatedAgent = (agent) => {
  // Validate required fields
  if (!agent.id || !agent.type) {
    throw new Error('Agent must have id and type');
  }
  
  // Generate authentication token
  const jwtToken = generateAgentToken(agent);
  
  // Return agent with authentication token
  return {
    ...agent,
    jwtToken: jwtToken,
    registeredAt: Date.now()
  };
};

module.exports = {
  generateAgentToken,
  registerAuthenticatedAgent
};