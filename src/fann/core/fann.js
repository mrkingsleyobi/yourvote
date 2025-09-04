/**
 * Fast Artificial Neural Network (ruv-FANN) Implementation
 * Optimized for real-time vote processing in the AI-Native Election Voting System
 */

class ruvFANN {
  /**
   * Initialize the FANN neural network
   * @param {Object} config - Network configuration
   * @param {number} config.inputNodes - Number of input nodes
   * @param {number[]} config.hiddenLayers - Array of hidden layer sizes
   * @param {number} config.outputNodes - Number of output nodes
   * @param {string} config.activation - Activation function ('sigmoid', 'relu', 'tanh')
   * @param {number} config.learningRate - Learning rate for training
   */
  constructor(config) {
    this.inputLayer = config.inputNodes || 50;
    this.hiddenLayers = config.hiddenLayers || [32, 16];
    this.outputLayer = config.outputNodes || 5;
    this.activationFunction = config.activation || 'relu';
    this.learningRate = config.learningRate || 0.001;
    
    // Initialize weights and biases
    this.weights = this.initializeWeights();
    this.bias = this.initializeBias();
    
    // Performance optimization flags
    this.useSIMD = config.useSIMD || false;
    this.quantized = config.quantized || false;
  }
  
  /**
   * Initialize weight matrices for all layers
   * @returns {Array} Array of weight matrices
   */
  initializeWeights() {
    const weights = [];
    let prevLayerSize = this.inputLayer;
    
    // Hidden layers
    for (const layerSize of this.hiddenLayers) {
      weights.push(this.createWeightMatrix(prevLayerSize, layerSize));
      prevLayerSize = layerSize;
    }
    
    // Output layer
    weights.push(this.createWeightMatrix(prevLayerSize, this.outputLayer));
    
    return weights;
  }
  
  /**
   * Create a weight matrix with random values
   * @param {number} rows - Number of rows
   * @param {number} cols - Number of columns
   * @returns {Array} 2D array of weights
   */
  createWeightMatrix(rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        // Xavier initialization for better convergence
        const weight = (Math.random() - 0.5) * 2 * Math.sqrt(6 / (rows + cols));
        row.push(weight);
      }
      matrix.push(row);
    }
    return matrix;
  }
  
  /**
   * Initialize bias vectors for all layers
   * @returns {Array} Array of bias vectors
   */
  initializeBias() {
    const bias = [];
    
    // Hidden layers
    for (const layerSize of this.hiddenLayers) {
      bias.push(new Array(layerSize).fill(0));
    }
    
    // Output layer
    bias.push(new Array(this.outputLayer).fill(0));
    
    return bias;
  }
  
  /**
   * Forward propagation through the network
   * @param {number[]} input - Input vector
   * @returns {number[]} Output vector
   */
  forward(input) {
    if (!Array.isArray(input) || input.length !== this.inputLayer) {
      throw new Error(`Invalid input size. Expected ${this.inputLayer}, got ${input.length}`);
    }
    
    let current = input;
    
    // Propagate through hidden layers
    for (let i = 0; i < this.hiddenLayers.length; i++) {
      current = this.activate(this.dot(current, this.weights[i]).map((val, idx) => 
        val + this.bias[i][idx]
      ));
    }
    
    // Output layer (no activation for final layer in some cases)
    const output = this.dot(current, this.weights[this.weights.length - 1]).map((val, idx) => 
      val + this.bias[this.bias.length - 1][idx]
    );
    
    return this.softmax(output); // Softmax for probability distribution
  }
  
  /**
   * Matrix-vector multiplication
   * @param {number[]} vector - Input vector
   * @param {number[][]} matrix - Weight matrix
   * @returns {number[]} Result vector
   */
  dot(vector, matrix) {
    if (vector.length !== matrix.length) {
      throw new Error(`Dimension mismatch: vector length ${vector.length}, matrix rows ${matrix.length}`);
    }
    
    const result = new Array(matrix[0].length).fill(0);
    
    for (let i = 0; i < matrix[0].length; i++) {
      for (let j = 0; j < vector.length; j++) {
        result[i] += vector[j] * matrix[j][i];
      }
    }
    
    return result;
  }
  
  /**
   * Activation function
   * @param {number|number[]} x - Input value or array
   * @returns {number|number[]} Activated value or array
   */
  activate(x) {
    if (Array.isArray(x)) {
      return x.map(val => this.activate(val));
    }
    
    switch (this.activationFunction) {
      case 'relu':
        return Math.max(0, x);
      case 'sigmoid':
        return 1 / (1 + Math.exp(-x));
      case 'tanh':
        return Math.tanh(x);
      default:
        return x;
    }
  }
  
  /**
   * Softmax activation for output layer
   * @param {number[]} x - Input array
   * @returns {number[]} Softmax output
   */
  softmax(x) {
    const maxVal = Math.max(...x);
    const expValues = x.map(val => Math.exp(val - maxVal));
    const sumExp = expValues.reduce((sum, val) => sum + val, 0);
    return expValues.map(val => val / sumExp);
  }
  
  /**
   * Dispose of network resources
   */
  dispose() {
    this.weights = null;
    this.bias = null;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ruvFANN;
}