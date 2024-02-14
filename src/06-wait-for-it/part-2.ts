import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const parseLine = (line: string): number => {
  return Number(
    line
      .split(' ')
      .filter(Boolean)
      .map(Number)
      .filter((n) => !isNaN(n))
      .map(String)
      .join('')
  );
};

const time = parseLine(lines[0]);
const recordDistance = parseLine(lines[1]);

let numPossibleWins = 0;
for (let j = 1; j < time; j++) {
  const distance = j * (time - j);
  if (distance > recordDistance) numPossibleWins++;
}
console.log(numPossibleWins);
