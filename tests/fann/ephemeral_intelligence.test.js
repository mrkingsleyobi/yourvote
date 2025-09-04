/**
 * Tests for Ephemeral Intelligence Implementation
 */

const EphemeralIntelligence = require('../../src/fann/ephemeral/ephemeral_intelligence.js');

describe('Ephemeral Intelligence Implementation', () => {
  let ephemeralNet;
  
  beforeEach(() => {
    ephemeralNet = new EphemeralIntelligence('test-election-001', {
      inputFeatures: 10,
      hiddenLayers: [8, 6],
      outputs: 3,
      activation: 'relu',
      learningRate: 0.01,
      ttl: 1000 // 1 second for testing
    });
  });
  
  afterEach(() => {
    if (ephemeralNet) {
      ephemeralNet.cleanup();
    }
  });
  
  test('should initialize with correct configuration', () => {
    expect(ephemeralNet.electionId).toBe('test-election-001');
    expect(ephemeralNet.ttl).toBe(1000);
    expect(ephemeralNet.neuralNetwork).not.toBeNull();
    expect(ephemeralNet.anomalyDetector).not.toBeNull();
    expect(ephemeralNet.fraudRecognizer).not.toBeNull();
    expect(ephemeralNet.behaviorAnalyzer).not.toBeNull();
  });
  
  test('should analyze vote pattern', async () => {
    const voteData = {
      id: 'vote-001',
      timestamp: Date.now(),
      locationId: 123,
      voterIdHash: 456,
      ballotType: 1,
      votingMethod: 2
    };
    
    const result = await ephemeralNet.analyzeVotePattern(voteData);
    
    expect(result).toHaveProperty('prediction');
    expect(result).toHaveProperty('isAnomaly');
    expect(result).toHaveProperty('fraudRisk');
    expect(result).toHaveProperty('behaviorPattern');
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('timestamp');
    
    expect(result.prediction).toHaveLength(3);
    expect(typeof result.isAnomaly).toBe('boolean');
    expect(typeof result.fraudRisk).toBe('number');
    expect(result.fraudRisk).toBeGreaterThanOrEqual(0);
    expect(result.fraudRisk).toBeLessThanOrEqual(1);
    expect(typeof result.confidence).toBe('number');
  });
  
  test('should extract features correctly', () => {
    const voteData = {
      timestamp: 1234567890,
      locationId: 42,
      voterIdHash: 999,
      ballotType: 1,
      votingMethod: 2
    };
    
    const features = ephemeralNet.extractFeatures(voteData);
    
    expect(features).toHaveLength(5);
    // All features should be normalized to [0,1]
    features.forEach(feature => {
      expect(feature).toBeGreaterThanOrEqual(0);
      expect(feature).toBeLessThanOrEqual(1);
    });
  });
  
  test('should normalize features', () => {
    const features = [0.5, -1, 2, 0, 1];
    const normalized = ephemeralNet.normalizeFeatures(features);
    
    expect(normalized).toHaveLength(5);
    normalized.forEach(feature => {
      expect(feature).toBeGreaterThanOrEqual(0);
      expect(feature).toBeLessThanOrEqual(1);
    });
  });
  
  test('should calculate confidence correctly', () => {
    const prediction = [0.1, 0.7, 0.2];
    const confidence = ephemeralNet.calculateConfidence(prediction);
    
    expect(confidence).toBe(0.7);
  });
  
  test('should determine when to cleanup', async () => {
    // Initially should not need cleanup
    expect(ephemeralNet.shouldCleanup()).toBe(false);
    
    // Wait for TTL to expire
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    // Should now need cleanup
    expect(ephemeralNet.shouldCleanup()).toBe(true);
  });
  
  test('should provide statistics', () => {
    const stats = ephemeralNet.getStatistics();
    
    expect(stats).toHaveProperty('electionId', 'test-election-001');
    expect(stats).toHaveProperty('createdAt');
    expect(stats).toHaveProperty('lastAccessed');
    expect(stats).toHaveProperty('age');
    expect(stats).toHaveProperty('processedVotes', 0);
    expect(stats).toHaveProperty('detectedAnomalies', 0);
    expect(stats).toHaveProperty('flaggedFraud', 0);
    expect(stats).toHaveProperty('anomalyRate', 0);
    expect(stats).toHaveProperty('fraudRate', 0);
  });
  
  test('should update statistics during processing', async () => {
    const voteData = {
      id: 'vote-001',
      timestamp: Date.now(),
      locationId: 123,
      voterIdHash: 456
    };
    
    // Process a few votes
    await ephemeralNet.analyzeVotePattern(voteData);
    await ephemeralNet.analyzeVotePattern(voteData);
    
    const stats = ephemeralNet.getStatistics();
    expect(stats.processedVotes).toBe(2);
  });
  
  test('should cleanup resources correctly', () => {
    expect(ephemeralNet.neuralNetwork).not.toBeNull();
    expect(ephemeralNet.anomalyDetector).not.toBeNull();
    
    ephemeralNet.cleanup();
    
    expect(ephemeralNet.neuralNetwork).toBeNull();
    expect(ephemeralNet.anomalyDetector).toBeNull();
    expect(ephemeralNet.fraudRecognizer).toBeNull();
    expect(ephemeralNet.behaviorAnalyzer).toBeNull();
  });
});