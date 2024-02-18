import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const universe = lines.map((row) => row.split(''));

const expandUniverse = (universe: string[][]) => {
  const expanded = universe.map((row) => row.slice());
  for (let i = 0; i < expanded.length; i++) {
    const row = [...expanded[i]];
    if (row.every((cell) => cell === '.')) {
      expanded.splice(i, 0, row);
      i++;
    }
  }

  for (let j = 0; j < expanded[0].length; j++) {
    if (expanded.every((row) => row[j] === '.')) {
      expanded.forEach((row) => row.splice(j, 0, '.'));
      j++;
    }
  }

  return expanded;
};

const expandedUniverse = expandUniverse(universe);

const galaxyLocations: [number, number][] = [];

for (let i = 0; i < expandedUniverse.length; i++) {
  for (let j = 0; j < expandedUniverse[i].length; j++) {
    if (expandedUniverse[i][j] === '#') {
      galaxyLocations.push([i, j]);
    }
  }
}

let totalDistance = 0;
for (let i = 0; i < galaxyLocations.length; i++) {
  for (let j = i + 1; j < galaxyLocations.length; j++) {
    const [x1, y1] = galaxyLocations[i];
    const [x2, y2] = galaxyLocations[j];

    const distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);
    totalDistance += distance;
  }
}
console.log(totalDistance);
