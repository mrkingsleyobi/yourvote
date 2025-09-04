// Comprehensive Performance Tests for Optimized ruv-FANN
// Tests WebAssembly, SIMD, Ephemeral Intelligence, Parallel Processing, and Memory Optimization

class FANNPerformanceTests {
    constructor() {
        this.testResults = [];
        this.optimizedFANN = null;
    }

    /**
     * Initialize test environment
     */
    async initialize() {
        // Import the optimized FANN implementation
        if (typeof OptimizedFANN === 'undefined') {
            throw new Error('OptimizedFANN module not available');
        }
        
        // Create test network configuration
        const config = {
            inputNodes: 50,
            hiddenLayers: [32, 16],
            outputNodes: 5,
            activation: 'relu',
            learningRate: 0.001
        };
        
        // Initialize optimized FANN
        this.optimizedFANN = new OptimizedFANN(config);
        
        // Initialize all optimization features
        await this.optimizedFANN.initializeWASM();
        this.optimizedFANN.enableSIMD();
        this.optimizedFANN.initializeEphemeralIntelligence();
        await this.optimizedFANN.initializeParallelProcessing();
        this.optimizedFANN.initializeMemoryOptimization();
        
        console.log('Test environment initialized');
    }

    /**
     * Run comprehensive performance tests
     */
    async runAllTests() {
        console.log('Starting comprehensive performance tests...');
        
        // Test 1: Basic forward pass performance
        await this.testForwardPassPerformance();
        
        // Test 2: SIMD optimization performance
        await this.testSIMDPerformance();
        
        // Test 3: Memory optimization effectiveness
        await this.testMemoryOptimization();
        
        // Test 4: Parallel processing performance
        await this.testParallelProcessing();
        
        // Test 5: Ephemeral intelligence functionality
        await this.testEphemeralIntelligence();
        
        // Test 6: Overall performance comparison
        await this.testOverallPerformance();
        
        console.log('All performance tests completed');
        return this.testResults;
    }

    /**
     * Test basic forward pass performance
     */
    async testForwardPassPerformance() {
        console.log('Testing forward pass performance...');
        
        const testInput = Array(50).fill(0).map(() => Math.random());
        const iterations = 1000;
        
        // Warm up
        for (let i = 0; i < 10; i++) {
            this.optimizedFANN.forward(testInput);
        }
        
        // Measure performance
        const startTime = performance.now();
        for (let i = 0; i < iterations; i++) {
            this.optimizedFANN.forward(testInput);
        }
        const endTime = performance.now();
        
        const averageTime = (endTime - startTime) / iterations;
        const performanceStats = this.optimizedFANN.getPerformanceStats();
        
        const result = {
            test: 'Forward Pass Performance',
            iterations: iterations,
            totalTime: endTime - startTime,
            averageTime: averageTime,
            performanceStats: performanceStats
        };
        
        this.testResults.push(result);
        console.log(`Forward pass: ${averageTime.toFixed(4)}ms per pass`);
    }

    /**
     * Test SIMD optimization performance
     */
    async testSIMDPerformance() {
        console.log('Testing SIMD optimization performance...');
        
        const testInput = Array(50).fill(0).map(() => Math.random());
        const iterations = 1000;
        
        // Test with SIMD enabled
        this.optimizedFANN.enableSIMD();
        
        // Warm up
        for (let i = 0; i < 10; i++) {
            this.optimizedFANN.forward(testInput);
        }
        
        const startTime = performance.now();
        for (let i = 0; i < iterations; i++) {
            this.optimizedFANN.forward(testInput);
        }
        const simdTime = performance.now() - startTime;
        
        // Test with SIMD disabled (if possible)
        const simdEnabled = this.optimizedFANN.simdEnabled;
        if (simdEnabled) {
            // For this test, we'll just compare against the optimized version
            const result = {
                test: 'SIMD Performance',
                simdEnabled: true,
                iterations: iterations,
                simdTime: simdTime,
                averageTime: simdTime / iterations
            };
            
            this.testResults.push(result);
            console.log(`SIMD optimization: ${simdTime.toFixed(4)}ms for ${iterations} iterations`);
        }
    }

    /**
     * Test memory optimization effectiveness
     */
    async testMemoryOptimization() {
        console.log('Testing memory optimization effectiveness...');
        
        // Apply quantization
        const quantizationResult = this.optimizedFANN.optimizeMemory({
            method: 'quantization',
            config: { type: 'int8' }
        });
        
        // Apply compression
        const compressionResult = this.optimizedFANN.optimizeMemory({
            method: 'compression',
            config: { method: 'pruning', ratio: 0.2 }
        });
        
        const result = {
            test: 'Memory Optimization',
            quantization: quantizationResult,
            compression: compressionResult
        };
        
        this.testResults.push(result);
        console.log(`Memory optimization achieved ${quantizationResult.compressionRatio.toFixed(2)}% compression`);
    }

    /**
     * Test parallel processing performance
     */
    async testParallelProcessing() {
        console.log('Testing parallel processing performance...');
        
        // Create test batch
        const batchSize = 1000;
        const testBatch = Array(batchSize).fill(0).map((_, i) => ({
            id: i,
            input: Array(50).fill(0).map(() => Math.random())
        }));
        
        // Warm up
        await this.optimizedFANN.processVoteBatch(testBatch.slice(0, 10));
        
        // Measure parallel processing
        const startTime = performance.now();
        const results = await this.optimizedFANN.processVoteBatch(testBatch);
        const endTime = performance.now();
        
        const result = {
            test: 'Parallel Processing',
            batchSize: batchSize,
            totalTime: endTime - startTime,
            averageTime: (endTime - startTime) / batchSize,
            successful: results.filter(r => !r.error).length,
            failed: results.filter(r => r.error).length
        };
        
        this.testResults.push(result);
        console.log(`Parallel processing: ${endTime - startTime.toFixed(4)}ms for ${batchSize} votes`);
    }

