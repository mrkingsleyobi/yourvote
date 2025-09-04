/**
 * Tests for FANN Core Implementation
 */

const ruvFANN = require('../../src/fann/core/fann.js');

describe('ruvFANN Core Implementation', () => {
  let fann;
  
  beforeEach(() => {
    fann = new ruvFANN({
      inputNodes: 10,
      hiddenLayers: [8, 6],
      outputNodes: 3,
      activation: 'relu',
      learningRate: 0.01
    });
  });
  
  afterEach(() => {
    if (fann) {
      fann.dispose();
    }
  });
  
  test('should initialize with correct configuration', () => {
    expect(fann.inputLayer).toBe(10);
    expect(fann.hiddenLayers).toEqual([8, 6]);
    expect(fann.outputLayer).toBe(3);
    expect(fann.activationFunction).toBe('relu');
    expect(fann.learningRate).toBe(0.01);
  });
  
  test('should create correct weight matrices', () => {
    expect(fann.weights).toHaveLength(3); // 2 hidden layers + 1 output layer
    expect(fann.weights[0]).toHaveLength(8); // First hidden layer
    expect(fann.weights[0][0]).toHaveLength(10); // Connections to input layer
    expect(fann.weights[1]).toHaveLength(6); // Second hidden layer
    expect(fann.weights[1][0]).toHaveLength(8); // Connections to first hidden layer
    expect(fann.weights[2]).toHaveLength(3); // Output layer
    expect(fann.weights[2][0]).toHaveLength(6); // Connections to second hidden layer
  });
  
  test('should create correct bias vectors', () => {
    expect(fann.bias).toHaveLength(3); // 2 hidden layers + 1 output layer
    expect(fann.bias[0]).toHaveLength(8); // First hidden layer
    expect(fann.bias[1]).toHaveLength(6); // Second hidden layer
    expect(fann.bias[2]).toHaveLength(3); // Output layer
  });
  
  test('should perform forward propagation correctly', () => {
    const input = new Array(10).fill(0.5);
    const output = fann.forward(input);
    
    expect(output).toHaveLength(3);
    // Output should be normalized (softmax)
    const sum = output.reduce((acc, val) => acc + val, 0);
    expect(sum).toBeCloseTo(1.0, 5);
  });
  
  test('should throw error for invalid input size', () => {
    const input = new Array(5).fill(0.5); // Wrong size
    expect(() => fann.forward(input)).toThrow('Invalid input size');
  });
  
  test('should apply activation functions correctly', () => {
    // Test ReLU activation
    expect(fann.activate(5)).toBe(5);
    expect(fann.activate(-2)).toBe(0);
    
    // Test with different activation function
    const sigmoidFANN = new ruvFANN({
      inputNodes: 5,
      hiddenLayers: [4],
      outputNodes: 2,
      activation: 'sigmoid'
    });
    
    expect(sigmoidFANN.activate(0)).toBeCloseTo(0.5, 5);
    expect(sigmoidFANN.activate(10)).toBeCloseTo(1.0, 5);
    expect(sigmoidFANN.activate(-10)).toBeCloseTo(0.0, 5);
    
    sigmoidFANN.dispose();
  });
  
  test('should perform dot product correctly', () => {
    const vector = [1, 2, 3];
    const matrix = [
      [1, 2, 3],
      [4, 5, 6]
    ];
    
    // Manual calculation: [1*1+2*4+3*7, 1*2+2*5+3*8, 1*3+2*6+3*9]
    // But our matrix is transposed, so:
    // [1*1+2*2+3*3, 1*4+2*5+3*6] = [14, 32]
    const result = fann.dot(vector, matrix);
    expect(result).toEqual([14, 32]);
  });
  
  test('should dispose resources correctly', () => {
    expect(fann.weights).not.toBeNull();
    expect(fann.bias).not.toBeNull();
    
    fann.dispose();
    
    expect(fann.weights).toBeNull();
    expect(fann.bias).toBeNull();
  });
});