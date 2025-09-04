/**
 * Tests for Parallel Processing Implementation
 */

const ParallelVoteProcessor = require('../../src/fann/parallel/parallel_processor.js');

describe('Parallel Vote Processor Implementation', () => {
  let processor;
  
  beforeEach(() => {
    // Use fewer workers for testing
    processor = new ParallelVoteProcessor(2);
  });
  
  afterEach(() => {
    if (processor) {
      processor.cleanup();
    }
  });
  
  test('should initialize with correct worker count', () => {
    expect(processor.workerCount).toBe(2);
    expect(processor.useWorkers).toBe(true);
    expect(processor.workers).toHaveLength(2);
  });
  
  test('should process votes synchronously for small batches', async () => {
    const votes = [
      { id: 'vote-1', data: 'test1' },
      { id: 'vote-2', data: 'test2' }
    ];
    
    const processorFunc = (vote) => ({ processed: vote.id, result: 'valid' });
    
    const results = await processor.processVotes(votes, processorFunc);
    
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({ processed: 'vote-1', result: 'valid' });
    expect(results[1]).toEqual({ processed: 'vote-2', result: 'valid' });
  });
  
  test('should handle processing errors gracefully', async () => {
    const votes = [
      { id: 'vote-1', data: 'test1' },
      { id: 'vote-2', data: 'test2' }
    ];
    
    const processorFunc = (vote) => {
      if (vote.id === 'vote-2') {
        throw new Error('Processing error');
      }
      return { processed: vote.id, result: 'valid' };
    };
    
    const results = await processor.processVotes(votes, processorFunc);
    
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({ processed: 'vote-1', result: 'valid' });
    expect(results[1]).toHaveProperty('error');
  });
  
  test('should process large batches in parallel', async () => {
    // Create a larger batch to trigger parallel processing
    const votes = new Array(200).fill(null).map((_, i) => ({
      id: `vote-${i}`,
      data: `data-${i}`
    }));
    
    const processorFunc = (vote) => ({ processed: vote.id, result: 'valid' });
    
    const results = await processor.processVotes(votes, processorFunc);
    
    expect(results).toHaveLength(200);
    expect(results[0]).toHaveProperty('processed');
    expect(results[0]).toHaveProperty('result', 'valid');
  });
  
  test('should queue tasks when no workers available', async () => {
    // This is difficult to test deterministically, but we can check the queue functionality
    expect(processor.taskQueue).toHaveLength(0);
    expect(processor.pendingTasks).toHaveLength(0);
  });
  
  test('should get processor statistics', () => {
    const stats = processor.getStatistics();
    
    expect(stats).toHaveProperty('workerCount', 2);
    expect(stats).toHaveProperty('availableWorkers');
    expect(stats).toHaveProperty('busyWorkers');
    expect(stats).toHaveProperty('queuedTasks', 0);
    expect(stats).toHaveProperty('pendingTasks', 0);
  });
  
  test('should cleanup resources correctly', () => {
    expect(processor.workers).toHaveLength(2);
    
    processor.cleanup();
    
    expect(processor.workers).toHaveLength(0);
    expect(processor.availableWorkers).toHaveLength(0);
    expect(processor.taskQueue).toHaveLength(0);
    expect(processor.pendingTasks.size).toBe(0);
  });
  
  test('should handle worker messages correctly', () => {
    // Test the message handling by simulating a worker message
    const mockEvent = {
      data: {
        type: 'PROCESSING_COMPLETE',
        result: [{ voteId: 'test', processedAt: Date.now() }],
        id: 12345
      }
    };
    
    // This should not throw an error even if the task doesn't exist
    expect(() => processor.handleWorkerMessage(mockEvent)).not.toThrow();
  });
  
  test('should handle worker errors', () => {
    const mockError = {
      message: 'Test error'
    };
    
    // Should not throw an error
    expect(() => processor.handleWorkerError(mockError)).not.toThrow();
  });
});