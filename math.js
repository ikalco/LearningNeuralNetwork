let sigmoid = (x) => 1 / (1 + Math.exp(-x));

function MatrixVectorProduct(Matrix, Vector) {
  let result = new Array(Matrix.length);
  for (let i = 0; i < Matrix.length; i++) {
    let sum = 0;
    for (let j = 0; j < Vector.length; j++) {
      sum += Matrix[i][j] * Vector[j];
    }
    result[i] = sum;
  }
  return result;
}

function VectorAddVector(left, right) {
  let result = new Array(left.length);
  for (let i = 0; i < left.length; i++) {
    result[i] = left[i] + right[i];
  }
  return result;
}

function VectorSubVector(left, right) {
  let result = new Array(left.length);
  for (let i = 0; i < left.length; i++) {
    result[i] = left[i] - right[i];
  }
  return result;
}

function VectorMultVector(left, right) {
  let result = new Array(left.length);
  for (let i = 0; i < left.length; i++) {
    result[i] = left[i] * right[i];
  }
  return result;
}

function VectorMultFloat(vector, float) {
  let result = new Array(vector.length);
  for (let i = 0; i < vector.length; i++) {
    result[i] = vector[i] * float;
  }
  return result;
}

function VectorDotVector(left, right) {
  let result = [];
  for (let i = 0; i < left.length; i++) {
    result[i] = [];
    for (let j = 0; j < right.length; j++) {
      result[i][j] = left[i] * right[j];
    }
  }
  return result;
}

function ApplyToVector(Vector, func) {
  let result = new Array(Vector.length);
  for (let i = 0; i < Vector.length; i++) {
    result[i] = func(Vector[i]);
  }
  return result;
}

function FloatSubVector(float, vector) {
  let result = new Array(vector.length);
  for (let i = 0; i < vector.length; i++) {
    result[i] = float - vector[i];
  }
  return result;
}

function TransposeMatrix(Matrix) {
  let result = [];
  for (var i = 0; i < Matrix[0].length; i++) {
    result[i] = [];
    for (var j = 0; j < Matrix.length; j++) {
      result[i][j] = Matrix[j][i];
    }
  }
  return result;
};

function MatrixAddMatrix(A, B) {
  for (var i = 0; i < A.length; i++) {
    for (var j = 0; j < A[0].length; j++) {
      A[i][j] = A[i][j] + B[i][j];
    }
  }
  return A;
};