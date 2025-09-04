# ruv-FANN API Documentation

## Overview

The ruv-FANN (Fast Artificial Neural Networks) system is a specialized neural network implementation designed for the AI-Native Election Voting System. It provides real-time vote processing, cross-platform compatibility through WebAssembly, ephemeral intelligence for pattern recognition, performance optimization, parallel processing, and integration with Synaptic-Mesh and DAA components.

## Core Components

### 1. FANNManager
The main orchestrator for the entire FANN system.

#### Constructor
```javascript
const FANNManager = require('./src/fann/fann_manager.js');

const manager = new FANNManager({
  useWASM: true,                    // Enable WebAssembly support
  useParallelProcessing: true,      // Enable parallel processing
  enableEphemeralIntelligence: true, // Enable ephemeral intelligence
  enableSynapticMesh: false,        // Enable Synaptic-Mesh integration
  enableDAAIntegration: false,      // Enable DAA integration
  workerCount: 4                    // Number of parallel workers
});
```

#### Methods

##### `initialize(networkConfig)`
Initialize the FANN system with the specified network configuration.

**Parameters:**
- `networkConfig` (Object): Configuration for the neural network
  - `inputNodes` (number): Number of input nodes (default: 50)
  - `hiddenLayers` (number[]): Array of hidden layer sizes (default: [32, 16])
  - `outputNodes` (number): Number of output nodes (default: 5)
  - `activation` (string): Activation function (default: 'relu')
  - `learningRate` (number): Learning rate (default: 0.001)

**Returns:** Promise<boolean> - Whether initialization was successful

**Example:**
```javascript
await manager.initialize({
  inputNodes: 20,
  hiddenLayers: [16, 8],
  outputNodes: 3,
  activation: 'sigmoid',
  learningRate: 0.01
});
```

##### `processVote(voteData, electionId)`
Process a single vote through the FANN system.

**Parameters:**
- `voteData` (Object): Vote data to process
- `electionId` (string): Election identifier (default: 'default')

**Returns:** Promise<Object> - Processing result

**Example:**
```javascript
const voteData = {
  id: 'vote-001',
  timestamp: Date.now(),
  locationId: 123,
  voterIdHash: 456
};

const result = await manager.processVote(voteData, 'election-2024');
```

##### `processVoteBatch(voteBatch, electionId)`
Process a batch of votes in parallel.

**Parameters:**
- `voteBatch` (Object[]): Array of vote data to process
- `electionId` (string): Election identifier (default: 'default')

**Returns:** Promise<Object[]> - Array of processing results

**Example:**
```javascript
const voteBatch = [
  { id: 'vote-001', timestamp: Date.now(), locationId: 123 },
  { id: 'vote-002', timestamp: Date.now(), locationId: 124 }
];

const results = await manager.processVoteBatch(voteBatch, 'election-2024');
```

##### `cleanup()`
Clean up all resources used by the FANN system.

**Example:**
```javascript
manager.cleanup();
```

##### `getStatistics()`
Get comprehensive system statistics.

**Returns:** Object - System statistics

##### `getEphemeralStatistics()`
Get statistics for all active ephemeral intelligence networks.

**Returns:** Object[] - Array of ephemeral network statistics

### 2. ruvFANN (Core Neural Network)
The core neural network implementation.

#### Constructor
```javascript
const ruvFANN = require('./src/fann/core/fann.js');

const fann = new ruvFANN({
  inputNodes: 50,
  hiddenLayers: [32, 16],
  outputNodes: 5,
  activation: 'relu',
  learningRate: 0.001
});
```

#### Methods

##### `forward(input)`
Perform forward propagation through the network.

**Parameters:**
- `input` (number[]): Input vector

**Returns:** number[] - Output vector

##### `dispose()`
Dispose of network resources.

### 3. WASMFANNWrapper (WebAssembly Integration)
Wrapper for WebAssembly-optimized neural network operations.

#### Constructor
```javascript
const WASMFANNWrapper = require('./src/fann/webassembly/wasm_wrapper.js');

const wasmWrapper = new WASMFANNWrapper();
```

#### Methods

##### `initialize(config)`
Initialize the WASM module.

**Parameters:**
- `config` (Object): Configuration object
  - `layerSizes` (number[]): Array of layer sizes
  - `activation` (string): Activation function
  - `useSIMD` (boolean): Whether to use SIMD optimizations

**Returns:** Promise<boolean> - Whether initialization was successful

