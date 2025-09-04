// Worker script for parallel vote processing
self.onmessage = async function(event) {
    const { id, type, data } = event.data;
    
    try {
        let result;
        
        switch (type) {
            case 'PROCESS_VOTES':
                result = await processVotes(data);
                break;
            default:
                throw new Error(`Unknown task type: ${type}`);
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
    
    // Clean up
    if (network && typeof network.dispose === 'function') {
        network.dispose();
    }
    
    return results;
}