import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const maze = lines.map((line) => line.split(''));

type Direction = 'up' | 'down' | 'left' | 'right';
type Pipe = '|' | '-' | 'L' | 'J' | '7' | 'F';

const getDirectionsFromTile = (tile: string | undefined): Direction[] => {
  if (!tile) return [];
  const map: Record<Pipe, Direction[]> = {
    '|': ['up', 'down'],
    '-': ['left', 'right'],
    L: ['up', 'right'],
    J: ['up', 'left'],
    '7': ['down', 'left'],
    F: ['down', 'right'],
  };
  return map[tile as Pipe] || [];
};

const oppositeDirection: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

let i = maze.findIndex((row) => row.includes('S'));
let j = maze[i].indexOf('S');

const [startI, startJ] = [i, j];

const tileAbove = maze[i - 1]?.[j];
const tileBelow = maze[i + 1]?.[j];
const tileLeft = maze[i][j - 1];

let direction: Direction = getDirectionsFromTile(tileAbove).includes('down')
  ? 'up'
  : getDirectionsFromTile(tileBelow).includes('up')
  ? 'down'
  : getDirectionsFromTile(tileLeft).includes('right')
  ? 'left'
  : 'right';

if (direction === 'up') i--;
if (direction === 'down') i++;
if (direction === 'left') j--;
if (direction === 'right') j++;

let distanceFromStart = 1;

while (i !== startI || j !== startJ) {
  const newDirection = getDirectionsFromTile(maze[i][j]).find(
    (d) => d !== oppositeDirection[direction]
  );

  if (!newDirection) {
    console.log('no new direction', i, j, maze[i][j]);
    break;
  }

  if (newDirection === 'up') i--;
  if (newDirection === 'down') i++;
  if (newDirection === 'left') j--;
  if (newDirection === 'right') j++;

  direction = newDirection;
  distanceFromStart++;
}

console.log(distanceFromStart / 2);
