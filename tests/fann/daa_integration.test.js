/**
 * Tests for DAA Integration Implementation
 */

const DAAIntegration = require('../../src/fann/integration/daa_integration.js');

describe('DAA Integration Implementation', () => {
  let daaIntegration;
  
  beforeEach(() => {
    daaIntegration = new DAAIntegration({
      agents: [
        { id: 'agent-1', type: 'validation', capabilities: ['validation'], reputation: 0.9 },
        { id: 'agent-2', type: 'validation', capabilities: ['validation'], reputation: 0.8 },
        { id: 'agent-3', type: 'tabulation', capabilities: ['tabulation'], reputation: 0.95 },
        { id: 'agent-4', type: 'validation', capabilities: ['validation'], reputation: 0.7 }
      ],
      protocol: 'mrara-loop',
      consensusThreshold: 0.66,
      timeout: 5000,
      retryAttempts: 3
    });
  });
  
  test('should initialize with correct configuration', () => {
    expect(daaIntegration.agents).toHaveLength(4);
    expect(daaIntegration.coordinationProtocol).toBe('mrara-loop');
    expect(daaIntegration.consensusThreshold).toBe(0.66);
    expect(daaIntegration.timeout).toBe(5000);
    expect(daaIntegration.retryAttempts).toBe(3);
  });
  
  test('should submit to validation agents', async () => {
    const voteData = {
      id: 'vote-001',
      candidate: 'candidate-A',
      timestamp: Date.now()
    };
    
    const result = await daaIntegration.submitToValidationAgents(voteData);
    
    expect(result).toHaveProperty('voteId', 'vote-001');
    expect(result).toHaveProperty('consensus');
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('validCount');
    expect(result).toHaveProperty('totalCount');
    expect(result).toHaveProperty('successful');
    expect(result).toHaveProperty('failed');
    expect(result).toHaveProperty('analysis');
  });
  
  test('should submit to specific agent', async () => {
    const agent = daaIntegration.agents[0];
    const data = { test: 'data' };
    
    const result = await daaIntegration.submitToAgent(agent, data);
    
    expect(result).toHaveProperty('agentId', 'agent-1');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('analysis');
  });
  
  test('should handle agent submission failures with retries', async () => {
    // Mock an agent that fails twice then succeeds
    let attemptCount = 0;
    const failingAgent = {
      id: 'failing-agent',
      type: 'validation'
    };
    
    // Mock the simulateAgentResponse to fail twice then succeed
    daaIntegration.simulateAgentResponse = jest.fn().mockImplementation(async () => {
      attemptCount++;
      if (attemptCount <= 2) {
        throw new Error('Temporary failure');
      }
      return {
        agentId: 'failing-agent',
        timestamp: Date.now(),
        valid: true,
        confidence: 0.9,
        analysis: {}
      };
    });
    
    const data = { test: 'data' };
    
    // This should succeed after retries
    const result = await daaIntegration.submitToAgent(failingAgent, data);
    
    expect(result).toHaveProperty('agentId', 'failing-agent');
    expect(result).toHaveProperty('valid', true);
    expect(daaIntegration.simulateAgentResponse).toHaveBeenCalledTimes(3);
  });
  
  test('should process validation consensus', () => {
    const mockResults = [
      { status: 'fulfilled', value: { valid: true, confidence: 0.9 } },
      { status: 'fulfilled', value: { valid: true, confidence: 0.8 } },
      { status: 'fulfilled', value: { valid: false, confidence: 0.7 } },
      { status: 'rejected', reason: new Error('Failed') }
    ];
    
    const voteData = { id: 'vote-001' };
    
    const result = daaIntegration.processValidationConsensus(mockResults, voteData);
    
    expect(result).toHaveProperty('voteId', 'vote-001');
    expect(result).toHaveProperty('consensus');
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('validationRate');
    expect(result).toHaveProperty('validCount');
    expect(result).toHaveProperty('totalCount');
    expect(result).toHaveProperty('successful');
    expect(result).toHaveProperty('failed');
    expect(result).toHaveProperty('analysis');
  });
  
  test('should aggregate analysis results', () => {
    const mockResults = [
      {
        analysis: {
          confidence: 0.9,
          riskScore: 0.1,
          consistency: 'high',
          patternMatch: 'match'
        }
      },
      {
        analysis: {
          confidence: 0.8,
          riskScore: 0.2,
          consistency: 'high',
          patternMatch: 'partial'
        }
      },
      {
        analysis: {
          confidence: 0.7,
          riskScore: 0.3,
          consistency: 'medium',
          patternMatch: 'match'
        }
      }
    ];
    
    const aggregated = daaIntegration.aggregateAnalysisResults(mockResults);
    
    expect(aggregated).toHaveProperty('confidence');
    expect(aggregated).toHaveProperty('riskScore');
    expect(aggregated).toHaveProperty('consistency');
    expect(aggregated).toHaveProperty('patternMatch');
    
    // Check numeric aggregations
    expect(aggregated.confidence).toHaveProperty('average');
    expect(aggregated.confidence).toHaveProperty('min');
    expect(aggregated.confidence).toHaveProperty('max');
    expect(aggregated.confidence).toHaveProperty('count');
    
    // Check categorical aggregations
    expect(aggregated.consistency).toHaveProperty('distribution');
    expect(aggregated.consistency).toHaveProperty('majority');
    expect(aggregated.consistency).toHaveProperty('total');
  });
  
  test('should submit to tabulation agents', async () => {
    const voteData = {
      id: 'vote-001',
      candidate: 'candidate-A',
      timestamp: Date.now()
    };
    
    const result = await daaIntegration.submitToTabulationAgents(voteData);
    
    expect(result).toHaveProperty('voteCount');
    expect(result).toHaveProperty('candidates');
    expect(result).toHaveProperty('successful');
    expect(result).toHaveProperty('failed');
    expect(result).toHaveProperty('successRate');
  });
  
  test('should register and manage agents', () => {
    const newAgent = {
      id: 'agent-5',
      type: 'validation',
      capabilities: ['validation']
    };
    
    // Initially should have 4 agents
    expect(daaIntegration.agents).toHaveLength(4);
    
    // Register new agent
    daaIntegration.registerAgent(newAgent);
    
    // Should now have 5 agents
    expect(daaIntegration.agents).toHaveLength(5);
    
    // Get agent by ID
    const retrievedAgent = daaIntegration.getAgent('agent-5');
    expect(retrievedAgent).toEqual(newAgent);
    
    // Get agents by type
    const validationAgents = daaIntegration.getAgentsByType('validation');
    expect(validationAgents).toHaveLength(4);
    
    // Remove agent
    const removed = daaIntegration.removeAgent('agent-5');
    expect(removed).toBe(true);
    expect(daaIntegration.agents).toHaveLength(4);
  });
  
  test('should handle agent registration updates', () => {
    const existingAgent = daaIntegration.agents[0];
    const updatedAgent = {
      ...existingAgent,
      reputation: 0.95,
      status: 'active'
    };
    
    // Update existing agent
    daaIntegration.registerAgent(updatedAgent);
    
    // Should still have 4 agents
    expect(daaIntegration.agents).toHaveLength(4);
    
    // Updated agent should have new properties
    const retrievedAgent = daaIntegration.getAgent(existingAgent.id);
    expect(retrievedAgent.reputation).toBe(0.95);
    expect(retrievedAgent.status).toBe('active');
  });
  
  test('should get DAA statistics', () => {
    const stats = daaIntegration.getStatistics();
    
    expect(stats).toHaveProperty('totalAgents', 4);
    expect(stats).toHaveProperty('validationAgents', 3);
    expect(stats).toHaveProperty('tabulationAgents', 1);
    expect(stats).toHaveProperty('consensusThreshold', 0.66);
    expect(stats).toHaveProperty('timeout', 5000);
    expect(stats).toHaveProperty('retryAttempts', 3);
  });
  
  test('should handle delay function', async () => {
    const start = Date.now();
    await daaIntegration.delay(100);
    const end = Date.now();
    
    // Should have waited approximately 100ms
    expect(end - start).toBeGreaterThanOrEqual(90);
  });
});