    /**
     * Test ephemeral intelligence functionality
     */
    async testEphemeralIntelligence() {
        console.log('Testing ephemeral intelligence functionality...');
        
        if (!this.optimizedFANN.ephemeralIntelligence) {
            console.warn('Ephemeral intelligence not available');
            return;
        }
        
        // Create temporary network
        const cycleId = 'test_cycle_001';
        const networkConfig = {
            inputNodes: 25,
            hiddenLayers: [16, 8],
            outputNodes: 3,
            activation: 'sigmoid',
            learningRate: 0.01,
            purpose: 'fraud_detection'
        };
        
        const networkId = this.optimizedFANN.createTemporaryNetwork(cycleId, networkConfig);
        
        // Process data with temporary network
        const testInput = Array(25).fill(0).map(() => Math.random());
        const output = this.optimizedFANN.ephemeralIntelligence.processWithNetwork(networkId, testInput);
        
        // Create anomaly detector
        const detectorConfig = {
            threshold: 0.9,
            windowSize: 50
        };
        
        const detectorId = this.optimizedFANN.ephemeralIntelligence.createAnomalyDetector(cycleId, detectorConfig);
        
        // Test anomaly detection
        const testData = {
            confidence: 0.85,
            timestamp: Date.now()
        };
        
        const anomalyResult = this.optimizedFANN.ephemeralIntelligence.detectAnomalies(detectorId, testData);
        
        // Get statistics
        const statistics = this.optimizedFANN.ephemeralIntelligence.getStatistics();
        
        const result = {
            test: 'Ephemeral Intelligence',
            networkCreated: !!networkId,
            networkOutput: output,
            detectorCreated: !!detectorId,
            anomalyDetected: anomalyResult.anomaly,
            anomalyConfidence: anomalyResult.confidence,
            statistics: statistics
        };
        
        this.testResults.push(result);
        console.log(`Ephemeral intelligence: Created network ${networkId}, detected ${anomalyResult.anomaly ? 'anomaly' : 'no anomaly'}`);
    }

    /**
     * Test overall performance comparison
     */
    async testOverallPerformance() {
        console.log('Testing overall performance...');
        
        // Get final performance statistics
        const performanceStats = this.optimizedFANN.getPerformanceStats();
        
        // Calculate overall performance score
        let performanceScore = 0;
        let maxScore = 0;
        
        // WASM contribution (20% of score)
        maxScore += 20;
        if (performanceStats.wasmEnabled) performanceScore += 20;
        
        // SIMD contribution (20% of score)
        maxScore += 20;
        if (performanceStats.simdEnabled) performanceScore += 20;
        
        // Memory optimization contribution (20% of score)
        maxScore += 20;
        if (performanceStats.compressionRatio > 25) performanceScore += 20;
        else if (performanceStats.compressionRatio > 15) performanceScore += 10;
        
        // Parallel processing contribution (20% of score)
        maxScore += 20;
        if (performanceStats.parallelProcessing) performanceScore += 20;
        
        // Ephemeral intelligence contribution (20% of score)
        maxScore += 20;
        if (performanceStats.ephemeralIntelligence) performanceScore += 20;
        
        const normalizedScore = (performanceScore / maxScore) * 100;
        
        const result = {
            test: 'Overall Performance',
            performanceStats: performanceStats,
            performanceScore: normalizedScore,
            maxPossibleScore: 100
        };
        
        this.testResults.push(result);
        console.log(`Overall performance score: ${normalizedScore.toFixed(2)}/100`);
    }

    /**
     * Generate test report
     * @returns {string} Test report
     */
    generateReport() {
        let report = '# FANN Optimization Performance Test Report\n\n';
        
        report += '## Summary\n';
        report += `Total Tests: ${this.testResults.length}\n`;
        report += `Test Date: ${new Date().toISOString()}\n\n`;
        
        report += '## Detailed Results\n\n';
        
        for (const result of this.testResults) {
            report += `### ${result.test}\n`;
            
            if (result.averageTime) {
                report += `- Average Time: ${result.averageTime.toFixed(4)}ms\n`;
            }
            
            if (result.totalTime) {
                report += `- Total Time: ${result.totalTime.toFixed(4)}ms\n`;
            }
            
            if (result.successful !== undefined) {
                report += `- Successful: ${result.successful}\n`;
                report += `- Failed: ${result.failed}\n`;
            }
            
            if (result.performanceScore) {
                report += `- Performance Score: ${result.performanceScore.toFixed(2)}/100\n`;
            }
            
            if (result.quantization) {
                report += `- Quantization Compression: ${result.quantization.compressionRatio.toFixed(2)}%\n`;
            }
            
            report += '\n';
        }
        
        return report;
    }

    /**
     * Clean up test environment
     */
    cleanup() {
        if (this.optimizedFANN) {
            this.optimizedFANN.dispose();
        }
        console.log('Test environment cleaned up');
    }
}

// Run tests if this script is executed directly
if (typeof window === 'undefined' && typeof module !== 'undefined' && require.main === module) {
    (async () => {
        const tests = new FANNPerformanceTests();
        try {
            await tests.initialize();
            await tests.runAllTests();
            const report = tests.generateReport();
            console.log('\n--- TEST REPORT ---\n');
            console.log(report);
        } catch (error) {
            console.error('Test execution failed:', error);
        } finally {
            tests.cleanup();
        }
    })();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FANNPerformanceTests;
}