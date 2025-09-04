/**
 * FANN Manager - Main orchestrator for ruv-FANN system
 * Coordinates all FANN components and integration points
 */

const ruvFANN = require('./core/fann.js');
const WASMFANNWrapper = require('./webassembly/wasm_wrapper.js');
const EphemeralIntelligence = require('./ephemeral/ephemeral_intelligence.js');
const { PerformanceOptimizer } = require('./optimization/performance_optimizer.js');
const ParallelVoteProcessor = require('./parallel/parallel_processor.js');
const SynapticMeshIntegration = require('./integration/synaptic_mesh.js');
const DAAIntegration = require('./integration/daa_integration.js');

class FANNManager {
  /**
   * Create FANN Manager
   * @param {Object} config - Configuration for the FANN system
   */
  constructor(config = {}) {
    this.config = {
      useWASM: config.useWASM !== false, // Default to true
      useParallelProcessing: config.useParallelProcessing !== false, // Default to true
      enableEphemeralIntelligence: config.enableEphemeralIntelligence !== false, // Default to true
      enableSynapticMesh: config.enableSynapticMesh || false,
      enableDAAIntegration: config.enableDAAIntegration || false,
      ...config
    };
    
    // Core components
    this.fann = null;
    this.wasmWrapper = null;
    this.performanceOptimizer = new PerformanceOptimizer();
    this.parallelProcessor = null;
    this.ephemeralIntelligence = null;
    this.synapticMesh = null;
    this.daaIntegration = null;
    
    // State management
    this.initialized = false;
    this.activeElections = new Map();
    this.processingStats = {
      totalVotes: 0,
      processedVotes: 0,
      flaggedVotes: 0,
      processingTime: 0,
      averageProcessingTime: 0
    };
  }
  
  /**
   * Initialize the FANN system
   * @param {Object} networkConfig - Configuration for the neural network
   * @returns {Promise<boolean>} Whether initialization was successful
   */
  async initialize(networkConfig = {}) {
    try {
      console.log('Initializing FANN Manager...');
      
      // Initialize core FANN
      this.fann = new ruvFANN({
        inputNodes: networkConfig.inputNodes || 50,
        hiddenLayers: networkConfig.hiddenLayers || [32, 16],
        outputNodes: networkConfig.outputNodes || 5,
        activation: networkConfig.activation || 'relu',
        learningRate: networkConfig.learningRate || 0.001
      });
      
      // Initialize WASM wrapper if enabled
      if (this.config.useWASM) {
        this.wasmWrapper = new WASMFANNWrapper();
        await this.wasmWrapper.initialize({
          layerSizes: [
            networkConfig.inputNodes || 50,
            ...(networkConfig.hiddenLayers || [32, 16]),
            networkConfig.outputNodes || 5
          ],
          activation: networkConfig.activation || 'relu',
          useSIMD: networkConfig.useSIMD || false
        });
      }
      
      // Initialize parallel processor if enabled
      if (this.config.useParallelProcessing) {
        this.parallelProcessor = new ParallelVoteProcessor(this.config.workerCount || 4);
      }
      
      // Initialize Synaptic-Mesh integration if enabled
      if (this.config.enableSynapticMesh) {
        this.synapticMesh = new SynapticMeshIntegration(this.config.synapticMeshConfig || {});
      }
      
      // Initialize DAA integration if enabled
      if (this.config.enableDAAIntegration) {
        this.daaIntegration = new DAAIntegration(this.config.daaConfig || {});
      }
      
      this.initialized = true;
      console.log('FANN Manager initialized successfully');
      
      return true;
    } catch (error) {
      console.error('Failed to initialize FANN Manager:', error);
      return false;
    }
  }
  
  /**
   * Process a single vote
   * @param {Object} voteData - Vote data to process
   * @param {string} electionId - Election identifier
   * @returns {Promise<Object>} Processing result
   */
  async processVote(voteData, electionId = 'default') {
    if (!this.initialized) {
      throw new Error('FANN Manager not initialized');
    }
    
    const startTime = Date.now();
    
    try {
      // Get or create ephemeral intelligence for this election
      let ephemeralNet = this.activeElections.get(electionId);
      if (!ephemeralNet && this.config.enableEphemeralIntelligence) {
        ephemeralNet = new EphemeralIntelligence(electionId, {
          lifecycle: 'election',
          ttl: 86400000 // 24 hours
        });
        this.activeElections.set(electionId, ephemeralNet);
      }
      
      // Feature extraction
      const features = this.extractFeatures(voteData);
      
      // Process with FANN (use WASM if available)
      let prediction;
      if (this.wasmWrapper && !this.wasmWrapper.fallbackToJS) {
        prediction = this.wasmWrapper.forward(features);
      } else {
        prediction = this.fann.forward(features);
      }
      
      // Analyze with ephemeral intelligence if available
      let analysisResult = {
        prediction,
        confidence: Math.max(...prediction),
        timestamp: Date.now()
      };
      
      if (ephemeralNet) {
        analysisResult = await ephemeralNet.analyzeVotePattern(voteData);
      }
      
      // Coordinate with Synaptic-Mesh if enabled
      if (this.synapticMesh) {
        try {
          const meshResults = await this.synapticMesh.broadcastVoteAnalysis(
            voteData.id, 
            analysisResult
          );
          analysisResult.meshResults = meshResults;
        } catch (error) {
          console.warn('Synaptic-Mesh coordination failed:', error.message);
        }
      }
      
      // Coordinate with DAA if enabled
      if (this.daaIntegration) {
        try {
          const daaResult = await this.daaIntegration.submitToValidationAgents(voteData);
          analysisResult.daaValidation = daaResult;
        } catch (error) {
          console.warn('DAA validation failed:', error.message);
        }
      }
      
      // Update statistics
      this.updateProcessingStats(startTime, analysisResult);
      
      return {
        voteId: voteData.id,
        result: analysisResult,
        processingTime: Date.now() - startTime,
        success: true
      };
    } catch (error) {
      console.error('Error processing vote:', error);
      
      return {
        voteId: voteData.id,
        error: error.message,
        processingTime: Date.now() - startTime,
        success: false
      };
    }
  }
  
