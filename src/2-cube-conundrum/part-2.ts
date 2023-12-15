import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

let sumPower = 0;

for (const line of lines) {
  const [, game] = line.split(': ');
  const rounds = game.split('; ');

  let minimumReds = 0;
  let minimumGreens = 0;
  let minimumBlues = 0;

  for (const round of rounds) {
    const sets = round.split(', ');
    for (const set of sets) {
      const [amountString, color] = set.split(' ');
      const amount = Number(amountString);
      if (color === 'red' && amount > minimumReds) minimumReds = amount;
      if (color === 'green' && amount > minimumGreens) minimumGreens = amount;
      if (color === 'blue' && amount > minimumBlues) minimumBlues = amount;
    }
  }

  const power = minimumReds * minimumGreens * minimumBlues;

  sumPower += power;
}

console.log(sumPower);
