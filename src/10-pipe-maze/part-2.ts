import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const maze = lines.map((line) => line.split(''));

type Direction = 'up' | 'down' | 'left' | 'right';
type Pipe = '|' | '-' | 'L' | 'J' | '7' | 'F' | 'S';

const getDirectionsFromTile = (tile: string | undefined): Direction[] => {
  if (!tile) return [];
  const map: Record<Pipe, Direction[]> = {
    '|': ['up', 'down'],
    '-': ['left', 'right'],
    L: ['up', 'right'],
    J: ['up', 'left'],
    '7': ['down', 'left'],
    F: ['down', 'right'],
    S: ['up', 'down', 'left', 'right'],
  };
  return map[tile as Pipe] || [];
};

const oppositeDirection: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

// extend the maze, replacing each tile with a 3x3 grid
const extendedMaze: string[][] = [];
for (let i = 0; i < maze.length; i++) {
  const row = maze[i];
  const extendedRow: string[][] = [[], [], []];
  for (let j = 0; j < row.length; j++) {
    const tile = row[j];
    const extendedTile = [
      ['.', '.', '.'],
      ['.', tile, '.'],
      ['.', '.', '.'],
    ];
    const directions = getDirectionsFromTile(tile);
    if (directions.includes('up')) extendedTile[0][1] = '|';
    if (directions.includes('down')) extendedTile[2][1] = '|';
    if (directions.includes('left')) extendedTile[1][0] = '-';
    if (directions.includes('right')) extendedTile[1][2] = '-';

    for (let k = 0; k < 3; k++) {
      extendedRow[k].push(...extendedTile[k]);
    }
  }
  extendedMaze.push(...extendedRow);
}

const originalExtendedMaze = extendedMaze.map((row) => row.slice());

let i = extendedMaze.findIndex((row) => row.includes('S'));
let j = extendedMaze[i].indexOf('S');

const [startI, startJ] = [i, j];

const tileAbove = extendedMaze[i - 2]?.[j];
const tileBelow = extendedMaze[i + 2]?.[j];
const tileLeft = extendedMaze[i][j - 2];

let direction: Direction = getDirectionsFromTile(tileAbove).includes('down')
  ? 'up'
  : getDirectionsFromTile(tileBelow).includes('up')
  ? 'down'
  : getDirectionsFromTile(tileLeft).includes('right')
  ? 'left'
  : 'right';

extendedMaze[i][j] = 'X';
if (direction === 'up') i--;
if (direction === 'down') i++;
if (direction === 'left') j--;
if (direction === 'right') j++;

// mark the path with X
while (i !== startI || j !== startJ) {
  const newDirection = getDirectionsFromTile(extendedMaze[i][j]).find(
    (d) => d !== oppositeDirection[direction]
  );

  if (!newDirection) {
    console.log('no new direction', i, j, extendedMaze[i][j]);
    break;
  }

  extendedMaze[i][j] = 'X';

  if (newDirection === 'up') i--;
  if (newDirection === 'down') i++;
  if (newDirection === 'left') j--;
  if (newDirection === 'right') j++;

  direction = newDirection;
}

// replace with better symbols
const prettyMazeExtended = originalExtendedMaze.map((row) => row.slice());
for (let i = 0; i < prettyMazeExtended.length; i++) {
  for (let j = 0; j < prettyMazeExtended[i].length; j++) {
    if (extendedMaze[i][j] !== 'X') {
      prettyMazeExtended[i][j] = '.';
      continue;
    }
    if (prettyMazeExtended[i][j] === 'L') prettyMazeExtended[i][j] = '┗';
    if (prettyMazeExtended[i][j] === 'J') prettyMazeExtended[i][j] = '┛';
    if (prettyMazeExtended[i][j] === '7') prettyMazeExtended[i][j] = '┓';
    if (prettyMazeExtended[i][j] === 'F') prettyMazeExtended[i][j] = '┏';
    if (prettyMazeExtended[i][j] === '-') prettyMazeExtended[i][j] = '─';
  }
}

// flood fill
const queue: [number, number][] = [[0, 0]];
const recursiveFlooding = () => {
  const nextTile = queue.shift();
  if (!nextTile) return;

  const [i, j] = nextTile;
  const tile = prettyMazeExtended[i]?.[j];
  if (tile === undefined || tile !== '.') return;

  prettyMazeExtended[i][j] = 'O';
  queue.push([i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]);
};

while (queue.length) recursiveFlooding();

Bun.write(
  'pretty-maze-extended.txt',
  prettyMazeExtended.map((row) => row.join('')).join('\n') + '\n'
);

// reduce back to original size
const prettyMaze: string[][] = [];
for (let i = 0; i < prettyMazeExtended.length; i += 3) {
  prettyMaze.push([]);
  for (let j = 0; j < prettyMazeExtended[i].length; j += 3) {
    const tile = prettyMazeExtended[i + 1][j + 1];
    prettyMaze[i / 3].push(tile);
  }
}

Bun.write('pretty-maze.txt', prettyMaze.map((row) => row.join('')).join('\n') + '\n');

let enclosedTiles = 0;

for (let i = 0; i < prettyMaze.length; i++) {
  for (let j = 0; j < prettyMaze[i].length; j++) {
    const tile = prettyMaze[i][j];
    if (tile === '.') {
      enclosedTiles++;
    }
  }
}

console.log(enclosedTiles);
