import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const patterns = content.split('\n\n').map((pattern) => pattern.split('\n'));

const areColumnsEqual = (pattern: string[], column1: number, column2: number): boolean => {
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i][column1] !== pattern[i][column2]) return false;
  }
  return true;
};

let sum = 0;
for (const pattern of patterns) {
  const equalConsecutiveRows: [number, number][] = [];

  for (let i = 0; i < pattern.length - 1; i++) {
    const [row1, row2] = [pattern[i], pattern[i + 1]];
    if (row1 === row2) equalConsecutiveRows.push([i, i + 1]);
  }

  let biggestSymmetric = 0;

  for (const rows of equalConsecutiveRows) {
    let [i1, i2] = rows;
    let isSymmetric = true;
    while (i1 >= 0 && i2 < pattern.length) {
      if (pattern[i1] !== pattern[i2]) {
        isSymmetric = false;
        break;
      }
      i1--;
      i2++;
    }
    if (isSymmetric) {
      biggestSymmetric = Math.max(biggestSymmetric, rows[0] + 1);
    }
  }

  if (biggestSymmetric > 0) {
    sum += biggestSymmetric * 100;
    continue;
  }

  const equalConsecutiveColumns: [number, number][] = [];

  for (let j = 0; j < pattern[0].length - 1; j++) {
    if (areColumnsEqual(pattern, j, j + 1)) equalConsecutiveColumns.push([j, j + 1]);
  }

  biggestSymmetric = 0;

  for (const cols of equalConsecutiveColumns) {
    let [j1, j2] = cols;
    let isSymmetric = true;
    while (j1 >= 0 && j2 < pattern[0].length) {
      if (!areColumnsEqual(pattern, j1, j2)) {
        isSymmetric = false;
        break;
      }
      j1--;
      j2++;
    }
    if (isSymmetric) {
      biggestSymmetric = Math.max(biggestSymmetric, cols[0] + 1);
    }
  }

  sum += biggestSymmetric;
}

console.log(sum);
