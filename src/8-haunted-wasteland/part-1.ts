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

let currentNode = 'AAA';
let instructionIndex = 0;
let steps = 0;
while (currentNode !== 'ZZZ') {
  const instruction = instructions[instructionIndex];
  if (instruction === 'L') {
    currentNode = map[currentNode][0];
  } else {
    currentNode = map[currentNode][1];
  }
  steps++;
  instructionIndex = (instructionIndex + 1) % instructions.length;
}

console.log(steps);
