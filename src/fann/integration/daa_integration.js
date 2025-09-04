/**
 * Decentralized Autonomous Agents (DAA) Integration for ruv-FANN
 * Enables coordination with DAA framework and validation agents
 * Updated to require JWT authentication for all agent communications
 */

class DAAIntegration {
  /**
   * Create DAA integration
   * @param {Object} daaConfig - Configuration for DAA integration
   */
  constructor(daaConfig = {}) {
    this.agents = (daaConfig.agents || []).map(agent => {
      // Ensure all agents have authentication tokens
      if (!agent.jwtToken) {
        return registerAuthenticatedAgent(agent);
      }
      return agent;
    });
    this.coordinationProtocol = daaConfig.protocol || 'mrara-loop';
    this.consensusThreshold = daaConfig.consensusThreshold || 0.66; // 2/3 consensus
    this.timeout = daaConfig.timeout || 10000; // 10 seconds
    this.retryAttempts = daaConfig.retryAttempts || 3;
  }
  
  /**
   * Submit vote data to validation agents
   * @param {Object} voteData - Vote data to validate
   * @returns {Promise<Object>} Validation consensus result
   */
  async submitToValidationAgents(voteData) {
    // Filter for validation agents only
    const validationAgents = this.agents.filter(agent => 
      agent.type === 'validation' || agent.capabilities?.includes('validation')
    );
    
    if (validationAgents.length === 0) {
      throw new Error('No validation agents available');
    }
    
    // Submit vote to multiple validation agents
    const validationPromises = validationAgents.map(agent => 
      this.submitToAgent(agent, voteData)
    );
    
    // Wait for all validations with timeout
    const validationResults = await this.waitForAllWithTimeout(
      validationPromises, 
      this.timeout
    );
    
    // Process results through consensus
    return this.processValidationConsensus(validationResults, voteData);
  }
  
  /**
   * Submit data to a specific agent
   * @param {Object} agent - Agent to submit to
   * @param {Object} data - Data to submit
   * @param {number} attempt - Current attempt number
   * @returns {Promise<Object>} Agent response
   */
  async submitToAgent(agent, data, attempt = 1) {
    try {
      // Require JWT authentication for agent communications
      if (!agent.jwtToken) {
        throw new Error(`Agent ${agent.id} missing required JWT authentication token`);
      }
      
      // Verify the JWT token before communication
      const { verifyToken } = require('../../utils/authUtils');
const { registerAuthenticatedAgent } = require('../../utils/agentAuthUtils');
      const decoded = verifyToken(agent.jwtToken);
      
      if (!decoded) {
        throw new Error(`Agent ${agent.id} has invalid or expired authentication token`);
      }
      
      // Add authentication headers to the request
      const authHeaders = {
        'Authorization': `Bearer ${agent.jwtToken}`,
        'Content-Type': 'application/json'
      };
      
      // In a real implementation, this would make an actual authenticated request to the agent
      // For now, we'll simulate agent responses with authentication
      return await this.simulateAgentResponse(agent, data, authHeaders);
    } catch (error) {
      // Retry on failure
      if (attempt < this.retryAttempts) {
        console.warn(`Agent ${agent.id} failed, retrying (${attempt}/${this.retryAttempts}):`, error.message);
        await this.delay(1000 * attempt); // Exponential backoff
        return await this.submitToAgent(agent, data, attempt + 1);
      } else {
        throw new Error(`Agent ${agent.id} failed after ${this.retryAttempts} attempts: ${error.message}`);
      }
    }
  }
  
