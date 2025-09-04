/**
 * Tests for FANN Manager Implementation
 */

const FANNManager = require('../../src/fann/fann_manager.js');

// Mock the required modules to isolate FANNManager tests
jest.mock('../../src/fann/core/fann.js');
jest.mock('../../src/fann/webassembly/wasm_wrapper.js');
jest.mock('../../src/fann/ephemeral/ephemeral_intelligence.js');
jest.mock('../../src/fann/optimization/performance_optimizer.js');
jest.mock('../../src/fann/parallel/parallel_processor.js');
jest.mock('../../src/fann/integration/synaptic_mesh.js');
jest.mock('../../src/fann/integration/daa_integration.js');

describe('FANN Manager Implementation', () => {
  let fannManager;
  
  beforeEach(() => {
    fannManager = new FANNManager({
      useWASM: true,
      useParallelProcessing: true,
      enableEphemeralIntelligence: true,
      enableSynapticMesh: true,
      enableDAAIntegration: true,
      workerCount: 2
    });
  });
  
  afterEach(() => {
    if (fannManager) {
      fannManager.cleanup();
    }
    jest.clearAllMocks();
  });
  
  test('should initialize with correct configuration', () => {
    expect(fannManager.config.useWASM).toBe(true);
    expect(fannManager.config.useParallelProcessing).toBe(true);
    expect(fannManager.config.enableEphemeralIntelligence).toBe(true);
    expect(fannManager.config.enableSynapticMesh).toBe(true);
    expect(fannManager.config.enableDAAIntegration).toBe(true);
    expect(fannManager.config.workerCount).toBe(2);
  });
  
  test('should initialize FANN system successfully', async () => {
    const result = await fannManager.initialize({
      inputNodes: 10,
      hiddenLayers: [8, 6],
      outputNodes: 3,
      activation: 'relu'
    });
    
    expect(result).toBe(true);
    expect(fannManager.initialized).toBe(true);
    expect(fannManager.fann).not.toBeNull();
    expect(fannManager.wasmWrapper).not.toBeNull();
    expect(fannManager.parallelProcessor).not.toBeNull();
    expect(fannManager.synapticMesh).not.toBeNull();
    expect(fannManager.daaIntegration).not.toBeNull();
  });
  
  test('should fail initialization gracefully', async () => {
    // Mock FANN constructor to throw an error
    const mockFANN = require('../../src/fann/core/fann.js');
    mockFANN.mockImplementation(() => {
      throw new Error('Initialization failed');
    });
    
    const result = await fannManager.initialize();
    
    expect(result).toBe(false);
    expect(fannManager.initialized).toBe(false);
  });
  
  test('should process single vote', async () => {
    // First initialize the manager
    await fannManager.initialize();
    
    const voteData = {
      id: 'vote-001',
      timestamp: Date.now(),
      locationId: 123,
      voterIdHash: 456,
      ballotType: 1,
      votingMethod: 2
    };
    
    // Mock the FANN forward method
    fannManager.fann.forward = jest.fn().mockReturnValue([0.1, 0.7, 0.2]);
    
    const result = await fannManager.processVote(voteData, 'election-001');
    
    expect(result).toHaveProperty('voteId', 'vote-001');
    expect(result).toHaveProperty('result');
    expect(result).toHaveProperty('processingTime');
    expect(result).toHaveProperty('success', true);
    expect(fannManager.fann.forward).toHaveBeenCalled();
  });
  
  test('should process vote with WASM when available', async () => {
    // First initialize the manager
    await fannManager.initialize();
    
    const voteData = {
      id: 'vote-001',
      timestamp: Date.now(),
      locationId: 123,
      voterIdHash: 456
    };
    
    // Mock WASM wrapper to be available
    fannManager.wasmWrapper.forward = jest.fn().mockReturnValue([0.2, 0.6, 0.2]);
    fannManager.wasmWrapper.fallbackToJS = false;
    
    const result = await fannManager.processVote(voteData, 'election-001');
    
    expect(result.success).toBe(true);
    expect(fannManager.wasmWrapper.forward).toHaveBeenCalled();
  });
  
  test('should handle vote processing errors gracefully', async () => {
    // First initialize the manager
    await fannManager.initialize();
    
    const voteData = {
      id: 'vote-001',
      timestamp: Date.now(),
      locationId: 123,
      voterIdHash: 456
    };
    
    // Mock FANN forward to throw an error
    fannManager.fann.forward = jest.fn().mockImplementation(() => {
      throw new Error('Processing failed');
    });
    
    const result = await fannManager.processVote(voteData, 'election-001');
    
    expect(result).toHaveProperty('voteId', 'vote-001');
    expect(result).toHaveProperty('error');
    expect(result).toHaveProperty('success', false);
  });
  
  test('should process vote batch', async () => {
    // First initialize the manager
    await fannManager.initialize();
    
    const voteBatch = [
      { id: 'vote-1', data: 'test1' },
      { id: 'vote-2', data: 'test2' },
      { id: 'vote-3', data: 'test3' }
    ];
    
    // Mock processVote to return predictable results
    fannManager.processVote = jest.fn().mockImplementation(async (vote) => ({
      voteId: vote.id,
      result: { processed: true },
      processingTime: 10,
      success: true
    }));
    
    const results = await fannManager.processVoteBatch(voteBatch, 'election-001');
    
    expect(results).toHaveLength(3);
    expect(fannManager.processVote).toHaveBeenCalledTimes(3);
  });
  
  test('should use parallel processing for large batches', async () => {
    // First initialize the manager
    await fannManager.initialize();
    
    // Create a large batch to trigger parallel processing
    const voteBatch = new Array(200).fill(null).map((_, i) => ({
      id: `vote-${i}`,
      data: `data-${i}`
    }));
    
    // Mock parallel processor
    fannManager.parallelProcessor.processVotes = jest.fn().mockResolvedValue(
      voteBatch.map(vote => ({
        voteId: vote.id,
        result: { processed: true },
        processingTime: 5,
        success: true
      }))
    );
    
    const results = await fannManager.processVoteBatch(voteBatch, 'election-001');
    
    expect(results).toHaveLength(200);
    expect(fannManager.parallelProcessor.processVotes).toHaveBeenCalled();
  });
  
  test('should extract features correctly', () => {
    const voteData = {
      timestamp: 1234567890,
      locationId: 42,
      voterIdHash: 999,
      ballotType: 1,
      votingMethod: 2
    };
    
    const features = fannManager.extractFeatures(voteData);
    
    expect(features).toHaveLength(5);
    // All features should be normalized to [0,1]
    features.forEach(feature => {
      expect(feature).toBeGreaterThanOrEqual(0);
      expect(feature).toBeLessThanOrEqual(1);
    });
  });
  
  test('should update processing statistics', () => {
    const startTime = Date.now() - 50; // 50ms ago
    
    const analysisResult = {
      isAnomaly: false,
      fraudRisk: 0.3
    };
    
    fannManager.updateProcessingStats(startTime, analysisResult);
    
    expect(fannManager.processingStats.totalVotes).toBe(1);
    expect(fannManager.processingStats.processedVotes).toBe(1);
    expect(fannManager.processingStats.processingTime).toBeGreaterThanOrEqual(50);
  });
  
  test('should cleanup election resources', async () => {
    // First initialize the manager
    await fannManager.initialize();
    
    // Create an ephemeral network for an election
    const mockEphemeral = {
      cleanup: jest.fn()
    };
    
    fannManager.activeElections.set('election-001', mockEphemeral);
    
    // Cleanup the election
    fannManager.cleanupElection('election-001');
    
    expect(mockEphemeral.cleanup).toHaveBeenCalled();
    expect(fannManager.activeElections.has('election-001')).toBe(false);
  });
  
  test('should cleanup all resources', async () => {
    // First initialize the manager
    await fannManager.initialize();
    
    // Mock cleanup methods
    fannManager.fann.dispose = jest.fn();
    fannManager.wasmWrapper.cleanup = jest.fn();
    fannManager.parallelProcessor.cleanup = jest.fn();
    
    fannManager.cleanup();
    
    expect(fannManager.fann.dispose).toHaveBeenCalled();
    expect(fannManager.wasmWrapper.cleanup).toHaveBeenCalled();
    expect(fannManager.parallelProcessor.cleanup).toHaveBeenCalled();
    expect(fannManager.initialized).toBe(false);
    expect(fannManager.activeElections.size).toBe(0);
  });
  
  test('should get system statistics', async () => {
    // First initialize the manager
    await fannManager.initialize();
    
    const stats = fannManager.getStatistics();
    
    expect(stats).toHaveProperty('initialized', true);
    expect(stats).toHaveProperty('processingStats');
    expect(stats).toHaveProperty('activeElections', 0);
    expect(stats).toHaveProperty('components');
    expect(stats).toHaveProperty('config');
    
    // Check that component stats are included
    expect(stats).toHaveProperty('parallelProcessor');
    expect(stats).toHaveProperty('performanceOptimizer');
  });
  
  test('should get ephemeral intelligence statistics', async () => {
    // First initialize the manager
    await fannManager.initialize();
    
    // Add some mock ephemeral networks
    const mockEphemeral1 = {
      getStatistics: jest.fn().mockReturnValue({
        electionId: 'election-001',
        processedVotes: 100,
        detectedAnomalies: 5
      })
    };
    
    const mockEphemeral2 = {
      getStatistics: jest.fn().mockReturnValue({
        electionId: 'election-002',
        processedVotes: 150,
        detectedAnomalies: 8
      })
    };
    
    fannManager.activeElections.set('election-001', mockEphemeral1);
    fannManager.activeElections.set('election-002', mockEphemeral2);
    
    const stats = fannManager.getEphemeralStatistics();
    
    expect(stats).toHaveLength(2);
    expect(stats[0]).toHaveProperty('electionId', 'election-001');
    expect(stats[0]).toHaveProperty('processedVotes', 100);
    expect(stats[1]).toHaveProperty('electionId', 'election-002');
    expect(stats[1]).toHaveProperty('processedVotes', 150);
  });
  
  test('should throw error when processing vote without initialization', async () => {
    const voteData = { id: 'vote-001' };
    
    // Create a new manager without initializing
    const uninitManager = new FANNManager();
    
    await expect(uninitManager.processVote(voteData))
      .rejects
      .toThrow('FANN Manager not initialized');
  });
});