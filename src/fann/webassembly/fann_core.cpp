/**
 * Fast Artificial Neural Network (ruv-FANN) Core Implementation
 * WebAssembly-optimized C++ version for cross-platform compatibility
 */

#include <emscripten/bind.h>
#include <vector>
#include <cmath>
#include <algorithm>

class FANNCore {
private:
    std::vector<std::vector<float>> weights;
    std::vector<std::vector<float>> bias;
    std::string activationFunction;
    bool useSIMD;

public:
    /**
     * Constructor for FANNCore
     * @param layerSizes Vector of layer sizes [input, hidden1, hidden2, ..., output]
     * @param activation Activation function name
     * @param simd Whether to use SIMD optimizations
     */
    FANNCore(const std::vector<int>& layerSizes, 
             const std::string& activation = "relu",
             bool simd = false) 
        : activationFunction(activation), useSIMD(simd) {
        // Initialize weights and biases
        initializeWeights(layerSizes);
    }
    
    /**
     * Initialize weight matrices and bias vectors
     * @param layerSizes Vector of layer sizes
     */
    void initializeWeights(const std::vector<int>& layerSizes) {
        weights.clear();
        bias.clear();
        
        for (size_t i = 0; i < layerSizes.size() - 1; i++) {
            int currentSize = layerSizes[i];
            int nextSize = layerSizes[i + 1];
            
            // Initialize weight matrix
            std::vector<std::vector<float>> layerWeights(nextSize, std::vector<float>(currentSize));
            for (int j = 0; j < nextSize; j++) {
                for (int k = 0; k < currentSize; k++) {
                    // Xavier initialization
                    float weight = (static_cast<float>(rand()) / RAND_MAX - 0.5f) * 
                                  2.0f * sqrtf(6.0f / (currentSize + nextSize));
                    layerWeights[j][k] = weight;
                }
            }
            weights.push_back(layerWeights);
            
            // Initialize bias vector
            std::vector<float> layerBias(nextSize, 0.0f);
            bias.push_back(layerBias);
        }
    }
    
    /**
     * Matrix-vector multiplication with SIMD optimization
     * @param input Input vector
     * @param weightMatrix Weight matrix
     * @return Result vector
     */
    std::vector<float> dotProduct(const std::vector<float>& input, 
                                 const std::vector<std::vector<float>>& weightMatrix) {
        std::vector<float> result(weightMatrix.size(), 0.0f);
        
        // Standard implementation (can be optimized with SIMD)
        for (size_t i = 0; i < weightMatrix.size(); i++) {
            for (size_t j = 0; j < input.size(); j++) {
                result[i] += input[j] * weightMatrix[i][j];
            }
        }
        
        return result;
    }
    
    /**
     * Activation function
     * @param x Input value
     * @return Activated value
     */
    float activate(float x) {
        if (activationFunction == "relu") {
            return std::max(0.0f, x);
        } else if (activationFunction == "sigmoid") {
            return 1.0f / (1.0f + expf(-x));
        } else if (activationFunction == "tanh") {
            return tanhf(x);
        } else {
            return x;
        }
    }
    
    /**
     * Apply activation function to vector
     * @param input Input vector
     * @return Activated vector
     */
    std::vector<float> activateVector(const std::vector<float>& input) {
        std::vector<float> result(input.size());
        for (size_t i = 0; i < input.size(); i++) {
            result[i] = activate(input[i]);
        }
        return result;
    }
    
    /**
     * Softmax activation
     * @param input Input vector
     * @return Softmax output
     */
    std::vector<float> softmax(const std::vector<float>& input) {
        std::vector<float> result(input.size());
        float maxVal = *std::max_element(input.begin(), input.end());
        float sum = 0.0f;
        
        for (size_t i = 0; i < input.size(); i++) {
            result[i] = expf(input[i] - maxVal);
            sum += result[i];
        }
        
        for (size_t i = 0; i < input.size(); i++) {
            result[i] /= sum;
        }
        
        return result;
    }
    
    /**
     * Forward propagation through the network
     * @param input Input vector
     * @return Output vector
     */
    std::vector<float> forward(const std::vector<float>& input) {
        std::vector<float> current = input;
        
        // Propagate through layers
        for (size_t i = 0; i < weights.size(); i++) {
            current = dotProduct(current, weights[i]);
            
            // Add bias
            for (size_t j = 0; j < current.size(); j++) {
                current[j] += bias[i][j];
            }
            
            // Apply activation (except for output layer)
            if (i < weights.size() - 1) {
                current = activateVector(current);
            }
        }
        
        // Apply softmax to output layer
        return softmax(current);
    }
    
    /**
     * Get network information
     * @return String with network info
     */
    std::string getInfo() {
        return "FANNCore with " + std::to_string(weights.size()) + " layers";
    }
};

// Binding for JavaScript
using namespace emscripten;

EMSCRIPTEN_BINDINGS(fann_core) {
    class_<FANNCore>("FANNCore")
        .constructor<std::vector<int>, std::string, bool>()
        .function("forward", &FANNCore::forward)
        .function("getInfo", &FANNCore::getInfo);
    
    register_vector<int>("VectorInt");
    register_vector<float>("VectorFloat");
    register_vector<std::vector<float>>("VectorVectorFloat");
}