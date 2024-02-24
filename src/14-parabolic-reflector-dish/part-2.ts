import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const matrix = lines.map((line) => line.split(''));

const [numRows, numCols] = [matrix.length, matrix[0].length];

const shiftRocksUp = (matrix: string[][]) => {
  for (let j = 0; j < numCols; j++) {
    let countRocks = 0;
    for (let i = numRows - 1; i >= 0; i--) {
      const cell = matrix[i][j];
      if (cell === 'O') {
        countRocks++;
        matrix[i][j] = '.';
      } else if (cell === '#') {
        for (let tempI = i + 1; countRocks > 0; countRocks--) {
          matrix[tempI][j] = 'O';
          tempI++;
        }
      }
      if (i === 0) {
        for (let tempI = i; countRocks > 0; countRocks--) {
          matrix[tempI][j] = 'O';
          tempI++;
        }
      }
    }
  }
};

const shiftRocksLeft = (matrix: string[][]) => {
  for (let i = 0; i < numRows; i++) {
    let countRocks = 0;
    for (let j = numCols - 1; j >= 0; j--) {
      const cell = matrix[i][j];
      if (cell === 'O') {
        countRocks++;
        matrix[i][j] = '.';
      } else if (cell === '#') {
        for (let tempJ = j + 1; countRocks > 0; countRocks--) {
          matrix[i][tempJ] = 'O';
          tempJ++;
        }
      }
      if (j === 0) {
        for (let tempJ = j; countRocks > 0; countRocks--) {
          matrix[i][tempJ] = 'O';
          tempJ++;
        }
      }
    }
  }
};

const shiftRocksDown = (matrix: string[][]) => {
  for (let j = 0; j < numCols; j++) {
    let countRocks = 0;
    for (let i = 0; i < numRows; i++) {
      const cell = matrix[i][j];
      if (cell === 'O') {
        countRocks++;
        matrix[i][j] = '.';
      } else if (cell === '#') {
        for (let tempI = i - 1; countRocks > 0; countRocks--) {
          matrix[tempI][j] = 'O';
          tempI--;
        }
      }
      if (i === numRows - 1) {
        for (let tempI = i; countRocks > 0; countRocks--) {
          matrix[tempI][j] = 'O';
          tempI--;
        }
      }
    }
  }
};

const shiftRocksRight = (matrix: string[][]) => {
  for (let i = 0; i < numRows; i++) {
    let countRocks = 0;
    for (let j = 0; j < numCols; j++) {
      const cell = matrix[i][j];
      if (cell === 'O') {
        countRocks++;
        matrix[i][j] = '.';
      } else if (cell === '#') {
        for (let tempJ = j - 1; countRocks > 0; countRocks--) {
          matrix[i][tempJ] = 'O';
          tempJ--;
        }
      }
      if (j === numCols - 1) {
        for (let tempJ = j; countRocks > 0; countRocks--) {
          matrix[i][tempJ] = 'O';
          tempJ--;
        }
      }
    }
  }
};

const cycle = (matrix: string[][]) => {
  shiftRocksUp(matrix);
  shiftRocksLeft(matrix);
  shiftRocksDown(matrix);
  shiftRocksRight(matrix);
};

const linearizeMatrix = (matrix: string[][]): string => {
  return matrix.map((row) => row.join('')).join('');
};

const expandMatrix = (linear: string): string[][] => {
  const rows: string[][] = [];
  for (let i = 0; i < linear.length; i += numCols) {
    rows.push(linear.slice(i, i + numCols).split(''));
  }
  return rows;
};

const history: string[] = [];
let matrixLinear = linearizeMatrix(matrix);
let cycleSize = 0;
let cycleFoundAt = 0;
for (let i = 0; i < 1_000_000_000; i++) {
  if (history.includes(matrixLinear)) {
    cycleFoundAt = i;
    console.log(`Found cycle at ${cycleFoundAt} iterations`);
    cycleSize = i - history.indexOf(matrixLinear);
    console.log(`Cycle size: ${cycleSize}`);
    break;
  } else {
    const tempMatrix = expandMatrix(matrixLinear);
    cycle(tempMatrix);
    const newLinear = linearizeMatrix(tempMatrix);
    history.push(matrixLinear);
    matrixLinear = newLinear;
  }
}

const neededCycles = ((1_000_000_000 - cycleFoundAt) % cycleSize) + cycleFoundAt;

console.log(`Needed cycles: ${neededCycles}`);

for (let i = 0; i < neededCycles; i++) {
  cycle(matrix);
}

// get loads sum
let loadsSum = 0;
for (let i = 0; i < numRows; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    if (matrix[i][j] === 'O') {
      const load = numRows - i;
      loadsSum += load;
    }
  }
}

console.log(loadsSum);
