let n;

class NeuralNetowrk {
  constructor(inputnodes, hiddennodes, outputnodes, learningrate) {
    this.inodes = inputnodes;
    this.hnodes = hiddennodes;
    this.onodes = outputnodes;

    this.wih = randNormal(0.0, Math.pow(this.hnodes, -0.5), this.hnodes, this.inodes);
    this.who = randNormal(0.0, Math.pow(this.onodes, -0.5), this.onodes, this.hnodes);

    this.lr = learningrate;
  }

  train(inputs_list, targets_list) {
    let inputs = TransposeMatrix(new Array(inputs_list));
    let targets = TransposeMatrix(new Array(targets_list));

    let hidden_inputs = MatrixDotProduct(this.wih, inputs);
    let hidden_outputs = ApplyToMatrix(hidden_inputs, sigmoid);

    let final_inputs = MatrixDotProduct(this.who, hidden_outputs);
    let final_outputs = ApplyToMatrix(final_inputs, sigmoid);

    let output_errors = MatrixSubtractMatrix(targets, final_outputs);

    let hidden_errors = MatrixDotProduct(TransposeMatrix(this.who), output_errors);

    this.who = MatrixAddMatrix(
      this.who,
      MatrixMultFloat(
        MatrixDotProduct(
          MatrixMultMatrix(MatrixMultMatrix(output_errors, final_outputs), FloatSubtractMatrix(1.0, final_outputs)),
          TransposeMatrix(hidden_outputs)
        ),
        this.lr
      )
    );

    this.wih = MatrixAddMatrix(
      this.wih,
      MatrixMultFloat(
        MatrixDotProduct(MatrixMultMatrix(MatrixMultMatrix(hidden_errors, hidden_outputs), FloatSubtractMatrix(1.0, hidden_outputs)), TransposeMatrix(inputs)),
        this.lr
      )
    );

    console.log("done");
  }

  query(inputs_list) {
    let inputs = TransposeMatrix(new Array(inputs_list));

    let hidden_inputs = MatrixDotProduct(this.wih, inputs);

    let hidden_outputs = ApplyToMatrix(hidden_inputs, sigmoid);

    let final_inputs = MatrixDotProduct(this.who, hidden_outputs);

    let final_outputs = ApplyToMatrix(final_inputs, sigmoid);

    return final_outputs;
  }
}

let trainingDataLink = "./data/mnist_train_100.csv";
let testingDataLink = "./data/mnist_test.csv";
let loadNetworkLink = "./trained_network.txt";

function setup() {
  createCanvas(600, 600);

  fetch(trainingDataLink)
    .then((res) => res.text())
    .then((text) => trainNetwork(text));
}

function loadNetwork(text) {
  let a = performance.now();
  let input_nodes = 784;
  let hidden_nodes = 200;
  let output_nodes = 10;

  let learning_rate = 0.2;

  n = new NeuralNetowrk(input_nodes, hidden_nodes, output_nodes, learning_rate);

  let data = text.split("\n");

  n.who = JSON.parse(data[0].split("'")[1]);
  n.wih = JSON.parse(data[1].split("'")[1]);

  let b = performance.now();
  console.log(`Loaded network successfully in: ${b - a}ms`);

  fetch(testingDataLink)
    .then((res) => res.text())
    .then((text) => testNetworkMulti(text));
}

function trainNetwork(text) {
  console.log("Starting to Train Network");
  let f = performance.now();
  let input_nodes = 784;
  let hidden_nodes = 200;
  let output_nodes = 10;

  let learning_rate = 0.2;
  let epochs = 7;

  n = new NeuralNetowrk(input_nodes, hidden_nodes, output_nodes, learning_rate);

  let training_data_list = text.split("\n");
  let test = training_data_list[0].split(",");
  test.shift();

  drawGrayscaleImgFromList(test);

  for (let j = 0; j < epochs; j++) {
    for (let i = 0; i < training_data_list.length; i++) {
      let all_values = training_data_list[i].split(",");
      if (all_values.length < 785) continue;

      let targets = new Array(10).fill(0.01);
      targets[all_values.shift()] = 0.99;

      let inputs = all_values.map((_) => (parseFloat(_) / 255.0) * 0.99 + 0.01);

      n.train(inputs, targets);
    }
  }

  let g = performance.now();
  console.log(`Training took: ${g - f}ms`);
  console.log("\n");

  fetch(testingDataLink)
    .then((res) => res.text())
    .then((text) => testNetworkMulti(text));
}

function testNetworkMulti(text) {
  console.log("Starting Multi-Threaded Network Test");
  let a = window.performance.now();
  let scorecard = [];

  let test_list = text.split("\n");
  test_list.pop();

  let numOfWorkers = 10;
  let finished_workers = 0;

  for (let i = 0; i < numOfWorkers; i++) {
    let worker_test_list = test_list.slice(i * (test_list.length / numOfWorkers), (i + 1) * (test_list.length / numOfWorkers));

    let w = new Worker("WorkerTestNetwork.js");
    w.postMessage([worker_test_list, n]);

    w.onmessage = function (e) {
      scorecard = scorecard.concat(e.data[0]);

      finished_workers++;
      if (finished_workers == numOfWorkers) {
        let b = performance.now();
        console.log(`Multi-Threaded Network Test Took: ${b - a} ms`);
        console.log(`Performance: ${(scorecard.reduce((c, d) => c + d) / scorecard.length) * 100}%`);
      }
      w.terminate();
    };
  }
}

function drawGrayscaleImgFromList(list) {
  let size = width / 28;

  let imgVals = CreateMatrixFromList(list, 28, 28);

  noStroke();

  ApplyToMatrix(imgVals, (value, x, y) => {
    fill(255 - parseInt(value));
    rect(x * size, y * size, size, size);
  });
}
