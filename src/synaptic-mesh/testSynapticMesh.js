const Network = require('../synaptic-mesh/core/Network');
const DistributedHashTable = require('../synaptic-mesh/network/DistributedHashTable');
const FaultTolerance = require('../synaptic-mesh/network/FaultTolerance');
const SecureMessaging = require('../synaptic-mesh/security/SecureMessaging');
const ModelCompression = require('../synaptic-mesh/optimization/ModelCompression');
const GeneticAlgorithm = require('../synaptic-mesh/evolution/GeneticAlgorithm');
const OnlineLearning = require('../synaptic-mesh/evolution/OnlineLearning');
const TLSEncryption = require('../synaptic-mesh/security/TLSEncryption');
const AESEncryption = require('../synaptic-mesh/security/AESEncryption');
const FraudDetectionNetwork = require('../neural-networks/fraud-detection/FraudDetectionNetwork');
const ValidationNetwork = require('../neural-networks/validation/ValidationNetwork');
const TabulationNetwork = require('../neural-networks/tabulation/TabulationNetwork');
const AuditNetwork = require('../neural-networks/audit/AuditNetwork');

async function testSynapticMesh() {
  console.log('Testing Synaptic-Mesh Neural Network Fabric Architecture...');
  
  try {
    // Test core network functionality
    console.log('\n=== Testing Core Network ===');
    const network = new Network();
    
    // Create nodes
    const node1 = await network.createNode('node-1', '192.168.1.1', 8080);
    const node2 = await network.createNode('node-2', '192.168.1.2', 8080);
    const node3 = await network.createNode('node-3', '192.168.1.3', 8080);
    
    console.log(`Network created with ${network.getNetworkSize()} nodes`);
    
    // Connect nodes
    await network.connectNodes('node-1', 'node-2');
    await network.connectNodes('node-2', 'node-3');
    await network.connectNodes('node-1', 'node-3');
    
    console.log('Nodes connected successfully');
    
    // Test distributed hash table
    console.log('\n=== Testing Distributed Hash Table ===');
    const dht = new DistributedHashTable();
    dht.registerNode('node-1', { address: '192.168.1.1', port: 8080 });
    dht.registerNode('node-2', { address: '192.168.1.2', port: 8080 });
    dht.registerNode('node-3', { address: '192.168.1.3', port: 8080 });
    
    await dht.put('key1', 'value1');
    await dht.put('key2', 'value2');
    const value1 = await dht.get('key1');
    console.log(`Retrieved value from DHT: ${value1}`);
    
    // Test fault tolerance
    console.log('\n=== Testing Fault Tolerance ===');
    const faultTolerance = new FaultTolerance();
    faultTolerance.startMonitoring('node-1');
    faultTolerance.startMonitoring('node-2');
    faultTolerance.startMonitoring('node-3');
    
    const replicationResult = await faultTolerance.replicateData('test-data', 'test-key');
    console.log(`Data replicated to nodes: ${replicationResult.primary}, ${replicationResult.replicas.join(', ')}`);
    
    // Test secure messaging
    console.log('\n=== Testing Secure Messaging ===');
    const secureMessaging = new SecureMessaging();
    const messageResult = await secureMessaging.sendSecureMessage(node1, node2, { data: 'test message' });
    console.log(`Secure message sent: ${messageResult.success}`);
    
    // Test TLS encryption
    console.log('\n=== Testing TLS Encryption ===');
    const tls = new TLSEncryption();
    const cert = tls.generateCertificate('test-node');
    const connection = await tls.establishConnection(cert, cert);
    console.log(`TLS connection established: ${connection.established}`);
    
    // Test AES encryption
    console.log('\n=== Testing AES Encryption ===');
    const aes = AESEncryption;
    const key = aes.generateKey();
    const encrypted = aes.encrypt('test data', key);
    const decrypted = aes.decrypt(encrypted, key);
    console.log(`AES encryption/decryption: ${decrypted === 'test data' ? 'SUCCESS' : 'FAILED'}`);
    
    // Test neural networks
    console.log('\n=== Testing Neural Networks ===');
    
    // Fraud Detection Network
    const fraudNet = new FraudDetectionNetwork();
    await fraudNet.initialize();
    const fraudResult = await fraudNet.detectFraud({ voteId: 'vote-001' });
    console.log(`Fraud detection result: ${fraudResult.isFraud ? 'FRAUD' : 'CLEAN'}`);
    
    // Validation Network
    const validationNet = new ValidationNetwork();
    await validationNet.initialize();
    const validationResult = await validationNet.validateVote({ voteId: 'vote-001' });
    console.log(`Vote validation result: ${validationResult.isValid ? 'VALID' : 'INVALID'}`);
    
    // Tabulation Network
    const tabulationNet = new TabulationNetwork();
    await tabulationNet.initialize();
    const tabulationResult = await tabulationNet.tabulateVotes([
      { voteId: 'vote-001' },
      { voteId: 'vote-002' },
      { voteId: 'vote-003' }
    ]);
    console.log(`Tabulation result - Winner: ${tabulationResult.winner} with ${tabulationResult.winningVotes} votes`);
    
    // Audit Network
    const auditNet = new AuditNetwork();
    await auditNet.initialize();
    const auditResult = await auditNet.auditProcess({ processId: 'process-001' });
    console.log(`Audit result: ${auditResult.isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}`);
    
    // Test model compression
    console.log('\n=== Testing Model Compression ===');
    const compression = new ModelCompression();
    const compressionResult = compression.compressModel({}, ['pruning', 'quantization']);
    console.log(`Model compression achieved ${Math.round(compressionResult.overallCompression * 100)}% size reduction`);
    
    // Test genetic algorithm
    console.log('\n=== Testing Genetic Algorithm ===');
    const ga = new GeneticAlgorithm();
    ga.generations = 10; // Reduce for testing
    const gaResult = await ga.run();
    console.log(`Genetic algorithm completed. Best fitness: ${gaResult.bestIndividual.fitness.toFixed(4)}`);
    
    // Test online learning
    console.log('\n=== Testing Online Learning ===');
    const onlineLearning = new OnlineLearning();
    onlineLearning.addSample([1, 2, 3], [0, 1]);
    onlineLearning.addSample([4, 5, 6], [1, 0]);
    const learningResult = await onlineLearning.updateModel(null, onlineLearning.recentSamples.slice(0, 2));
    console.log(`Online learning processed ${learningResult.samplesProcessed} samples`);
    
    // Clean up
    console.log('\n=== Cleaning Up ===');
    await network.shutdown();
    faultTolerance.destroy();
    
    console.log('\nSynaptic-Mesh Neural Network Fabric Architecture test completed successfully!');
    
  } catch (error) {
    console.error('Synaptic-Mesh test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testSynapticMesh();
}

module.exports = testSynapticMesh;