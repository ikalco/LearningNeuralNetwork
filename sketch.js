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

function setup() {
  createCanvas(600, 600);

  fetch(trainingDataLink)
    .then((res) => res.text())
    .then((text) => trainNetwork(text));

  background("#aaaaaa");
}

function trainNetwork(text) {
  console.time("Time to Learn: ");
  let input_nodes = 784;
  let hidden_nodes = 100;
  let output_nodes = 10;

  let learning_rate = 0.75;

  n = new NeuralNetowrk(input_nodes, hidden_nodes, output_nodes, learning_rate);

  let data_list = text.split("\n");

  for (let i = 0; i < data_list.length; i++) {
    let all_values = data_list[i].split(",");
    if (all_values.length < 785) continue;

    let targets = new Array(10).fill(0.01);
    targets[all_values.shift()] = 0.99;

    let inputs = all_values.map((_) => (parseFloat(_) / 255.0) * 0.99 + 0.01);

    n.train(inputs, targets);
  }

  console.timeEnd("Time to Learn: ");

  fetch(testingDataLink)
    .then((res) => res.text())
    .then((text) => testNetworkMulti(text));
}

function testNetworkMulti(text) {
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
        console.log(`${b - a} ms`);
        console.log(`Performance: ${scorecard.reduce((a, b) => a + b) / scorecard.length}`);
      }
      w.terminate();
    };
  }
}

function testNetwork(text) {
  console.time("Time to Test: ");
  let test_list = text.split("\n");

  let scorecard = [];

  for (let i = 0; i < test_list.length; i++) {
    let all_values = test_list[i].split(",");
    if (all_values.length < 785) continue;

    let correct_label = all_values.shift();
    console.log(`Correct Label: ${correct_label}`);

    let inputs = all_values.map((_) => (parseFloat(_) / 255.0) * 0.99 + 0.01);

    let results = n.query(inputs).map((_) => _[0]);

    let label = results.indexOf(Math.max(...results));

    if (label == correct_label) {
      scorecard.push(1);
    } else {
      scorecard.push(0);
    }

    console.log(`Network's Answer: ${label}`);
  }

  console.log(`Performance: ${scorecard.reduce((a, b) => a + b) / scorecard.length}`);
  console.timeEnd("Time to Test: ");

  //for (const [key, val] of Object.entries(n)) {
  //  console.log(key, val);
  //}
}

function drawNumberFromList(list) {
  let size = width / 28;

  let imgVals = CreateMatrixFromList(list, 28, 28);

  noStroke();

  ApplyToMatrix(imgVals, (value, x, y) => {
    fill(255 - parseInt(value));
    rect(x * size, y * size, size, size);
  });
}
