import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const possibleGames: number[] = [];

let sum = 0;
let gameNumber = 1;

for (const line of lines) {
  let isPossible = true;
  const [, game] = line.split(': ');
  const rounds = game.split('; ');

  for (const round of rounds) {
    const sets = round.split(', ');
    for (const set of sets) {
      const [amount, color] = set.split(' ');
      if (color === 'red' && Number(amount) > 12) isPossible = false;
      if (color === 'green' && Number(amount) > 13) isPossible = false;
      if (color === 'blue' && Number(amount) > 14) isPossible = false;
    }
  }

  if (isPossible) sum += gameNumber;

  gameNumber++;
}

console.log(sum);
