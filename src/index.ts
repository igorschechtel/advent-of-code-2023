import path from 'path';

const SPELLED_DIGITS = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

const hasSpelledDigit = (substr: string) => {
  return SPELLED_DIGITS.some((digit) => substr.startsWith(digit));
};

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

let sum = 0;

for (const line of lines) {
  const len = line.length;
  let i = 0;
  let j = len - 1;
  let firstDigit: string | null = null;
  let lastDigit: string | null = null;
  while (true) {
    if (firstDigit === null) {
      const char = line[i];
      const isDigit = /\d/.test(char);
      if (isDigit) firstDigit = char;
      else if (hasSpelledDigit(line.slice(i, i + 5))) {
        const digit = SPELLED_DIGITS.findIndex((digit) =>
          line.startsWith(digit, i)
        );
        firstDigit = String(digit + 1);
      }
      i++;
    }

    if (lastDigit === null) {
      const char = line[j];
      const isDigit = /\d/.test(char);
      if (isDigit) lastDigit = char;
      else if (hasSpelledDigit(line.slice(j, j + 5))) {
        const digit = SPELLED_DIGITS.findIndex((digit) =>
          line.startsWith(digit, j)
        );
        lastDigit = String(digit + 1);
      }
      j--;
    }

    // break if both digits are found
    if (firstDigit !== null && lastDigit !== null) {
      const value = Number(`${firstDigit}${lastDigit}`);
      sum += value;
      break;
    }
  }
}
console.log(sum);
