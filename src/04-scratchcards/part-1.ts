import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

let totalPoints = 0;

for (const line of lines) {
  const [, numbers] = line.split(': ');
  const [winningNumbersStr, myNumbersStr] = numbers.split(' | ');
  const winningNumbers = winningNumbersStr.split(' ').filter(Boolean).map(Number);
  const myNumbers = myNumbersStr.split(' ').filter(Boolean).map(Number);

  let myWinningNumbers = 0;
  for (const myNumber of myNumbers) {
    if (winningNumbers.includes(myNumber)) {
      myWinningNumbers++;
    }
  }

  if (myWinningNumbers > 0) {
    const points = Math.pow(2, myWinningNumbers - 1);
    totalPoints += points;
  }
}

console.log(totalPoints);
