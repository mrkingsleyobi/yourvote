#!/bin/bash

# Build script for ruv-FANN Neural Network Optimization
# Compiles WebAssembly components and prepares the project for deployment

set -e  # Exit on any error

echo "Starting FANN optimization build process..."

# Create output directories
mkdir -p dist/fann/wasm
mkdir -p dist/fann/simd
mkdir -p dist/fann/optimization

echo "Created output directories"

# Compile WebAssembly core library
echo "Compiling WebAssembly core library..."
if command -v emcc &> /dev/null; then
    emcc src/fann/optimization/wasm/fann_core.cpp \
         -O3 \
         -s WASM=1 \
         -s EXPORTED_FUNCTIONS='["_main"]' \
         -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
         -s MODULARIZE=1 \
         -s EXPORT_NAME="FANNCore" \
         -o dist/fann/wasm/fann_core.js
    
    echo "WebAssembly core library compiled successfully"
else
    echo "Emscripten not found. Skipping WebAssembly compilation."
    echo "Please install Emscripten to compile WebAssembly components."
fi

# Compile SIMD-optimized operations
echo "Compiling SIMD-optimized operations..."
if command -v emcc &> /dev/null; then
    emcc src/fann/optimization/simd/simd_ops.cpp \
         -O3 \
         -msimd128 \
         -s WASM=1 \
         -s EXPORTED_FUNCTIONS='["_main"]' \
         -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
         -s MODULARIZE=1 \
         -s EXPORT_NAME="SIMDOps" \
         -o dist/fann/simd/simd_ops.js
    
    echo "SIMD-optimized operations compiled successfully"
else
    echo "Emscripten not found. Skipping SIMD compilation."
fi

# Copy JavaScript components
echo "Copying JavaScript components..."
cp src/fann/optimization/ephemeral/ephemeral_intelligence.js dist/fann/optimization/
cp src/fann/optimization/parallel/parallel_processor.js dist/fann/optimization/
cp src/fann/optimization/parallel/worker.js dist/fann/optimization/
cp src/fann/optimization/memory/memory_optimizer.js dist/fann/optimization/
cp src/fann/optimization/optimized_fann.js dist/fann/optimization/
cp src/fann/optimization/tests/performance_tests.js dist/fann/optimization/

echo "JavaScript components copied successfully"

# Copy documentation
echo "Copying documentation..."
cp docs/fann-optimization-implementation.md dist/

echo "Documentation copied successfully"

# Run tests
echo "Running performance tests..."
node src/fann/optimization/tests/performance_tests.js

echo "Performance tests completed"

# Create package.json for distribution
echo "Creating package.json for distribution..."
cat > dist/package.json << EOF
{
  "name": "ruv-fann-optimization",
  "version": "1.0.0",
  "description": "Optimized Fast Artificial Neural Network for AI-Native Election Voting System",
  "main": "fann/optimization/optimized_fann.js",
  "scripts": {
    "test": "node fann/optimization/performance_tests.js",
    "build": "./build.sh"
  },
  "keywords": [
    "neural-network",
    "webassembly",
    "simd",
    "optimization",
    "voting-system"
  ],
  "author": "AI-Native Election Voting System Team",
  "license": "MIT"
}
EOF

echo "Package.json created successfully"

echo "Build process completed successfully!"
echo "Distribution files are available in the 'dist' directory."