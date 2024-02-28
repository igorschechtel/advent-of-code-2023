import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();

const matrix = content.split('\n').map((row) => row.split(''));
const energizedMatrix = matrix.map((row) => row.map(() => '.'));

type Direction = 'up' | 'down' | 'left' | 'right';
type Instruction = { i: number; j: number; direction: Direction };
const queue: Instruction[] = [];
const instructions = new Set<string>();

const beam = (i: number, j: number, direction: Direction) => {
  // out of bounds
  if (i < 0 || i >= matrix.length || j < 0 || j >= matrix[0].length) return;

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

queue.push({ i: 0, j: 0, direction: 'right' });
while (queue.length) {
  const instruction = queue.shift();
  if (!instruction) break;
  beam(instruction.i, instruction.j, instruction.direction);
}

console.log(energizedMatrix.map((row) => row.join('')).join('\n'));

let countEnergized = 0;
for (let i = 0; i < energizedMatrix.length; i++) {
  for (let j = 0; j < energizedMatrix[0].length; j++) {
    if (energizedMatrix[i][j] === '#') countEnergized++;
  }
}

console.log(countEnergized);
