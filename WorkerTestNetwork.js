importScripts("helper.js");

function testNetwork(test_list, n) {
  let scorecard = [];

  for (let i = 0; i < test_list.length; i++) {
    let all_values = test_list[i].split(",");
    if (all_values.length < 785) continue;

    let correct_label = all_values.shift();

    let inputs = all_values.map((_) => (parseFloat(_) / 255.0) * 0.99 + 0.01);

    let results = query(inputs, n.wih, n.who).map((_) => _[0]);

    let label = results.indexOf(Math.max(...results));

    if (label == correct_label) {
      scorecard.push(1);
    } else {
      scorecard.push(0);
    }
  }

  return scorecard;
}

function query(inputs_list, wih, who) {
  let inputs = TransposeMatrix(new Array(inputs_list));

  let hidden_inputs = MatrixDotProduct(wih, inputs);

  let hidden_outputs = ApplyToMatrix(hidden_inputs, sigmoid);

  let final_inputs = MatrixDotProduct(who, hidden_outputs);

  let final_outputs = ApplyToMatrix(final_inputs, sigmoid);

  return final_outputs;
}

onmessage = function (e) {
  let results = testNetwork(e.data[0], e.data[1]);
  postMessage([results]);
};