  /**
   * Simulate agent response for demonstration
   * @param {Object} agent - Agent to simulate
   * @param {Object} data - Data to process
   * @param {Object} authHeaders - Authentication headers
   * @returns {Promise<Object>} Simulated response
   */
  async simulateAgentResponse(agent, data, authHeaders = {}) {
    // Simulate processing delay
    await this.delay(Math.random() * 200 + 50); // 50-250ms delay
    
    // Simulate authentication verification
    if (authHeaders['Authorization']) {
      // In a real implementation, the agent would verify the JWT token
      // For simulation, we'll just log that authentication is being used
      console.log(`Agent ${agent.id} verifying authentication token`);
    }
    
    // Simulate validation result
    const isValid = Math.random() > 0.1; // 90% valid votes
    const confidence = Math.random() * 0.7 + 0.3; // 30-100% confidence
    
    // Simulate agent-specific characteristics
    const response = {
      agentId: agent.id,
      timestamp: Date.now(),
      valid: isValid,
      confidence: confidence,
      authenticated: !!authHeaders['Authorization'],
      analysis: {
        // Simulate some analysis results
        consistency: Math.random() > 0.2 ? 'high' : 'medium',
        patternMatch: Math.random() > 0.1 ? 'match' : 'partial',
        riskScore: Math.random() * 0.5 // 0-0.5 risk score
      }
    };
    
    // Simulate occasional agent failures
    if (Math.random() < 0.05) { // 5% failure rate
      throw new Error('Agent temporarily unavailable');
    }
    
    return response;
  }
  
