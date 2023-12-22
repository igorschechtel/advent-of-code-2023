import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const isDigit = (char: string) => {
  return /\d/.test(char);
};

const getNumberFromDigit = (i: number, j: number) => {
  let number = lines[i][j];

  let k = 1;
  let left = lines[i]?.[j - k];
  while (isDigit(left)) {
    number = left + number;
    k++;
    left = lines[i]?.[j - k];
  }

  k = 1;
  let right = lines[i]?.[j + k];
  while (isDigit(right)) {
    number = number + right;
    k++;
    right = lines[i]?.[j + k];
  }

  return Number(number);
};

const findAdjacentNumbers = (i: number, j: number) => {
  const left = lines[i]?.[j - 1];
  const right = lines[i]?.[j + 1];
  const top = lines[i - 1]?.[j];
  const bottom = lines[i + 1]?.[j];
  const topLeft = lines[i - 1]?.[j - 1];
  const topRight = lines[i - 1]?.[j + 1];
  const bottomLeft = lines[i + 1]?.[j - 1];
  const bottomRight = lines[i + 1]?.[j + 1];

  const adjacentNumbers: number[] = [];
  if (isDigit(left)) {
    const number = getNumberFromDigit(i, j - 1);
    adjacentNumbers.push(number);
  }
  if (isDigit(right)) {
    const number = getNumberFromDigit(i, j + 1);
    adjacentNumbers.push(number);
  }

  let isFormingNumber = false;
  if (isDigit(topLeft)) {
    isFormingNumber = true;
    const number = getNumberFromDigit(i - 1, j - 1);
    adjacentNumbers.push(number);
  }
  if (isFormingNumber && !isDigit(top)) isFormingNumber = false;
  if (!isFormingNumber && isDigit(top)) {
    isFormingNumber = true;
    const number = getNumberFromDigit(i - 1, j);
    adjacentNumbers.push(number);
  }
  if (!isFormingNumber && isDigit(topRight)) {
    const number = getNumberFromDigit(i - 1, j + 1);
    adjacentNumbers.push(number);
  }

  isFormingNumber = false;
  if (isDigit(bottomLeft)) {
    isFormingNumber = true;
    const number = getNumberFromDigit(i + 1, j - 1);
    adjacentNumbers.push(number);
  }
  if (isFormingNumber && !isDigit(bottom)) isFormingNumber = false;
  if (!isFormingNumber && isDigit(bottom)) {
    isFormingNumber = true;
    const number = getNumberFromDigit(i + 1, j);
    adjacentNumbers.push(number);
  }
  if (!isFormingNumber && isDigit(bottomRight)) {
    const number = getNumberFromDigit(i + 1, j + 1);
    adjacentNumbers.push(number);
  }

  return adjacentNumbers;
};

const gearRatios: number[] = [];

for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[i].length; j++) {
    const char = lines[i][j];
    if (char === '*') {
      const adjacentNumbers = findAdjacentNumbers(i, j);
      if (adjacentNumbers.length === 2) {
        const [a, b] = adjacentNumbers;
        console.log(adjacentNumbers);
        const ratio = a * b;
        gearRatios.push(ratio);
      }
    }
  }
}

let sum = 0;
for (const number of gearRatios) {
  sum += number;
}

console.log(sum);
