import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const matrix = lines.map((line) => line.split(''));

// shift rocks up
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    if (matrix[i][j] === 'O') {
      let [x, y] = [i - 1, j];
      while (x >= 0 && matrix[x][y] === '.') {
        matrix[x][y] = 'O';
        matrix[x + 1][y] = '.';
        x--;
      }
    }
  }
}

// get loads sum
let loadsSum = 0;
const numRows = matrix.length;

for (let i = 0; i < numRows; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    if (matrix[i][j] === 'O') {
      const load = numRows - i;
      loadsSum += load;
    }
  }
}

console.log(loadsSum);
