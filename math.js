let sigmoid = (x) => 1 / (1 + Math.exp(-x));

/*
######################################################################
Array.map and Array.reduce are both really slow
Using normal for loops is way faster when manipulating lots of data.
######################################################################
*/

let MatrixVectorProduct = (Matrix, Vector) => {
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

let VectorAddVector = (left, right) => {
  let result = new Array(left.length);
  for (let i = 0; i < left.length; i++) {
    result[i] = left[i] + right[i];
  }
  return result;
}

let VectorSubVector = (left, right) => {
  let result = new Array(left.length);
  for (let i = 0; i < left.length; i++) {
    result[i] = left[i] - right[i];
  }
  return result;
}

let VectorMultVector = (left, right) => {
  let result = new Array(left.length);
  for (let i = 0; i < left.length; i++) {
    result[i] = left[i] * right[i];
  }
  return result;
}

let VectorMultFloat = (left, right) => {
  let result = new Array(left.length);
  for (let i = 0; i < left.length; i++) {
    result[i] = left[i] * right;
  }
  return result;
}

let ApplyToVector = (Vector, func) => {
  let result = new Array(Vector.length);
  for (let i = 0; i < Vector.length; i++) {
    result[i] = func(Vector[i]);
  }
  return result;
}

/////////////////////////////////////////////////////////////

//let MatrixDotProductTest = (A, B) => A.map((row, i) => B[0].map((_, j) => row.reduce((acc, _, n) => acc + A[i][n] * B[n][j], 0)));
let MatrixDotProduct = (A, B) => {
  let result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < B[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < A[0].length; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
};

//let ApplyToMatrix = (A, func = (x) => x) => A.map((col, x) => col.map((_, y) => func(_, x, y)));
let ApplyToMatrix = (Matrix, func = (x) => x) => {
  for (var i = 0; i < Matrix.length; i++) {
    for (var j = 0; j < Matrix[0].length; j++) {
      Matrix[i][j] = func(Matrix[i][j], i, j);
    }
  }
  return Matrix;
};

//let MatrixSubtractMatrix = (A, B) => A.map((row, x) => row.map((_, y) => _ - B[x][y]));
let MatrixSubtractMatrix = (A, B) => {
  for (var i = 0; i < A.length; i++) {
    for (var j = 0; j < A[0].length; j++) {
      A[i][j] = A[i][j] - B[i][j];
    }
  }
  return A;
};

//let FloatSubtractMatrix = (Float, Matrix) => Matrix.map((row) => row.map((_) => Float - _));
let FloatSubtractMatrix = (Float, Matrix) => {
  for (var i = 0; i < Matrix.length; i++) {
    for (var j = 0; j < Matrix[0].length; j++) {
      Matrix[i][j] = Float - Matrix[i][j];
    }
  }
  return Matrix;
};

//let MatrixMultMatrix = (A, B) => A.map((row, x) => row.map((_, y) => _ * B[x][y]));
let MatrixMultMatrix = (A, B) => {
  for (var i = 0; i < A.length; i++) {
    for (var j = 0; j < A[0].length; j++) {
      A[i][j] = A[i][j] * B[i][j];
    }
  }
  return A;
};

//let MatrixMultFloat = (Matrix, Float) => Matrix.map((row) => row.map((_) => _ * Float));
let MatrixMultFloat = (Matrix, Float) => {
  for (var i = 0; i < Matrix.length; i++) {
    for (var j = 0; j < Matrix[0].length; j++) {
      Matrix[i][j] = Matrix[i][j] * Float;
    }
  }
  return Matrix;
};

//let MatrixAddMatrix = (A, B) => A.map((row, x) => row.map((_, y) => _ + B[x][y]));
let MatrixAddMatrix = (A, B) => {
  for (var i = 0; i < A.length; i++) {
    for (var j = 0; j < A[0].length; j++) {
      A[i][j] = A[i][j] + B[i][j];
    }
  }
  return A;
};

//let TransposeMatrix = (Matrix) => new Array(Matrix[0].length).fill(0).map((col, x) => (col = new Array(Matrix.length).fill(0).map((_, y) => Matrix[y][x])));
let TransposeMatrix = (Matrix) => {
  let result = [];
  for (var i = 0; i < Matrix[0].length; i++) {
    result[i] = [];
    for (var j = 0; j < Matrix.length; j++) {
      result[i][j] = Matrix[j][i];
    }
  }
  return result;
};

let randNormal = (mean, sd, sizeX, sizeY) => new Array(sizeX).fill(0).map((col) => new Array(sizeY).fill(0).map((_) => randomGaussian(mean, sd)));

let CreateMatrixFromList = (values, sizeX, sizeY) =>
  values.length == sizeX * sizeY ? new Array(sizeX).fill(0).map((col, x) => new Array(sizeY).fill(0).map((_, y) => values[x + y * sizeX])) : false;
