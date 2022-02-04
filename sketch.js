let training_data = [
  {
    inputs: [0, 1],
    targets: [1],
  },
  {
    inputs: [1, 0],
    targets: [1],
  },
  {
    inputs: [0, 0],
    targets: [0],
  },
  {
    inputs: [1, 1],
    targets: [0],
  },
]

let testnn = new NeuralNetwork(2, 1, 2);
console.log(testnn);

for (let i = 0; i < 50000; i++) {
  let data = randomFromArray(training_data)
  testnn.stochastic_train(data.inputs, data.targets);
}

console.log(testnn.feedforward([0, 1]));
console.log(testnn.feedforward([1, 0]));
console.log(testnn.feedforward([0, 0]));
console.log(testnn.feedforward([1, 1]));

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}