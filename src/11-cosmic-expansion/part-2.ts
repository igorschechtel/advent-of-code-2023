import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const universe = lines.map((row) => row.split(''));

const expandUniverse = (universe: string[][]) => {
  const expandedRows: number[] = [];
  const expandedCols: number[] = [];

  for (let i = 0; i < universe.length; i++) {
    const row = universe[i];
    if (!row.some((cell) => cell === '#')) {
      expandedRows.push(i);
    }
  }

  for (let j = 0; j < universe[0].length; j++) {
    if (!universe.some((row) => row[j] === '#')) {
      expandedCols.push(j);
    }
  }

  return { expandedRows, expandedCols };
};

const { expandedRows, expandedCols } = expandUniverse(universe);

const galaxyLocations: [number, number][] = [];
for (let i = 0; i < universe.length; i++) {
  for (let j = 0; j < universe[i].length; j++) {
    if (universe[i][j] === '#') {
      galaxyLocations.push([i, j]);
    }
  }
}

let totalDistance = 0;
for (let i = 0; i < galaxyLocations.length; i++) {
  for (let j = i + 1; j < galaxyLocations.length; j++) {
    const [x1, y1] = galaxyLocations[i];
    const [x2, y2] = galaxyLocations[j];

    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    const expandedRowsInRange = expandedRows.filter((row) => row > minX && row < maxX).length;
    const expandedColsInRange = expandedCols.filter((col) => col > minY && col < maxY).length;

    const distanceX = 1_000_000 * expandedRowsInRange + maxX - minX - expandedRowsInRange;
    const distanceY = 1_000_000 * expandedColsInRange + maxY - minY - expandedColsInRange;
    const distance = distanceX + distanceY;

    totalDistance += distance;
  }
}
console.log(totalDistance);
