class NeuralNetwork {
  constructor(inputNodeCount, outputNodeCount, ...hiddenLayersNodeCounts) {
    this.inputNodeCount = inputNodeCount;
    this.outputNodeCount = outputNodeCount;

    let layersNodeCounts = [inputNodeCount, ...hiddenLayersNodeCounts, outputNodeCount];

    this.weights = new Array(layersNodeCounts.length - 1);

    for (let i = 0; i < layersNodeCounts.length - 1; i++) {
      this.weights[i] = new Array(layersNodeCounts[i + 1]);
      for (let j = 0; j < this.weights[i].length; j++) {
        this.weights[i][j] = new Array(layersNodeCounts[i]);
        for (let k = 0; k < this.weights[i][j].length; k++) {
          this.weights[i][j][k] = Math.random();
        }
      }
    }

    this.biases = new Array(layersNodeCounts.length - 1);

    for (let i = 1; i < layersNodeCounts.length; i++) {
      this.biases[i - 1] = new Array(layersNodeCounts[i]).fill(0);
    }

    this.layerOutputs = new Array(layersNodeCounts.length);
    this.learningRate = 0.1;
  }

  feedforward(inputs) {
    this.layerOutputs[0] = inputs;

    for (let i = 0; i < this.weights.length; i++) {
      let weighted = MatrixVectorProduct(this.weights[i], this.layerOutputs[i]);

      let biased = VectorAddVector(weighted, this.biases[i]);

      this.layerOutputs[i + 1] = ApplyToVector(biased, sigmoid);
    }

    return this.layerOutputs[this.layerOutputs.length - 1];
  }

  stochastic_train(inputs, targets) {
    if (inputs.length != this.inputNodeCount || targets.length != this.outputNodeCount) throw Error("A");

    // lr = learning rate
    // E = error
    // O = output
    // P = prev layer output

    // Δweight = lr * E * (O * (1 - O)) • P

    let output = this.feedforward(inputs);
    let error = VectorSubVector(targets, output);

    for (let i = 0; i < this.weights.length; i++) {
      let gradient = VectorMultFloat(VectorMultVector(error, VectorMultVector(output, FloatSubVector(1, output))), this.learningRate);

      let prevLayerOutput = this.layerOutputs[this.layerOutputs.length - (2 + i)];

      let weightDeltas = VectorDotVector(gradient, prevLayerOutput);

      this.weights[this.weights.length - (1 + i)] = MatrixAddMatrix(this.weights[this.weights.length - (1 + i)], weightDeltas);
      this.biases[this.biases.length - (1 + i)] = VectorAddVector(this.biases[this.biases.length - (1 + i)], gradient);

      output = this.layerOutputs[this.layerOutputs.length - (2 + i)];
      error = MatrixVectorProduct(TransposeMatrix(this.weights[this.weights.length - (1 + i)]), error);
    }
  }
}