  /**
   * Wait for all promises with timeout
   * @param {Promise[]} promises - Promises to wait for
   * @param {number} timeoutMs - Timeout in milliseconds
   * @returns {Promise<Object[]>} Settled promise results
   */
  async waitForAllWithTimeout(promises, timeoutMs) {
    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout waiting for agent responses')), timeoutMs);
    });
    
    // Race promises against timeout
    try {
      const results = await Promise.race([
        Promise.allSettled(promises),
        timeoutPromise
      ]);
      
      return results;
    } catch (error) {
      // If we timeout, still return partial results if any
      return Promise.allSettled(promises);
    }
  }
  
  /**
   * Process validation consensus from multiple agents
   * @param {Object[]} results - Validation results from agents
   * @param {Object} voteData - Original vote data
   * @returns {Object} Consensus result
   */
  processValidationConsensus(results, voteData) {
    // Separate successful and failed validations
    const successful = results.filter(r => 
      r.status === 'fulfilled' && r.value
    ).map(r => r.value);
    
    const failed = results.filter(r => 
      r.status === 'rejected'
    ).map(r => r.reason);
    
    // Calculate consensus
    const validCount = successful.filter(r => r.valid).length;
    const totalCount = successful.length;
    const consensus = totalCount > 0 ? validCount / totalCount : 0;
    const overallConsensus = consensus >= this.consensusThreshold;
    
    // Calculate average confidence
    const avgConfidence = successful.length > 0 
      ? successful.reduce((sum, r) => sum + r.confidence, 0) / successful.length
      : 0;
    
    // Aggregate analysis results
    const aggregatedAnalysis = this.aggregateAnalysisResults(successful);
    
    return {
      voteId: voteData.id,
      consensus: overallConsensus,
      confidence: avgConfidence,
      validationRate: totalCount / this.agents.filter(a => a.type === 'validation').length,
      validCount,
      totalCount,
      successful,
      failed,
      analysis: aggregatedAnalysis,
      timestamp: Date.now()
    };
  }
  
  /**
   * Aggregate analysis results from multiple agents
   * @param {Object[]} results - Successful validation results
   * @returns {Object} Aggregated analysis
   */
  aggregateAnalysisResults(results) {
    if (results.length === 0) return {};
    
    const aggregated = {};
    
    // Aggregate numerical values
    const numericFields = ['confidence', 'riskScore'];
    for (const field of numericFields) {
      const values = results
        .map(r => r.analysis?.[field])
        .filter(v => typeof v === 'number' && !isNaN(v));
      
      if (values.length > 0) {
        aggregated[field] = {
          average: values.reduce((sum, v) => sum + v, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length
        };
      }
    }
    
    // Aggregate categorical values
    const categoricalFields = ['consistency', 'patternMatch'];
    for (const field of categoricalFields) {
      const counts = {};
      let total = 0;
      
      for (const result of results) {
        const value = result.analysis?.[field];
        if (value) {
          counts[value] = (counts[value] || 0) + 1;
          total++;
        }
      }
      
      if (total > 0) {
        // Convert to percentages
        const percentages = {};
        for (const [key, count] of Object.entries(counts)) {
          percentages[key] = (count / total) * 100;
        }
        
        aggregated[field] = {
          distribution: percentages,
          majority: Object.keys(counts).reduce((a, b) => 
            counts[a] > counts[b] ? a : b
          ),
          total
        };
      }
    }
    
    return aggregated;
  }
  
  /**
   * Submit vote to tabulation agents
   * @param {Object} voteData - Vote data to tabulate
   * @returns {Promise<Object>} Tabulation result
   */
  async submitToTabulationAgents(voteData) {
    const tabulationAgents = this.agents.filter(agent => 
      agent.type === 'tabulation' || agent.capabilities?.includes('tabulation')
    );
    
    if (tabulationAgents.length === 0) {
      throw new Error('No tabulation agents available');
    }
    
    // Submit to all tabulation agents
    const tabulationPromises = tabulationAgents.map(agent => 
      this.submitToAgent(agent, voteData)
    );
    
    const tabulationResults = await Promise.allSettled(tabulationPromises);
    
    // Process tabulation results
    return this.processTabulationResults(tabulationResults);
  }
  
  /**
   * Process tabulation results
   * @param {Object[]} results - Tabulation results
   * @returns {Object} Aggregated tabulation
   */
  processTabulationResults(results) {
    const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value);
    const failed = results.filter(r => r.status === 'rejected').map(r => r.reason);
    
    // Aggregate tabulation data
    const aggregated = {
      voteCount: successful.length,
      candidates: {},
      timestamp: Date.now()
    };
    
    // Sum votes for each candidate
    for (const result of successful) {
      if (result.vote?.candidate) {
        const candidate = result.vote.candidate;
        aggregated.candidates[candidate] = (aggregated.candidates[candidate] || 0) + 1;
      }
    }
    
    return {
      ...aggregated,
      successful,
      failed,
      successRate: successful.length / results.length
    };
  }
  
  /**
   * Register a new agent with authentication
   * @param {Object} agent - Agent to register
   */
  registerAgent(agent) {
    // Register agent with authentication
    const authenticatedAgent = registerAuthenticatedAgent(agent);
    
    // Check if agent already exists
    const existingIndex = this.agents.findIndex(a => a.id === authenticatedAgent.id);
    if (existingIndex >= 0) {
      // Update existing agent
      this.agents[existingIndex] = authenticatedAgent;
    } else {
      // Add new agent
      this.agents.push(authenticatedAgent);
    }
    
    return authenticatedAgent;
  }
  
  /**
   * Remove an agent
   * @param {string} agentId - ID of agent to remove
   * @returns {boolean} Whether agent was removed
   */
  removeAgent(agentId) {
    const initialLength = this.agents.length;
    this.agents = this.agents.filter(agent => agent.id !== agentId);
    return this.agents.length < initialLength;
  }
  
  /**
   * Get agent by ID
   * @param {string} agentId - Agent ID
   * @returns {Object|null} Agent or null if not found
   */
  getAgent(agentId) {
    return this.agents.find(agent => agent.id === agentId) || null;
  }
  
  /**
   * Get agents by type
   * @param {string} type - Agent type
   * @returns {Object[]} Agents of specified type
   */
  getAgentsByType(type) {
    return this.agents.filter(agent => agent.type === type);
  }
  
  /**
   * Simple delay function
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>} Promise that resolves after delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Get DAA integration statistics
   * @returns {Object} Statistics
   */
  getStatistics() {
    const validationAgents = this.getAgentsByType('validation');
    const tabulationAgents = this.getAgentsByType('tabulation');
    
    return {
      totalAgents: this.agents.length,
      validationAgents: validationAgents.length,
      tabulationAgents: tabulationAgents.length,
      consensusThreshold: this.consensusThreshold,
      timeout: this.timeout,
      retryAttempts: this.retryAttempts
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DAAIntegration;
}