import path from 'path';
import { getReflectionLines } from './part-1';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const patterns = content.split('\n\n').map((pattern) => pattern.split('\n'));

const getNumColsDiffs = (pattern: string[], column1: number, column2: number): number => {
  let num = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i][column1] !== pattern[i][column2]) num++;
    if (num > 1) return num;
  }
  return num;
};

const getNumRowsDiffs = (pattern: string[], row1: number, row2: number): number => {
  let num = 0;
  for (let j = 0; j < pattern[0].length; j++) {
    if (pattern[row1][j] !== pattern[row2][j]) num++;
    if (num > 1) return num;
  }
  return num;
};

const reflectionLines = getReflectionLines();
const newReflectionLines: string[] = [];
console.log(reflectionLines);

let sum = 0;
for (let k = 0; k < patterns.length; k++) {
  const pattern = patterns[k];
  let biggestSymmetric = 0;

  // Rows
  for (let i = 0; i < pattern.length - 1; i++) {
    let [i1, i2] = [i, i + 1];
    let isSymmetric = true;
    let numDiffs = 0;
    while (numDiffs <= 1 && i1 >= 0 && i2 < pattern.length) {
      numDiffs += getNumRowsDiffs(pattern, i1, i2);
      if (numDiffs > 1) {
        isSymmetric = false;
        break;
      }
      i1--;
      i2++;
    }
    if (isSymmetric && numDiffs === 1 && reflectionLines[k] !== `row${i + 1}`) {
      biggestSymmetric = Math.max(biggestSymmetric, i + 1);
    }
  }

  if (biggestSymmetric > 0) {
    sum += biggestSymmetric * 100;
    newReflectionLines.push('row' + biggestSymmetric);
    continue;
  }

  // Columns
  for (let j = 0; j < pattern[0].length - 1; j++) {
    let [j1, j2] = [j, j + 1];
    let isSymmetric = true;
    let numDiffs = 0;
    while (numDiffs <= 1 && j1 >= 0 && j2 < pattern[0].length) {
      numDiffs += getNumColsDiffs(pattern, j1, j2);
      if (numDiffs > 1) {
        isSymmetric = false;
        break;
      }
      j1--;
      j2++;
    }
    if (isSymmetric && numDiffs === 1 && reflectionLines[k] !== `col${j + 1}`) {
      biggestSymmetric = Math.max(biggestSymmetric, j + 1);
    }
  }

  if (biggestSymmetric > 0) {
    sum += biggestSymmetric;
    newReflectionLines.push('col' + biggestSymmetric);
  }
}

console.log(newReflectionLines);
console.log(sum);
