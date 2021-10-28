let sigmoid = (x) => 1 / (1 + Math.exp(-x));

let MatrixDotProduct = (A, B) => A.map((row, i) => B[0].map((_, j) => row.reduce((acc, _, n) => acc + A[i][n] * B[n][j], 0)));

let ApplyToMatrix = (A, func = (x) => x) => A.map((col, x) => col.map((_, y) => func(_, x, y)));

let MatrixSubtractMatrix = (A, B) => A.map((row, x) => row.map((_, y) => _ - B[x][y]));

let FloatSubtractMatrix = (Float, Matrix) => Matrix.map((row) => row.map((_) => Float - _));

let MatrixMultMatrix = (A, B) => A.map((row, x) => row.map((_, y) => _ * B[x][y]));

let MatrixMultFloat = (Matrix, Float) => Matrix.map((row) => row.map((_) => _ * Float));

let MatrixAddMatrix = (A, B) => A.map((row, x) => row.map((_, y) => _ + B[x][y]));

let randNormal = (mean, sd, sizeX, sizeY) => new Array(sizeX).fill(0).map((col) => new Array(sizeY).fill(0).map((_) => randomGaussian(mean, sd)));

let TransposeMatrix = (Matrix) => new Array(Matrix[0].length).fill(0).map((row, y) => (row = new Array(Matrix.length).fill(0).map((_, x) => Matrix[x][y])));

let CreateMatrixFromList = (values, sizeX, sizeY) =>
  values.length == sizeX * sizeY ? new Array(sizeX).fill(0).map((col, x) => new Array(sizeY).fill(0).map((_, y) => values[x + y * sizeX])) : false;
