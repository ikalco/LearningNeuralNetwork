let n;

function setup() {
  createCanvas(600, 600);

  fetch("./data/mnist_train_100.csv")
    .then((res) => res.text())
    .then((text) => trainNetwork(text));

  background("#aaaaaa");
}

class NeuralNetowrk {
  constructor(inputnodes, hiddennodes, outputnodes, learningrate) {
    this.inodes = inputnodes;
    this.hnodes = hiddennodes;
    this.onodes = outputnodes;

    this.wih = randNormal(0.0, Math.pow(this.hnodes, -0.5), this.hnodes, this.inodes);
    this.who = randNormal(0.0, Math.pow(this.onodes, -0.5), this.onodes, this.hnodes);

    this.lr = learningrate;

    this.activation_function = sigmoid;
  }

  train(inputs_list, targets_list) {
    let inputs = TransposeMatrix(new Array(inputs_list));
    let targets = TransposeMatrix(new Array(targets_list));

    let hidden_inputs = MatrixDotProduct(this.wih, inputs);
    let hidden_outputs = ApplyToMatrix(hidden_inputs, this.activation_function);

    let final_inputs = MatrixDotProduct(this.who, hidden_outputs);
    let final_outputs = ApplyToMatrix(final_inputs, this.activation_function);

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

    let hidden_outputs = ApplyToMatrix(hidden_inputs, this.activation_function);

    let final_inputs = MatrixDotProduct(this.who, hidden_outputs);

    let final_outputs = ApplyToMatrix(final_inputs, this.activation_function);

    return final_outputs;
  }
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

    let targets = new Array(10).fill(0.01);
    targets[all_values.shift()] = 0.99;

    let inputs = all_values.map((_) => (parseFloat(_) / 255.0) * 0.99 + 0.01);

    n.train(inputs, targets);
  }
  for (let i = 0; i < data_list.length; i++) {
    let all_values = data_list[i].split(",");

    let targets = new Array(10).fill(0.01);
    targets[all_values.shift()] = 0.99;

    let inputs = all_values.map((_) => (parseFloat(_) / 255.0) * 0.99 + 0.01);

    n.train(inputs, targets);
  }
  for (let i = 0; i < data_list.length; i++) {
    let all_values = data_list[i].split(",");

    let targets = new Array(10).fill(0.01);
    targets[all_values.shift()] = 0.99;

    let inputs = all_values.map((_) => (parseFloat(_) / 255.0) * 0.99 + 0.01);

    n.train(inputs, targets);
  }

  console.log(data_list.length);
  console.timeEnd("Time to Learn: ");

  fetch("./data/mnist_test.csv")
    .then((res) => res.text())
    .then((text) => testNetwork(text));
}

function testNetwork(text) {
  console.time("Time to Test: ");
  let test_list = text.split("\n");

  let scorecard = [];

  for (let i = 0; i < test_list.length; i++) {
    let all_values = test_list[i].split(",");

    let correct_label = all_values.shift();
    console.log(`Correct Label: ${correct_label}`);

    let inputs = all_values.map((_) => (parseFloat(_) / 255.0) * 0.99 + 0.01);

    let results = n.query(inputs);

    let label = -1;
    let best = 0.01;

    for (let i = 0; i < results.length; i++) {
      if (results[i][0] > best) {
        best = results[i][0];
        label = i;
      }
    }

    if (label == correct_label) {
      scorecard.push(1);
    } else {
      scorecard.push(0);
    }

    console.log(`Network's Answer: ${label}`);
  }

  console.log(`Performance: ${scorecard.reduce((a, b) => a + b) / scorecard.length}`);
  console.timeEnd("Time to Test: ");

  for (const [key, val] of Object.entries(n)) {
    console.log(key, val);
  }
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
