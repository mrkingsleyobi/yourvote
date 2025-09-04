#include <emscripten.h>
#include <emscripten/bind.h>
#include <vector>
#include <cmath>
#include <memory>

// Fast Artificial Neural Network (ruv-FANN) WebAssembly Core
// Optimized for real-time vote processing in the AI-Native Election Voting System

class FANNCore {
private:
    std::vector<std::vector<std::vector<float>>> weights;
    std::vector<std::vector<float>> bias;
    int inputLayer;
    std::vector<int> hiddenLayers;
    int outputLayer;
    float learningRate;
    std::string activationFunction;

    // Activation functions
    float relu(float x) {
        return std::max(0.0f, x);
    }

    float sigmoid(float x) {
        return 1.0f / (1.0f + std::exp(-x));
    }

    float tanh_activation(float x) {
        return std::tanh(x);
    }

    // Matrix-vector multiplication
    std::vector<float> dot(const std::vector<float>& vector, 
                          const std::vector<std::vector<float>>& matrix) {
        if (vector.size() != matrix.size()) {
            // Handle error appropriately
            return std::vector<float>();
        }

        std::vector<float> result(matrix[0].size(), 0.0f);

        for (size_t i = 0; i < matrix[0].size(); i++) {
            for (size_t j = 0; j < vector.size(); j++) {
                result[i] += vector[j] * matrix[j][i];
            }
        }

        return result;
    }

    // Apply activation function
    std::vector<float> activate(const std::vector<float>& x) {
        std::vector<float> result(x.size());
        for (size_t i = 0; i < x.size(); i++) {
            if (activationFunction == "relu") {
                result[i] = relu(x[i]);
            } else if (activationFunction == "sigmoid") {
                result[i] = sigmoid(x[i]);
            } else if (activationFunction == "tanh") {
                result[i] = tanh_activation(x[i]);
            } else {
                result[i] = x[i]; // No activation
            }
        }
        return result;
    }

    // Softmax activation for output layer
    std::vector<float> softmax(const std::vector<float>& x) {
        float maxVal = x[0];
        for (size_t i = 1; i < x.size(); i++) {
            if (x[i] > maxVal) maxVal = x[i];
        }

        std::vector<float> expValues(x.size());
        float sumExp = 0.0f;

        for (size_t i = 0; i < x.size(); i++) {
            expValues[i] = std::exp(x[i] - maxVal);
            sumExp += expValues[i];
        }

        std::vector<float> result(x.size());
        for (size_t i = 0; i < x.size(); i++) {
            result[i] = expValues[i] / sumExp;
        }

        return result;
    }

public:
    // Constructor
    FANNCore(int inputNodes, const std::vector<int>& hidden, int outputNodes, 
             const std::string& activation, float lr) 
        : inputLayer(inputNodes), hiddenLayers(hidden), outputLayer(outputNodes),
          activationFunction(activation), learningRate(lr) {
        initializeWeights();
        initializeBias();
    }

    // Initialize weight matrices
    void initializeWeights() {
        weights.clear();
        int prevLayerSize = inputLayer;

        // Hidden layers
        for (int layerSize : hiddenLayers) {
            std::vector<std::vector<float>> layerWeights(prevLayerSize, std::vector<float>(layerSize));
            // Xavier initialization
            float scale = std::sqrt(6.0f / (prevLayerSize + layerSize));
            for (int i = 0; i < prevLayerSize; i++) {
                for (int j = 0; j < layerSize; j++) {
                    layerWeights[i][j] = (static_cast<float>(rand()) / RAND_MAX - 0.5f) * 2.0f * scale;
                }
            }
            weights.push_back(layerWeights);
            prevLayerSize = layerSize;
        }

        // Output layer
        std::vector<std::vector<float>> outputWeights(prevLayerSize, std::vector<float>(outputLayer));
        float scale = std::sqrt(6.0f / (prevLayerSize + outputLayer));
        for (int i = 0; i < prevLayerSize; i++) {
            for (int j = 0; j < outputLayer; j++) {
                outputWeights[i][j] = (static_cast<float>(rand()) / RAND_MAX - 0.5f) * 2.0f * scale;
            }
        }
        weights.push_back(outputWeights);
    }

    // Initialize bias vectors
    void initializeBias() {
        bias.clear();

        // Hidden layers
        for (int layerSize : hiddenLayers) {
            bias.push_back(std::vector<float>(layerSize, 0.0f));
        }

        // Output layer
        bias.push_back(std::vector<float>(outputLayer, 0.0f));
    }

    // Forward propagation
    std::vector<float> forward(const std::vector<float>& input) {
        if (static_cast<int>(input.size()) != inputLayer) {
            // Handle error appropriately
            return std::vector<float>();
        }

        std::vector<float> current = input;

        // Propagate through hidden layers
        for (size_t i = 0; i < hiddenLayers.size(); i++) {
            std::vector<float> weighted = dot(current, weights[i]);
            for (size_t j = 0; j < weighted.size(); j++) {
                weighted[j] += bias[i][j];
            }
            current = activate(weighted);
        }

        // Output layer
        std::vector<float> output = dot(current, weights[weights.size() - 1]);
        for (size_t j = 0; j < output.size(); j++) {
            output[j] += bias[bias.size() - 1][j];
        }

        return softmax(output);
    }

    // Getters for network properties
    int getInputLayerSize() const { return inputLayer; }
    int getOutputLayerSize() const { return outputLayer; }
    std::vector<int> getHiddenLayerSizes() const { return hiddenLayers; }
};

// Emscripten bindings
using namespace emscripten;

EMSCRIPTEN_BINDINGS(fann_core) {
    class_<FANNCore>("FANNCore")
        .constructor<int, std::vector<int>, int, std::string, float>()
        .function("forward", &FANNCore::forward)
        .function("getInputLayerSize", &FANNCore::getInputLayerSize)
        .function("getOutputLayerSize", &FANNCore::getOutputLayerSize)
        .function("getHiddenLayerSizes", &FANNCore::getHiddenLayerSizes);

    register_vector<float>("VectorFloat");
    register_vector<int>("VectorInt");
    register_vector<std::vector<float>>("VectorVectorFloat");
    register_vector<std::vector<int>>("VectorVectorInt");
}