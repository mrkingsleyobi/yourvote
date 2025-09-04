/**
 * Tests for Synaptic-Mesh Integration Implementation
 */

const SynapticMeshIntegration = require('../../src/fann/integration/synaptic_mesh.js');

describe('Synaptic-Mesh Integration Implementation', () => {
  let meshIntegration;
  
  beforeEach(() => {
    meshIntegration = new SynapticMeshIntegration({
      nodes: [
        { id: 'node-1', address: '192.168.1.1', reputation: 0.9 },
        { id: 'node-2', address: '192.168.1.2', reputation: 0.8 },
        { id: 'node-3', address: '192.168.1.3', reputation: 0.95 }
      ],
      protocol: 'secure-websocket',
      encryption: 'post-quantum',
      timeout: 5000
    });
  });
  
  test('should initialize with correct configuration', () => {
    expect(meshIntegration.meshNodes).toHaveLength(3);
    expect(meshIntegration.communicationProtocol).toBe('secure-websocket');
    expect(meshIntegration.encryption).toBe('post-quantum');
    expect(meshIntegration.connectionTimeout).toBe(5000);
  });
  
  test('should broadcast vote analysis to all nodes', async () => {
    const voteId = 'vote-001';
    const analysisResult = {
      prediction: [0.1, 0.7, 0.2],
      confidence: 0.85,
      isAnomaly: false
    };
    
    const results = await meshIntegration.broadcastVoteAnalysis(voteId, analysisResult);
    
    expect(results).toHaveProperty('successful');
    expect(results).toHaveProperty('failed');
    expect(results).toHaveProperty('successCount');
    expect(results).toHaveProperty('failureCount');
    expect(results).toHaveProperty('totalCount');
  });
  
  test('should send message to specific node', async () => {
    const node = meshIntegration.meshNodes[0];
    const message = {
      type: 'TEST',
      data: 'test-data',
      timestamp: Date.now()
    };
    
    const result = await meshIntegration.sendToNode(node, message);
    
    expect(result).toHaveProperty('status', 'success');
    expect(result).toHaveProperty('nodeId', 'node-1');
    expect(result).toHaveProperty('response');
  });
  
  test('should create connection to node', async () => {
    const node = meshIntegration.meshNodes[0];
    const connection = await meshIntegration.createConnection(node);
    
    expect(connection).toBeDefined();
    expect(connection.status).toBe('connected');
  });
  
  test('should check connection status', () => {
    const mockConnection = { status: 'connected' };
    const isAlive = meshIntegration.isConnectionAlive(mockConnection);
    
    expect(isAlive).toBe(true);
  });
  
  test('should encrypt message', async () => {
    const message = { data: 'test' };
    const node = meshIntegration.meshNodes[0];
    
    const encrypted = await meshIntegration.encryptMessage(message, node);
    
    expect(encrypted).toHaveProperty('data', 'test');
    expect(encrypted).toHaveProperty('encrypted', true);
    expect(encrypted).toHaveProperty('encryptionMethod', 'post-quantum');
  });
  
  test('should process broadcast results', () => {
    const mockResults = [
      { status: 'fulfilled', value: { status: 'success' } },
      { status: 'rejected', reason: new Error('Failed') },
      { status: 'fulfilled', value: { status: 'success' } }
    ];
    
    const processed = meshIntegration.processBroadcastResults(mockResults);
    
    expect(processed.successful).toHaveLength(2);
    expect(processed.failed).toHaveLength(1);
    expect(processed.successCount).toBe(2);
    expect(processed.failureCount).toBe(1);
    expect(processed.totalCount).toBe(3);
  });
  
  test('should aggregate mesh results with weighted voting', async () => {
    const voteId = 'vote-001';
    
    // Mock the requestNodeAnalysis method
    meshIntegration.requestNodeAnalysis = jest.fn().mockResolvedValue({
      status: 'success',
      response: {
        analysis: {
          confidence: 0.8,
          riskScore: 0.2
        }
      },
      node: {
        reputation: 0.9
      }
    });
    
    const result = await meshIntegration.aggregateMeshResults(voteId);
    
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('result');
    expect(result).toHaveProperty('confidence');
  });
  
  test('should apply weighted voting consensus', () => {
    const mockResults = [
      {
        status: 'success',
        response: {
          analysis: {
            confidence: 0.8,
            riskScore: 0.2
          }
        },
        node: {
          reputation: 0.9
        }
      },
      {
        status: 'success',
        response: {
          analysis: {
            confidence: 0.6,
            riskScore: 0.4
          }
        },
        node: {
          reputation: 0.7
        }
      }
    ];
    
    const consensus = meshIntegration.weightedVotingConsensus(mockResults);
    
    expect(consensus).toHaveProperty('type', 'WEIGHTED_CONSENSUS');
    expect(consensus).toHaveProperty('result');
    expect(consensus).toHaveProperty('confidence');
  });
  
  test('should apply majority consensus', () => {
    const mockResults = [
      {
        status: 'success',
        response: {
          analysis: {
            classification: 'valid',
            status: 'approved'
          }
        }
      },
      {
        status: 'success',
        response: {
          analysis: {
            classification: 'valid',
            status: 'approved'
          }
        }
      },
      {
        status: 'success',
        response: {
          analysis: {
            classification: 'invalid',
            status: 'rejected'
          }
        }
      }
    ];
    
    const consensus = meshIntegration.majorityConsensus(mockResults);
    
    expect(consensus).toHaveProperty('type', 'MAJORITY_CONSENSUS');
    expect(consensus.result).toHaveProperty('classification', 'valid');
    expect(consensus.result).toHaveProperty('status', 'approved');
  });
  
  test('should calculate consensus confidence', () => {
    const mockResults = [
      { status: 'fulfilled' },
      { status: 'fulfilled' },
      { status: 'rejected' }
    ];
    
    const confidence = meshIntegration.calculateConsensusConfidence(mockResults);
    
    expect(confidence).toBe(2/3);
  });
  
  test('should get mesh statistics', () => {
    const stats = meshIntegration.getStatistics();
    
    expect(stats).toHaveProperty('nodeCount', 3);
    expect(stats).toHaveProperty('connectedNodes', 0);
    expect(stats).toHaveProperty('connectionFailures', 0);
    expect(stats).toHaveProperty('protocol', 'secure-websocket');
    expect(stats).toHaveProperty('encryption', 'post-quantum');
  });
});