  /**
   * Process a batch of votes
   * @param {Object[]} voteBatch - Array of vote data to process
   * @param {string} electionId - Election identifier
   * @returns {Promise<Object[]>} Processing results
   */
  async processVoteBatch(voteBatch, electionId = 'default') {
    if (!this.initialized) {
      throw new Error('FANN Manager not initialized');
    }
    
    const startTime = Date.now();
    
    try {
      // Use parallel processing if enabled
      if (this.parallelProcessor && voteBatch.length > 100) {
        const results = await this.parallelProcessor.processVotes(
          voteBatch, 
          (vote) => this.processVote(vote, electionId)
        );
        
        this.processingStats.processedVotes += results.length;
        this.processingStats.processingTime += Date.now() - startTime;
        this.processingStats.averageProcessingTime = 
          this.processingStats.processingTime / this.processingStats.processedVotes;
        
        return results;
      } else {
        // Process sequentially for small batches
        const results = [];
        for (const vote of voteBatch) {
          const result = await this.processVote(vote, electionId);
          results.push(result);
        }
        
        return results;
      }
    } catch (error) {
      console.error('Error processing vote batch:', error);
      throw error;
    }
  }
  
  /**
   * Extract features from vote data
   * @param {Object} voteData - Raw vote data
   * @returns {number[]} Feature vector
   */
  extractFeatures(voteData) {
    // This is a simplified feature extraction
    // In a real implementation, this would be much more sophisticated
    return [
      voteData.timestamp || Date.now(),
      voteData.locationId || 0,
      voteData.voterIdHash || 0,
      voteData.ballotType || 0,
      voteData.votingMethod || 0,
      // Add more features as needed
    ].map(feature => Math.max(0, Math.min(1, feature))); // Normalize to [0,1]
  }
  
  /**
   * Update processing statistics
   * @param {number} startTime - Processing start time
   * @param {Object} result - Processing result
   */
  updateProcessingStats(startTime, result) {
    this.processingStats.totalVotes++;
    this.processingStats.processedVotes++;
    
    const processingTime = Date.now() - startTime;
    this.processingStats.processingTime += processingTime;
    this.processingStats.averageProcessingTime = 
      this.processingStats.processingTime / this.processingStats.processedVotes;
    
    // Count flagged votes
    if (result.isAnomaly || result.fraudRisk > 0.7) {
      this.processingStats.flaggedVotes++;
    }
  }
  
  /**
   * Cleanup resources for an election
   * @param {string} electionId - Election identifier
   */
  cleanupElection(electionId) {
    const ephemeralNet = this.activeElections.get(electionId);
    if (ephemeralNet) {
      ephemeralNet.cleanup();
      this.activeElections.delete(electionId);
      console.log(`Cleaned up resources for election ${electionId}`);
    }
  }
  
  /**
   * Cleanup all resources
   */
  cleanup() {
    // Cleanup ephemeral networks
    for (const [electionId, ephemeralNet] of this.activeElections.entries()) {
      ephemeralNet.cleanup();
    }
    this.activeElections.clear();
    
    // Cleanup FANN
    if (this.fann) {
      this.fann.dispose();
    }
    
    // Cleanup WASM wrapper
    if (this.wasmWrapper) {
      this.wasmWrapper.cleanup();
    }
    
    // Cleanup parallel processor
    if (this.parallelProcessor) {
      this.parallelProcessor.cleanup();
    }
    
    this.initialized = false;
    console.log('FANN Manager cleaned up successfully');
  }
  
  /**
   * Get system statistics
   * @returns {Object} System statistics
   */
  getStatistics() {
    return {
      initialized: this.initialized,
      processingStats: { ...this.processingStats },
      activeElections: this.activeElections.size,
      components: {
        fann: this.fann !== null,
        wasmWrapper: this.wasmWrapper !== null,
        performanceOptimizer: this.performanceOptimizer !== null,
        parallelProcessor: this.parallelProcessor !== null,
        synapticMesh: this.synapticMesh !== null,
        daaIntegration: this.daaIntegration !== null
      },
      config: { ...this.config },
      // Add component-specific statistics
      ...(this.parallelProcessor ? { parallelProcessor: this.parallelProcessor.getStatistics() } : {}),
      ...(this.synapticMesh ? { synapticMesh: this.synapticMesh.getStatistics() } : {}),
      ...(this.daaIntegration ? { daaIntegration: this.daaIntegration.getStatistics() } : {}),
      ...(this.performanceOptimizer ? { performanceOptimizer: this.performanceOptimizer.getMemoryStats() } : {})
    };
  }
  
  /**
   * Get ephemeral intelligence statistics
   * @returns {Object[]} Statistics for all active ephemeral networks
   */
  getEphemeralStatistics() {
    const stats = [];
    for (const [electionId, ephemeralNet] of this.activeElections.entries()) {
      stats.push({
        electionId,
        ...ephemeralNet.getStatistics()
      });
    }
    return stats;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FANNManager;
}