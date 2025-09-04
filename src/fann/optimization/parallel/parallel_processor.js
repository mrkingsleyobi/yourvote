// Parallel Processing Implementation for ruv-FANN
// Enables multi-threading support for high-volume vote tabulation

class ParallelProcessor {
    constructor(workerCount = navigator.hardwareConcurrency || 4) {
        this.workerCount = Math.min(workerCount, 8); // Limit to 8 workers max
        this.workers = [];
        this.workerQueue = [];
        this.taskQueue = [];
        this.taskCounter = 0;
        this.initialized = false;
    }

    /**
     * Initialize the parallel processing system
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.initialized) return;

        // Create worker pool
        for (let i = 0; i < this.workerCount; i++) {
            try {
                const worker = new Worker('/src/fann/optimization/parallel/worker.js');
                worker.id = i;
                worker.busy = false;
                
                worker.onmessage = (event) => {
                    this.handleWorkerMessage(event.data);
                };
                
                worker.onerror = (error) => {
                    console.error(`Worker ${i} error:`, error);
                };
                
                this.workers.push(worker);
                this.workerQueue.push(worker);
            } catch (error) {
                console.warn(`Failed to create worker ${i}:`, error);
            }
        }
        
        this.initialized = true;
        console.log(`ParallelProcessor initialized with ${this.workers.length} workers`);
    }

    /**
     * Process a batch of votes in parallel
     * @param {Array} voteBatch - Array of votes to process
     * @param {Object} networkConfig - FANN network configuration
     * @returns {Promise<Array>} Processed results
     */
    async processVoteBatch(voteBatch, networkConfig) {
        if (!this.initialized) {
            await this.initialize();
        }
        
        // Split batch into chunks for parallel processing
        const chunkSize = Math.ceil(voteBatch.length / this.workers.length);
        const chunks = [];
        
        for (let i = 0; i < voteBatch.length; i += chunkSize) {
            chunks.push(voteBatch.slice(i, i + chunkSize));
        }
        
        // Create promises for each chunk
        const promises = chunks.map((chunk, index) => {
            return this.submitTask({
                type: 'PROCESS_VOTES',
                data: {
                    votes: chunk,
                    networkConfig: networkConfig,
                    workerId: index
                }
            });
        });
        
        // Wait for all chunks to complete
        const results = await Promise.all(promises);
        
        // Combine results
        return results.flat();
    }

    /**
     * Submit a task to be processed by a worker
     * @param {Object} task - Task to process
     * @returns {Promise<any>} Task result
     */
    submitTask(task) {
        return new Promise((resolve, reject) => {
            const taskId = ++this.taskCounter;
            const taskWrapper = {
                id: taskId,
                task: task,
                resolve: resolve,
                reject: reject,
                timestamp: Date.now()
            };
            
            this.taskQueue.push(taskWrapper);
            this.processNextTask();
        });
    }

    /**
     * Process the next available task
     */
    processNextTask() {
        if (this.taskQueue.length === 0 || this.workerQueue.length === 0) {
            return;
        }
        
        const task = this.taskQueue.shift();
        const worker = this.workerQueue.shift();
        
        worker.busy = true;
        worker.currentTask = task;
        
        // Send task to worker
        worker.postMessage({
            id: task.id,
            ...task.task
        });
    }

    /**
     * Handle message from worker
     * @param {Object} message - Message from worker
     */
    handleWorkerMessage(message) {
        const { id, result, error } = message;
        
        // Find the worker that sent this message
        const worker = this.workers.find(w => w.currentTask && w.currentTask.id === id);
        if (!worker) {
            console.warn('Received message from unknown worker:', message);
            return;
        }
        
        // Get the task
        const task = worker.currentTask;
        worker.currentTask = null;
        worker.busy = false;
        
        // Add worker back to queue
        this.workerQueue.push(worker);
        
        // Resolve or reject the promise
        if (error) {
            task.reject(new Error(error));
        } else {
            task.resolve(result);
        }
        
        // Process next task if available
        this.processNextTask();
    }

    /**
     * Terminate all workers
     */
    terminate() {
        for (const worker of this.workers) {
            worker.terminate();
        }
        
        this.workers = [];
        this.workerQueue = [];
        this.taskQueue = [];
        this.initialized = false;
    }

    /**
     * Get processing statistics
     * @returns {Object} Statistics
     */
    getStatistics() {
        return {
            workerCount: this.workers.length,
            activeWorkers: this.workers.filter(w => w.busy).length,
            pendingTasks: this.taskQueue.length,
            availableWorkers: this.workerQueue.length,
            totalTasksProcessed: this.taskCounter
        };
    }
}

// Worker script (for inclusion in worker.js)
const WORKER_SCRIPT = `
self.onmessage = async function(event) {
    const { id, type, data } = event.data;
    
    try {
        let result;
        
        switch (type) {
            case 'PROCESS_VOTES':
                result = await processVotes(data);
                break;
            default:
                throw new Error(\`Unknown task type: \${type}\`);
        }
        
        self.postMessage({ id, result });
    } catch (error) {
        self.postMessage({ id, error: error.message });
    }
};

async function processVotes(data) {
    const { votes, networkConfig } = data;
    const results = [];
    
    // Import FANN library
    importScripts('/src/fann/core/fann.js');
    
    // Create network instance
    const network = new ruvFANN(networkConfig);
    
    // Process each vote
    for (const vote of votes) {
        try {
            const output = network.forward(vote.input);
            results.push({
                voteId: vote.id,
                output: output,
                processedAt: Date.now()
            });
        } catch (error) {
            results.push({
                voteId: vote.id,
                error: error.message,
                processedAt: Date.now()
            });
        }
    }
    
    return results;
}
`;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParallelProcessor, WORKER_SCRIPT };
}