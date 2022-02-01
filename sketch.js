function setup() {
  let testnn = new NeuralNetwork(1, 2, 1);
  console.log(testnn);
  let inputs = NeuralNetwork.normalize([1]);
  let targets = NeuralNetwork.normalize([0, 1]);
  console.log(testnn.train(inputs, targets));
}