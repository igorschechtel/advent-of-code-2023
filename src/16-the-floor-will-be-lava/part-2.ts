import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const numRows = lines.length;
const numCols = lines[0].length;

type Direction = 'up' | 'down' | 'left' | 'right';
type Instruction = { i: number; j: number; direction: Direction };

const getNumberOfEnergized = (entry: Instruction): number => {
  const matrix = lines.map((row) => row.split(''));
  const energizedMatrix = matrix.map((row) => row.map(() => '.'));

  const queue: Instruction[] = [];
  const instructions = new Set<string>();

  const beam = (i: number, j: number, direction: Direction) => {
    // out of bounds
    if (i < 0 || i >= numRows || j < 0 || j >= numCols) return;

    // already visited
    if (instructions.has(`${i},${j},${direction}`)) return;
    instructions.add(`${i},${j},${direction}`);

    energizedMatrix[i][j] = '#';
    const cell = matrix[i][j];

    // empty space, continues in the same direction
    if (cell === '.') {
      if (direction === 'up') return queue.push({ i: i - 1, j: j, direction: 'up' });
      else if (direction === 'down') return queue.push({ i: i + 1, j, direction: 'down' });
      else if (direction === 'left') return queue.push({ i: i, j: j - 1, direction: 'left' });
      else if (direction === 'right') return queue.push({ i: i, j: j + 1, direction: 'right' });
    }

    // mirror, reflected 90 degrees
    else if (['/', '\\'].includes(cell)) {
      if (cell === '/') {
        if (direction === 'up') return queue.push({ i: i, j: j + 1, direction: 'right' });
        else if (direction === 'down') return queue.push({ i: i, j: j - 1, direction: 'left' });
        else if (direction === 'left') return queue.push({ i: i + 1, j, direction: 'down' });
        else if (direction === 'right') return queue.push({ i: i - 1, j, direction: 'up' });
      } else if (cell === '\\') {
        if (direction === 'up') return queue.push({ i: i, j: j - 1, direction: 'left' });
        else if (direction === 'down') return queue.push({ i: i, j: j + 1, direction: 'right' });
        else if (direction === 'left') return queue.push({ i: i - 1, j, direction: 'up' });
        else if (direction === 'right') return queue.push({ i: i + 1, j, direction: 'down' });
      }
    }

    // splitter, passes through as empty space or creates 2 beams
    else if (['|', '-'].includes(cell)) {
      // vertical splitter
      if (cell === '|') {
        // split the beam in two
        if (direction === 'right' || direction === 'left') {
          queue.push({ i: i - 1, j, direction: 'up' });
          return queue.push({ i: i + 1, j, direction: 'down' });
        }
        // continue in the same direction
        else {
          if (direction === 'up') return queue.push({ i: i - 1, j, direction: 'up' });
          else if (direction === 'down') return queue.push({ i: i + 1, j, direction: 'down' });
        }
      }

      // horizontal splitter
      else {
        // split the beam in two
        if (direction === 'up' || direction === 'down') {
          queue.push({ i: i, j: j - 1, direction: 'left' });
          return queue.push({ i: i, j: j + 1, direction: 'right' });
        }
        // continue in the same direction
        else {
          if (direction === 'left') return queue.push({ i: i, j: j - 1, direction: 'left' });
          else if (direction === 'right') return queue.push({ i: i, j: j + 1, direction: 'right' });
        }
      }
    }
  };

  queue.push(entry);
  while (queue.length) {
    const instruction = queue.shift();
    if (!instruction) break;
    beam(instruction.i, instruction.j, instruction.direction);
  }

  let countEnergized = 0;
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (energizedMatrix[i][j] === '#') countEnergized++;
    }
  }

  return countEnergized;
};

const entryOptions: Instruction[] = [];

// top row (heading down)
for (let j = 0; j < numCols; j++) {
  entryOptions.push({ i: 0, j, direction: 'down' });
}
// bottom row (heading up)
for (let j = 0; j < numCols; j++) {
  entryOptions.push({ i: numRows - 1, j, direction: 'up' });
}
// left column (heading right)
for (let i = 0; i < numRows; i++) {
  entryOptions.push({ i, j: 0, direction: 'right' });
}
// right column (heading left)
for (let i = 0; i < numRows; i++) {
  entryOptions.push({ i, j: numCols - 1, direction: 'left' });
}

let maxEnergized = 0;
for (const entry of entryOptions) {
  const countEnergized = getNumberOfEnergized(entry);
  maxEnergized = Math.max(maxEnergized, countEnergized);
}

console.log(maxEnergized);
