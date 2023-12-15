import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const isDigit = (char: string) => {
  return /\d/.test(char);
};

const isSymbol = (char: string) => {
  if (!char) return false;
  if (char === '.') return false;
  return !isDigit(char);
};

const hasAdjacentSymbol = (i: number, j: number) => {
  const left = lines[i]?.[j - 1];
  const right = lines[i]?.[j + 1];
  const top = lines[i - 1]?.[j];
  const bottom = lines[i + 1]?.[j];
  const topLeft = lines[i - 1]?.[j - 1];
  const topRight = lines[i - 1]?.[j + 1];
  const bottomLeft = lines[i + 1]?.[j - 1];
  const bottomRight = lines[i + 1]?.[j + 1];
  return (
    isSymbol(left) ||
    isSymbol(right) ||
    isSymbol(top) ||
    isSymbol(bottom) ||
    isSymbol(topLeft) ||
    isSymbol(topRight) ||
    isSymbol(bottomLeft) ||
    isSymbol(bottomRight)
  );
};

const partNumbers: number[] = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let isFormingNumber = false;
  let isPartNumber = false;
  let number = '';
  for (let j = 0; j < line.length; j++) {
    const char = line[j];

    if (isDigit(char)) {
      if (!isFormingNumber) {
        isFormingNumber = true;
        number += char;
        if (hasAdjacentSymbol(i, j)) {
          isPartNumber = true;
        }
      } else {
        number += char;
        if (hasAdjacentSymbol(i, j)) {
          isPartNumber = true;
        }
      }
    }

    if (!isDigit(char)) {
      if (isFormingNumber) {
        if (isPartNumber) partNumbers.push(Number(number));
        number = '';
        isFormingNumber = false;
        isPartNumber = false;
      }
    }
  }

  if (isFormingNumber) {
    if (isPartNumber) partNumbers.push(Number(number));
  }
}

console.log(partNumbers);

let sum = 0;
for (const number of partNumbers) {
  sum += number;
}

console.log(sum);
