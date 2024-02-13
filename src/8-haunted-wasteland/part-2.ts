import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const map: Record<string, [string, string]> = {};

const instructions = lines[0];

const mapLines = lines.slice(2);
for (const line of mapLines) {
  const node = line.substring(0, 3);
  const left = line.substring(7, 10);
  const right = line.substring(12, 15);
  map[node] = [left, right];
}

const createTuple = (tuple: [string, number]): string => {
  const [a, b] = tuple;
  return `${a}|${b}`;
};
const getTuple = (tuple: string): [string, number] => {
  const [a, b] = tuple.split('|');
  return [a, Number(b)];
};

const startingNodes = Object.keys(map).filter((node) => node.endsWith('A'));
const numNodes = startingNodes.length;
let instructionIndex = 0;
let steps = 0;

const nodesData = startingNodes.map((node) => ({
  current: node,
  traversedArray: new Array<string>(),
  traversedSet: new Set<string>(),
  hasEndedLoop: false,
}));

while (nodesData.some((node) => !node.hasEndedLoop)) {
  const instruction = instructions[instructionIndex];
  for (let i = 0; i < numNodes; i++) {
    const nodeData = nodesData[i];
    const { current, traversedArray, traversedSet, hasEndedLoop } = nodeData;
    if (hasEndedLoop) continue;
    const [left, right] = map[current];
    const nextNode = instruction === 'L' ? left : right;
    const tuple = createTuple([nextNode, instructionIndex]);
    traversedArray.push(tuple);
    if (traversedSet.has(tuple)) {
      nodeData.hasEndedLoop = true;
    } else {
      traversedSet.add(tuple);
    }
    nodeData.current = nextNode;
  }
  steps++;
  instructionIndex = (instructionIndex + 1) % instructions.length;
  if (steps % 1_000_000 === 0) console.log(steps);
}

const resolvedData = nodesData.map((nodeData) => {
  const endingZSteps = nodeData.traversedArray
    .map((tuple, index) => {
      const [node] = getTuple(tuple);
      return [node, index] as const;
    })
    .filter(([node]) => node.endsWith('Z'))
    .map(([, index]) => index + 1);

  const lastIndex = nodeData.traversedArray.length - 1;
  const lastEl = nodeData.traversedArray[lastIndex];
  const loopStartIndex = nodeData.traversedArray.indexOf(lastEl);
  const loopLength = lastIndex - loopStartIndex;

  return {
    loopLength,
    endingZSteps,
  };
});

console.log(resolvedData);

// loopLength and endingZStep always match, so we can do LCM of loopLengths

const calculateLCM = (...arr: bigint[]) => {
  const gcd = (a: bigint, b: bigint): bigint => {
    if (b === 0n) return a;
    return gcd(b, a % b);
  };
  const lcm = (a: bigint, b: bigint): bigint => {
    return (a * b) / gcd(a, b);
  };
  let n = 1n;
  for (let i = 0; i < arr.length; ++i) {
    n = lcm(arr[i], n);
  }
  return n;
};

const loopLengths = resolvedData.map((data) => BigInt(data.loopLength));
const lcm = calculateLCM(...loopLengths);
console.log(lcm);
