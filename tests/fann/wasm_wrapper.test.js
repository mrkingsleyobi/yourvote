/**
 * Tests for WASM Wrapper Implementation
 */

const WASMFANNWrapper = require('../../src/fann/webassembly/wasm_wrapper.js');

describe('WASM Wrapper Implementation', () => {
  let wasmWrapper;
  
  beforeEach(() => {
    wasmWrapper = new WASMFANNWrapper();
  });
  
  afterEach(() => {
    if (wasmWrapper) {
      wasmWrapper.cleanup();
    }
  });
  
  test('should check WASM support correctly', () => {
    // In Node.js environment, WASM is supported
    expect(wasmWrapper.checkWASMSupport()).toBe(true);
  });
  
  test('should initialize with fallback to JS', async () => {
    // Even if initialization "fails", it should fall back to JS
    const result = await wasmWrapper.initialize({
      layerSizes: [10, 8, 6, 3],
      activation: 'relu'
    });
    
    // Should fall back to JS implementation
    expect(wasmWrapper.fallbackToJS).toBe(true);
  });
  
  test('should perform forward pass with JS fallback', () => {
    // Force JS fallback
    wasmWrapper.fallbackToJS = true;
    wasmWrapper.initialized = true;
    
    const input = [0.1, 0.2, 0.3, 0.4, 0.5];
    const output = wasmWrapper.forward(input);
    
    expect(output).toHaveLength(5); // Default output size
    // Output should be normalized (softmax)
    const sum = output.reduce((acc, val) => acc + val, 0);
    expect(sum).toBeCloseTo(1.0, 5);
  });
  
  test('should throw error when not initialized', () => {
    wasmWrapper.initialized = false;
    const input = [0.1, 0.2, 0.3];
    
    expect(() => wasmWrapper.forward(input)).toThrow('WASM FANN not initialized');
  });
  
  test('should cleanup resources correctly', () => {
    wasmWrapper.cleanup();
    expect(wasmWrapper.initialized).toBe(false);
    expect(wasmWrapper.core).toBeNull();
  });
  
  test('should check SIMD support', () => {
    // This is a basic check, result may vary by environment
    expect(typeof wasmWrapper.checkSIMDSupport()).toBe('boolean');
  });
});