##### `forward(input)`
Perform forward propagation using WASM.

**Parameters:**
- `input` (number[]): Input vector

**Returns:** number[] - Output vector

##### `cleanup()`
Clean up WASM resources.

### 4. EphemeralIntelligence
Temporary neural networks for pattern recognition.

#### Constructor
```javascript
const EphemeralIntelligence = require('./src/fann/ephemeral/ephemeral_intelligence.js');

const ephemeralNet = new EphemeralIntelligence('election-2024', {
  lifecycle: 'election',
  ttl: 86400000 // 24 hours
});
```

#### Methods

##### `analyzeVotePattern(voteData)`
Analyze vote pattern using the ephemeral neural network.

**Parameters:**
- `voteData` (Object): Vote data to analyze

**Returns:** Promise<Object> - Analysis results

##### `cleanup()`
Clean up network resources.

##### `getStatistics()`
Get network statistics.

**Returns:** Object - Network statistics

### 5. PerformanceOptimizer
Performance optimization techniques implementation.

#### Constructor
```javascript
const { PerformanceOptimizer } = require('./src/fann/optimization/performance_optimizer.js');

const optimizer = new PerformanceOptimizer();
```

#### Methods

##### `quantizeModel(model, bits)`
Optimize neural network with quantization.

**Parameters:**
- `model` (Object): Neural network model
- `bits` (number): Number of bits for quantization (8 or 16)

**Returns:** Object - Quantized model

##### `batchProcess(votes, processor)`
Batch process votes for improved performance.

**Parameters:**
- `votes` (Object[]): Array of vote objects
- `processor` (Function): Function to process individual votes

**Returns:** Object[] - Processed results

### 6. ParallelVoteProcessor
Parallel processing for high-volume vote tabulation.

#### Constructor
```javascript
const ParallelVoteProcessor = require('./src/fann/parallel/parallel_processor.js');

const parallelProcessor = new ParallelVoteProcessor(4); // 4 worker threads
```

#### Methods

##### `processVotes(voteBatch, processor)`
Process a batch of votes in parallel.

**Parameters:**
- `voteBatch` (Object[]): Array of vote objects to process
- `processor` (Function): Function to process individual votes

**Returns:** Promise<Object[]> - Processed results

##### `cleanup()`
Clean up resources.

### 7. SynapticMeshIntegration
Integration with Synaptic-Mesh distributed intelligence.

#### Constructor
```javascript
const SynapticMeshIntegration = require('./src/fann/integration/synaptic_mesh.js');

const meshIntegration = new SynapticMeshIntegration({
  nodes: [
    { id: 'node-1', address: '192.168.1.1' },
    { id: 'node-2', address: '192.168.1.2' }
  ],
  protocol: 'secure-websocket',
  encryption: 'post-quantum'
});
```

#### Methods

##### `broadcastVoteAnalysis(voteId, analysisResult)`
Broadcast vote analysis to all mesh nodes.

**Parameters:**
- `voteId` (string): Unique identifier for the vote
- `analysisResult` (Object): Analysis result to broadcast

**Returns:** Promise<Object[]> - Results from all nodes

##### `aggregateMeshResults(voteId)`
Aggregate results from all mesh nodes using consensus algorithm.

**Parameters:**
- `voteId` (string): Vote identifier

**Returns:** Promise<Object> - Aggregated result

### 8. DAAIntegration
Integration with Decentralized Autonomous Agents.

#### Constructor
```javascript
const DAAIntegration = require('./src/fann/integration/daa_integration.js');

const daaIntegration = new DAAIntegration({
  agents: [
    { id: 'agent-1', type: 'validation' },
    { id: 'agent-2', type: 'tabulation' }
  ],
  consensusThreshold: 0.66
});
```

#### Methods

##### `submitToValidationAgents(voteData)`
Submit vote data to validation agents.

**Parameters:**
- `voteData` (Object): Vote data to validate

**Returns:** Promise<Object> - Validation consensus result

##### `submitToTabulationAgents(voteData)`
Submit vote data to tabulation agents.

**Parameters:**
- `voteData` (Object): Vote data to tabulate

**Returns:** Promise<Object> - Tabulation result

## Configuration Options

