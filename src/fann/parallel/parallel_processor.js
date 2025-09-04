/**
 * Parallel Processing for High-Volume Vote Tabulation
 * Implements distributed processing for the ruv-FANN system
 */

class ParallelVoteProcessor {
  /**
   * Create a parallel vote processor
   * @param {number} workerCount - Number of worker threads to use
   */
  constructor(workerCount = navigator.hardwareConcurrency || 4) {
    this.workerCount = Math.max(1, workerCount);
    this.workers = [];
    this.taskQueue = [];
    this.availableWorkers = [];
    this.pendingTasks = new Map();
    
    // Initialize workers if we're in a browser environment
    if (typeof Worker !== 'undefined') {
      this.initializeWorkers();
    } else {
      console.warn('Web Workers not available, falling back to synchronous processing');
      this.useWorkers = false;
    }
  }
  
  /**
   * Initialize worker threads
   */
  initializeWorkers() {
    try {
      for (let i = 0; i < this.workerCount; i++) {
        // In a real implementation, this would load the actual worker script
        // For now, we'll simulate worker functionality
        const worker = new SimulatedWorker();
        worker.onmessage = this.handleWorkerMessage.bind(this);
        worker.onerror = this.handleWorkerError.bind(this);
        
        this.workers.push({
          worker,
          busy: false,
          id: i
        });
        
        this.availableWorkers.push(i);
      }
      
      this.useWorkers = true;
      console.log(`Initialized ${this.workerCount} parallel workers`);
    } catch (error) {
      console.error('Failed to initialize workers, falling back to synchronous processing:', error);
      this.useWorkers = false;
    }
  }
  
  /**
   * Process a batch of votes in parallel
   * @param {Object[]} voteBatch - Array of vote objects to process
   * @param {Function} processor - Function to process individual votes
   * @returns {Promise<Object[]>} Processed results
   */
  async processVotes(voteBatch, processor) {
    if (!this.useWorkers || voteBatch.length < 100) {
      // For small batches or when workers aren't available, process synchronously
      return voteBatch.map(vote => {
        try {
          return processor(vote);
        } catch (error) {
          return { error: error.message, voteId: vote.id };
        }
      });
    }
    
    // Split batch into chunks for parallel processing
    const chunkSize = Math.ceil(voteBatch.length / this.workerCount);
    const chunks = [];
    
    for (let i = 0; i < voteBatch.length; i += chunkSize) {
      chunks.push(voteBatch.slice(i, i + chunkSize));
    }
    
    // Distribute chunks to workers
    const promises = chunks.map((chunk, index) => 
      this.processChunkWithWorker(chunk, processor, index % this.workerCount)
    );
    
    // Wait for all chunks to complete
    const results = await Promise.all(promises);
    
    // Combine results
    return results.flat();
  }
  
  /**
   * Process a chunk of votes with a specific worker
   * @param {Object[]} chunk - Chunk of votes to process
   * @param {Function} processor - Vote processor function
   * @param {number} workerIndex - Index of worker to use
   * @returns {Promise<Object[]>} Processed results
   */
  processChunkWithWorker(chunk, processor, workerIndex) {
    return new Promise((resolve, reject) => {
      if (this.availableWorkers.length === 0) {
        // No workers available, queue the task
        this.taskQueue.push({ chunk, processor, workerIndex, resolve, reject });
        return;
      }
      
      // Get an available worker
      const workerId = this.availableWorkers.pop();
      const worker = this.workers[workerId];
      
      // Mark worker as busy
      worker.busy = true;
      
      // Store task information
      const taskId = Date.now() + Math.random();
      this.pendingTasks.set(taskId, { resolve, reject, workerId });
      
      // Send task to worker
      worker.worker.postMessage({
        type: 'PROCESS_VOTES',
        votes: chunk,
        processor: processor.toString(), // In reality, this would be more sophisticated
        id: taskId
      });
    });
  }
  
  /**
   * Handle message from worker
   * @param {MessageEvent} event - Message event from worker
   */
  handleWorkerMessage(event) {
    const { type, result, id, error } = event.data;
    
    if (type === 'PROCESSING_COMPLETE') {
      // Find the pending task
      const task = this.pendingTasks.get(id);
      if (task) {
        // Mark worker as available
        this.workers[task.workerId].busy = false;
        this.availableWorkers.push(task.workerId);
        
        // Resolve or reject the promise
        if (error) {
          task.reject(new Error(error));
        } else {
          task.resolve(result);
        }
        
        // Remove from pending tasks
        this.pendingTasks.delete(id);
        
        // Process next task in queue if available
        this.processNextTask();
      }
    }
  }
  
  /**
   * Handle worker error
   * @param {ErrorEvent} error - Error event from worker
   */
  handleWorkerError(error) {
    console.error('Worker error:', error);
    // In a real implementation, you might want to restart the worker
  }
  
  /**
   * Process the next task in the queue
   */
  processNextTask() {
    if (this.taskQueue.length > 0 && this.availableWorkers.length > 0) {
      const task = this.taskQueue.shift();
      this.processChunkWithWorker(task.chunk, task.processor, task.workerIndex)
        .then(task.resolve)
        .catch(task.reject);
    }
  }
  
  /**
   * Cleanup resources
   */
  cleanup() {
    for (const workerObj of this.workers) {
      if (workerObj.worker.terminate) {
        workerObj.worker.terminate();
      }
    }
    
    this.workers = [];
    this.availableWorkers = [];
    this.taskQueue = [];
    this.pendingTasks.clear();
  }
  
  /**
   * Get processor statistics
   * @returns {Object} Processor statistics
   */
  getStatistics() {
    return {
      workerCount: this.workerCount,
      availableWorkers: this.availableWorkers.length,
      busyWorkers: this.workers.filter(w => w.busy).length,
      queuedTasks: this.taskQueue.length,
      pendingTasks: this.pendingTasks.size
    };
  }
}

/**
 * Simulated Worker for demonstration purposes
 * In a real implementation, this would be a separate worker script
 */
class SimulatedWorker {
  constructor() {
    this.onmessage = null;
    this.onerror = null;
  }
  
  /**
   * Simulate posting a message to the worker
   * @param {Object} message - Message to post
   */
  postMessage(message) {
    // Simulate processing delay
    setTimeout(() => {
      try {
        if (message.type === 'PROCESS_VOTES') {
          // Simulate processing votes
          const results = message.votes.map(vote => ({
            voteId: vote.id,
            processedAt: Date.now(),
            // Simulate some processing result
            result: Math.random() > 0.1 ? 'valid' : 'flagged'
          }));
          
          // Send result back
          if (this.onmessage) {
            this.onmessage({
              data: {
                type: 'PROCESSING_COMPLETE',
                result: results,
                id: message.id
              }
            });
          }
        }
      } catch (error) {
        if (this.onerror) {
          this.onerror({
            message: error.message
          });
        }
      }
    }, 10); // Simulate processing time
  }
  
  /**
   * Simulate terminating the worker
   */
  terminate() {
    // In a real implementation, this would terminate the worker thread
    console.log('Simulated worker terminated');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ParallelVoteProcessor;
}