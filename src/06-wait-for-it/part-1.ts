import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const times = lines[0]
  .split(' ')
  .filter(Boolean)
  .map(Number)
  .filter((n) => !isNaN(n));

const distances = lines[1]
  .split(' ')
  .filter(Boolean)
  .map(Number)
  .filter((n) => !isNaN(n));

let possibleWins: number[] = [];

for (let i = 0; i < times.length; i++) {
  const time = times[i];
  const recordDistance = distances[i];

  let numPossibleWins = 0;
  for (let j = 1; j < time; j++) {
    const distance = j * (time - j);
    if (distance > recordDistance) numPossibleWins++;
  }
  possibleWins.push(numPossibleWins);
}
console.log(possibleWins);
const totalPossibleWins = possibleWins.reduce((acc, cur) => acc * cur, 1);
console.log(totalPossibleWins);