### FANNManager Configuration
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `useWASM` | boolean | true | Enable WebAssembly support |
| `useParallelProcessing` | boolean | true | Enable parallel processing |
| `enableEphemeralIntelligence` | boolean | true | Enable ephemeral intelligence |
| `enableSynapticMesh` | boolean | false | Enable Synaptic-Mesh integration |
| `enableDAAIntegration` | boolean | false | Enable DAA integration |
| `workerCount` | number | 4 | Number of parallel workers |

### Neural Network Configuration
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `inputNodes` | number | 50 | Number of input nodes |
| `hiddenLayers` | number[] | [32, 16] | Array of hidden layer sizes |
| `outputNodes` | number | 5 | Number of output nodes |
| `activation` | string | 'relu' | Activation function |
| `learningRate` | number | 0.001 | Learning rate |

## Performance Optimization

The ruv-FANN system implements several performance optimization techniques:

1. **WebAssembly Integration**: Uses WASM for cross-platform compatibility and performance
2. **Quantization**: Reduces model size by 25-35% through weight quantization
3. **Batch Processing**: Processes votes in batches for improved throughput
4. **Memory Pooling**: Reuses memory allocations to reduce garbage collection
5. **Parallel Processing**: Distributes workload across multiple worker threads
6. **SIMD Operations**: Utilizes SIMD instructions for vectorized computations

## Error Handling

The FANN system implements comprehensive error handling:

1. **Graceful Degradation**: Falls back to JavaScript implementation when WASM is not available
2. **Retry Mechanisms**: Automatically retries failed operations
3. **Timeout Handling**: Implements timeouts for network operations
4. **Resource Cleanup**: Automatically cleans up resources on failure

## Integration Points

### With Synaptic-Mesh
- Broadcasts vote analysis to distributed mesh nodes
- Aggregates results using consensus algorithms
- Implements secure communication protocols

### With DAA Framework
- Submits votes to validation agents
- Coordinates with tabulation agents
- Implements consensus-based validation

## Usage Examples

### Basic Vote Processing
```javascript
const FANNManager = require('./src/fann/fann_manager.js');

// Initialize the FANN system
const manager = new FANNManager();
await manager.initialize({
  inputNodes: 10,
  hiddenLayers: [8, 6],
  outputNodes: 3
});

// Process a vote
const voteData = {
  id: 'vote-001',
  timestamp: Date.now(),
  locationId: 123,
  voterIdHash: 456
};

const result = await manager.processVote(voteData, 'election-2024');
console.log('Vote processed:', result);

// Clean up resources
manager.cleanup();
```

### Batch Vote Processing
```javascript
const voteBatch = [
  { id: 'vote-001', timestamp: Date.now(), locationId: 123 },
  { id: 'vote-002', timestamp: Date.now(), locationId: 124 },
  { id: 'vote-003', timestamp: Date.now(), locationId: 125 }
];

const results = await manager.processVoteBatch(voteBatch, 'election-2024');
console.log(`Processed ${results.length} votes`);
```

### Integration with External Systems
```javascript
// Enable Synaptic-Mesh integration
const manager = new FANNManager({
  enableSynapticMesh: true,
  synapticMeshConfig: {
    nodes: [
      { id: 'node-1', address: '192.168.1.1' },
      { id: 'node-2', address: '192.168.1.2' }
    ]
  }
});

// Enable DAA integration
const manager = new FANNManager({
  enableDAAIntegration: true,
  daaConfig: {
    agents: [
      { id: 'validator-1', type: 'validation' },
      { id: 'tabulator-1', type: 'tabulation' }
    ]
  }
});
```

## Monitoring and Metrics

The FANN system provides comprehensive monitoring capabilities:

1. **Processing Statistics**: Tracks vote processing rates and times
2. **Resource Usage**: Monitors memory and CPU usage
3. **Error Rates**: Tracks processing errors and failures
4. **Performance Metrics**: Measures speed improvements and memory reduction
5. **System Health**: Monitors overall system status

To access statistics:
```javascript
const stats = manager.getStatistics();
console.log('System statistics:', stats);

const ephemeralStats = manager.getEphemeralStatistics();
console.log('Ephemeral network statistics:', ephemeralStats);
```

## Best Practices

1. **Initialize Early**: Initialize the FANN system during application startup
2. **Process in Batches**: Use batch processing for high-volume vote processing
3. **Clean Up Resources**: Always call cleanup() when finished
4. **Handle Errors Gracefully**: Implement proper error handling in your application
5. **Monitor Performance**: Regularly check system statistics for performance issues
6. **Use Appropriate Configurations**: Tune network configuration based on your specific requirements