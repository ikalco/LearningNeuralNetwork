class NeuralNetwork {
  constructor(inputNodeCount, outputNodeCount, numOfHiddenLayers, ...hiddenLayersNodeCounts) {
    this.inputNodeCount = inputNodeCount;
    this.outputNodeCount = outputNodeCount;
    this.numOfHiddenLayers = numOfHiddenLayers;
    this.hiddenLayersNodeCounts = hiddenLayersNodeCounts;
  }
}