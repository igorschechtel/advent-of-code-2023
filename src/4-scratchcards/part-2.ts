import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const numCards = lines.length;

const amountsOfCards = Array.from({ length: numCards }, () => 1);

for (let i = 0; i < numCards; i++) {
  const line = lines[i];
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

  let j = i;
  const amountOfCard = amountsOfCards[i];
  while (myWinningNumbers > 0 && j < numCards - 1) {
    j++;
    amountsOfCards[j] = amountsOfCards[j] + amountOfCard;
    myWinningNumbers--;
  }
}

console.log(amountsOfCards);

let totalCards = 0;
for (const amount of amountsOfCards) {
  totalCards += amount;
}

console.log(totalCards);
