import path from 'path';

const filePath = path.join(import.meta.dir, 'example-input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const matrix = content.split('\n').map((row) => row.split('').map(Number));

const distances = matrix.map((row) => row.map(() => Infinity));
const queue = matrix.flatMap((row, i) => row.map((_, j) => [i, j] as const));

distances[0][0] = 0;

const getSmallestDistanceIndex = () => {
  let smallestDistance = Infinity;
  let smallestDistanceIndex = 0;

  for (let k = 0; k < queue.length; k++) {
    const [i, j] = queue[k];
    const distance = distances[i][j];

    if (distance < smallestDistance) {
      smallestDistance = distance;
      smallestDistanceIndex = k;
    }
  }

  return smallestDistanceIndex;
};

while (queue.length) {
  // populate distance of neighbors
  const smallestDistanceIndex = getSmallestDistanceIndex();
  const v = queue.splice(smallestDistanceIndex, 1)[0];

  const [vi, vj] = v;

  // update adjacent nodes' distances
  const neighbors = [
    [vi - 1, vj],
    [vi + 1, vj],
    [vi, vj - 1],
    [vi, vj + 1],
  ];
  for (const u of neighbors) {
    const [u1, uj] = u;
    if (u1 < 0 || u1 >= matrix.length || uj < 0 || uj >= matrix[0].length) continue;
    const distance = distances[vi][vj] + matrix[u1][uj];
    if (distance < distances[u1][uj]) distances[u1][uj] = distance;
  }
}
console.log(
  distances.map((row) => row.map((n) => n.toString().padStart(2, '0')).join(' ')).join('\n'),
  '\n'
);

// get path to the bottom right corner
const distancesCopy = distances.map((row) => row.slice());
let v = [matrix.length - 1, matrix[0].length - 1];

while (v[0] !== 0 || v[1] !== 0) {
  const [vi, vj] = v;
  distancesCopy[vi][vj] = 0;
  const neighbors = [
    [vi - 1, vj],
    [vi + 1, vj],
    [vi, vj - 1],
    [vi, vj + 1],
  ];
  for (const u of neighbors) {
    const [ui, uj] = u;
    if (ui < 0 || ui >= matrix.length || uj < 0 || uj >= matrix[0].length) continue;
    if (distances[vi][vj] === distances[ui][uj] + matrix[vi][vj]) {
      v = u;
      break;
    }
  }
}

console.log(
  distancesCopy.map((row) => row.map((n) => n.toString().padStart(2, '0')).join(' ')).join('\n')
);
