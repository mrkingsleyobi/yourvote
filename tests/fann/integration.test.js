/**
 * Integration tests for the complete FANN system
 */

const FANNManager = require('../../src/fann/fann_manager.js');
const ruvFANN = require('../../src/fann/core/fann.js');

describe('FANN System Integration', () => {
  let fannManager;
  
  beforeEach(async () => {
    fannManager = new FANNManager({
      useWASM: false, // Disable WASM for integration tests
      useParallelProcessing: false, // Disable parallel processing for predictability
      enableEphemeralIntelligence: true,
      enableSynapticMesh: false, // Disable external integrations for unit tests
      enableDAAIntegration: false
    });
    
    // Initialize with a simple configuration
    await fannManager.initialize({
      inputNodes: 5,
      hiddenLayers: [4, 3],
      outputNodes: 2,
      activation: 'sigmoid'
    });
  });
  
  afterEach(() => {
    if (fannManager) {
      fannManager.cleanup();
    }
  });
  
  test('should process vote through complete pipeline', async () => {
    const voteData = {
      id: 'integration-test-vote-001',
      timestamp: Date.now(),
      locationId: 123,
      voterIdHash: 456,
      ballotType: 1,
      votingMethod: 2,
      timeToComplete: 120000 // 2 minutes
    };
    
    const result = await fannManager.processVote(voteData, 'integration-test-election');
    
    // Verify the result structure
    expect(result).toHaveProperty('voteId', 'integration-test-vote-001');
    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('processingTime');
    expect(result.processingTime).toBeGreaterThan(0);
    
    // Verify the analysis result
    expect(result.result).toBeDefined();
    expect(result.result).toHaveProperty('prediction');
    expect(result.result.prediction).toHaveLength(2);
    
    // Verify prediction is normalized (softmax)
    const predictionSum = result.result.prediction.reduce((sum, val) => sum + val, 0);
    expect(predictionSum).toBeCloseTo(1.0, 5);
    
    // Verify other result properties
    expect(result.result).toHaveProperty('confidence');
    expect(result.result).toHaveProperty('timestamp');
    
    // Verify statistics were updated
    const stats = fannManager.getStatistics();
    expect(stats.processingStats.processedVotes).toBe(1);
    expect(stats.processingStats.totalVotes).toBe(1);
  });
  
  test('should handle multiple votes in sequence', async () => {
    const votes = [
      {
        id: 'vote-1',
        timestamp: Date.now(),
        locationId: 100,
        voterIdHash: 200,
        ballotType: 1,
        votingMethod: 1
      },
      {
        id: 'vote-2',
        timestamp: Date.now() + 1000,
        locationId: 101,
        voterIdHash: 201,
        ballotType: 1,
        votingMethod: 2
      },
      {
        id: 'vote-3',
        timestamp: Date.now() + 2000,
        locationId: 102,
        voterIdHash: 202,
        ballotType: 2,
        votingMethod: 1
      }
    ];
    
    const results = [];
    for (const vote of votes) {
      const result = await fannManager.processVote(vote, 'sequential-test-election');
      results.push(result);
    }
    
    // Verify all votes were processed
    expect(results).toHaveLength(3);
    results.forEach((result, index) => {
      expect(result.voteId).toBe(`vote-${index + 1}`);
      expect(result.success).toBe(true);
      expect(result.result.prediction).toHaveLength(2);
    });
    
    // Verify statistics
    const stats = fannManager.getStatistics();
    expect(stats.processingStats.processedVotes).toBe(3);
    expect(stats.processingStats.totalVotes).toBe(3);
  });
  
  test('should create and manage ephemeral intelligence', async () => {
    const voteData = {
      id: 'ephemeral-test-vote',
      timestamp: Date.now(),
      locationId: 500,
      voterIdHash: 600
    };
    
    // Process vote to create ephemeral intelligence
    await fannManager.processVote(voteData, 'ephemeral-test-election');
    
    // Verify ephemeral intelligence was created
    const ephemeralStats = fannManager.getEphemeralStatistics();
    expect(ephemeralStats).toHaveLength(1);
    expect(ephemeralStats[0].electionId).toBe('ephemeral-test-election');
    expect(ephemeralStats[0].processedVotes).toBe(1);
    
    // Process another vote for the same election
    await fannManager.processVote(voteData, 'ephemeral-test-election');
    
    // Verify the same ephemeral intelligence is used
    const updatedEphemeralStats = fannManager.getEphemeralStatistics();
    expect(updatedEphemeralStats).toHaveLength(1);
    expect(updatedEphemeralStats[0].processedVotes).toBe(2);
  });
  
  test('should maintain consistent predictions for similar inputs', async () => {
    const similarVotes = [
      {
        id: 'vote-a',
        timestamp: 1000000,
        locationId: 100,
        voterIdHash: 200,
        ballotType: 1,
        votingMethod: 1
      },
      {
        id: 'vote-b',
        timestamp: 1000001,
        locationId: 100,
        voterIdHash: 200,
        ballotType: 1,
        votingMethod: 1
      }
    ];
    
    const results = [];
    for (const vote of similarVotes) {
      const result = await fannManager.processVote(vote, 'consistency-test-election');
      results.push(result);
    }
    
    // For very similar inputs, predictions should be close
    const pred1 = results[0].result.prediction;
    const pred2 = results[1].result.prediction;
    
    // Check that predictions are reasonably close (within 0.1)
    for (let i = 0; i < pred1.length; i++) {
      expect(Math.abs(pred1[i] - pred2[i])).toBeLessThan(0.1);
    }
  });
  
  test('should handle edge case vote data', async () => {
    const edgeCaseVotes = [
      {
        id: 'edge-vote-1',
        // Missing optional fields
      },
      {
        id: 'edge-vote-2',
        timestamp: Date.now(),
        locationId: -50, // Negative value
        voterIdHash: 1.5, // Float value
        ballotType: 10, // Large value
        votingMethod: -5 // Negative value
      }
    ];
    
    for (const vote of edgeCaseVotes) {
      const result = await fannManager.processVote(vote, 'edge-case-election');
      
      // Should still process successfully
      expect(result.success).toBe(true);
      expect(result.result.prediction).toHaveLength(2);
      
      // Prediction should be normalized
      const sum = result.result.prediction.reduce((acc, val) => acc + val, 0);
      expect(sum).toBeCloseTo(1.0, 5);
    }
  });
  
  test('should clean up resources properly', async () => {
    // Process some votes to create resources
    const voteData = { id: 'cleanup-test-vote', timestamp: Date.now() };
    await fannManager.processVote(voteData, 'cleanup-test-election');
    
    // Verify resources exist
    const initialStats = fannManager.getStatistics();
    expect(initialStats.activeElections).toBe(1);
    
    // Clean up
    fannManager.cleanup();
    
    // Verify resources are cleaned up
    const finalStats = fannManager.getStatistics();
    expect(finalStats.initialized).toBe(false);
    expect(finalStats.activeElections).toBe(0);
  });
  
  test('should provide comprehensive system statistics', async () => {
    // Process a few votes
    const votes = [
      { id: 'stat-vote-1', timestamp: Date.now() },
      { id: 'stat-vote-2', timestamp: Date.now() + 1000 }
    ];
    
    for (const vote of votes) {
      await fannManager.processVote(vote, 'stats-test-election');
    }
    
    const stats = fannManager.getStatistics();
    
    // Verify overall structure
    expect(stats).toHaveProperty('initialized', true);
    expect(stats).toHaveProperty('processingStats');
    expect(stats).toHaveProperty('activeElections');
    expect(stats).toHaveProperty('components');
    expect(stats).toHaveProperty('config');
    
    // Verify processing stats
    expect(stats.processingStats.processedVotes).toBe(2);
    expect(stats.processingStats.totalVotes).toBe(2);
    expect(stats.processingStats.processingTime).toBeGreaterThan(0);
    expect(stats.processingStats.averageProcessingTime).toBeGreaterThan(0);
    
    // Verify component status
    expect(stats.components.fann).toBe(true);
    expect(stats.components.performanceOptimizer).toBe(true);
    
    // Verify configuration
    expect(stats.config.useWASM).toBe(false);
    expect(stats.config.useParallelProcessing).toBe(false);
  });
});