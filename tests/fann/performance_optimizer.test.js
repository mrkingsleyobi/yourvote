/**
 * Tests for Performance Optimization Implementation
 */

const { PerformanceOptimizer, MemoryPool, LRUCache } = require('../../src/fann/optimization/performance_optimizer.js');

describe('Performance Optimization Implementation', () => {
  let optimizer;
  
  beforeEach(() => {
    optimizer = new PerformanceOptimizer();
  });
  
  test('should initialize with default values', () => {
    expect(optimizer.memoryPool).toBeInstanceOf(MemoryPool);
    expect(optimizer.cache).toBeInstanceOf(LRUCache);
    expect(optimizer.batchSize).toBe(32);
  });
  
  test('should quantize model correctly', () => {
    const model = {
      weights: [
        [[0.1, -0.2, 0.3], [0.4, -0.5, 0.6]],
        [[0.7, -0.8], [0.9, -1.0], [1.1, -1.2]]
      ],
      bias: [
        [0.1, 0.2],
        [0.3, 0.4, 0.5]
      ]
    };
    
    const quantized = optimizer.quantizeModel(model, 8);
    
    expect(quantized.weights).toHaveLength(2);
    expect(quantized.bias).toHaveLength(2);
    expect(quantized.bits).toBe(8);
    expect(quantized.scale).toBeGreaterThan(0);
    expect(quantized.zeroPoint).toBeGreaterThanOrEqual(0);
    
    // Check that weights are now integers
    quantized.weights.forEach(layer => {
      layer.forEach(row => {
        row.forEach(weight => {
          expect(Number.isInteger(weight)).toBe(true);
        });
      });
    });
  });
  
  test('should calculate scale and zero point correctly', () => {
    const weights = [[[0.1, -0.2, 0.3], [0.4, -0.5, 0.6]]];
    
    const scale = optimizer.calculateScale(weights, 8);
    const zeroPoint = optimizer.calculateZeroPoint(weights, 8);
    
    expect(typeof scale).toBe('number');
    expect(scale).toBeGreaterThan(0);
    expect(Number.isInteger(zeroPoint)).toBe(true);
  });
  
  test('should batch process votes', () => {
    const votes = new Array(100).fill(null).map((_, i) => ({
      id: `vote-${i}`,
      data: `data-${i}`
    }));
    
    const processor = (vote) => ({ processed: vote.id });
    
    const results = optimizer.batchProcess(votes, processor);
    
    expect(results).toHaveLength(100);
    expect(results[0]).toHaveProperty('processed');
  });
  
  test('should perform SIMD dot product', () => {
    const a = [1, 2, 3];
    const b = [4, 5, 6];
    
    const result = optimizer.simdDotProduct(a, b);
    
    // 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32
    expect(result).toBe(32);
  });
  
  test('should throw error for mismatched vector dimensions', () => {
    const a = [1, 2, 3];
    const b = [4, 5];
    
    expect(() => optimizer.simdDotProduct(a, b)).toThrow('Vector dimensions must match');
  });
  
  test('should get memory statistics', () => {
    const stats = optimizer.getMemoryStats();
    
    expect(stats).toHaveProperty('poolUsage');
    expect(stats).toHaveProperty('cacheSize');
    expect(stats).toHaveProperty('batchSize', 32);
  });
});

describe('Memory Pool', () => {
  let pool;
  
  beforeEach(() => {
    pool = new MemoryPool(1024); // 1KB pool
  });
  
  test('should allocate memory blocks', () => {
    const block1 = pool.allocate(100);
    const block2 = pool.allocate(200);
    
    expect(block1).toBeInstanceOf(Uint8Array);
    expect(block1).toHaveLength(100);
    expect(block2).toHaveLength(200);
  });
  
  test('should throw error when not enough memory', () => {
    expect(() => pool.allocate(2048)).toThrow('Not enough memory in pool');
  });
  
  test('should deallocate memory blocks', () => {
    const block = pool.allocate(100);
    expect(() => pool.deallocate(block)).not.toThrow();
  });
  
  test('should throw error when deallocating unknown buffer', () => {
    const fakeBuffer = new Uint8Array(100);
    expect(() => pool.deallocate(fakeBuffer)).toThrow('Buffer not found in allocated blocks');
  });
  
  test('should merge free blocks', () => {
    const block1 = pool.allocate(300);
    const block2 = pool.allocate(300);
    const block3 = pool.allocate(400);
    
    // Deallocate in reverse order to test merging
    pool.deallocate(block3);
    pool.deallocate(block2);
    pool.deallocate(block1);
    
    const stats = pool.getUsage();
    expect(stats.free).toBe(1024);
  });
  
  test('should get usage statistics', () => {
    const stats = pool.getUsage();
    
    expect(stats).toHaveProperty('allocated', 0);
    expect(stats).toHaveProperty('free', 1024);
    expect(stats).toHaveProperty('total', 1024);
    expect(stats).toHaveProperty('utilization', 0);
  });
});

describe('LRU Cache', () => {
  let cache;
  
  beforeEach(() => {
    cache = new LRUCache(3); // Max 3 items
  });
  
  test('should set and get values', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });
  
  test('should return undefined for missing keys', () => {
    expect(cache.get('missing')).toBeUndefined();
  });
  
  test('should evict least recently used items', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');
    
    // Access key1 to make it recently used
    cache.get('key1');
    
    // Add a new item, should evict key2 (least recently used)
    cache.set('key4', 'value4');
    
    expect(cache.get('key1')).toBe('value1');
    expect(cache.get('key2')).toBeUndefined();
    expect(cache.get('key3')).toBe('value3');
    expect(cache.get('key4')).toBe('value4');
  });
  
  test('should check key existence', () => {
    cache.set('key1', 'value1');
    expect(cache.has('key1')).toBe(true);
    expect(cache.has('key2')).toBe(false);
  });
  
  test('should get cache size', () => {
    expect(cache.size()).toBe(0);
    
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    
    expect(cache.size()).toBe(2);
  });
});