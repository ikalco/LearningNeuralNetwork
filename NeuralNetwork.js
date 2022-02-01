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

  train(inputs, targets) {
    let outputs = this.feedforward(inputs);
    let errors = VectorSubVector(targets, outputs);
    outputs = ApplyToVector(outputs, (y) => y * (1 - y));
    outputs = VectorMultVector(outputs, errors);
    outputs = VectorMultFloat(outputs, this.learningRate);
    console.log(outputs);

    let hidden = this.layerOutputs[this.layerOutputs.length - 2];
    let weight_ho_deltas = VectorMultVector
  }

  static normalize(arr, max = Math.max(...arr)) {
    return arr.map((_) => _ / max);
  }
}