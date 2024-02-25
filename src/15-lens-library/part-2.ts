import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const strings = content.split(',');

type OperationType = 'add' | 'remove';
type Lens = [string, number];
const boxContents: Record<number, Lens[]> = {};

const getHash = (s: string) => {
  let currentValue = 0;
  for (let i = 0; i < s.length; i++) {
    currentValue += s.charCodeAt(i);
    currentValue *= 17;
    currentValue %= 256;
  }
  return currentValue;
};

const getLabelAndOpType = (s: string): [string, OperationType] => {
  if (s.includes('=')) {
    const [label] = s.split('=');
    return [label, 'add'];
  } else {
    const [label] = s.split('-');
    return [label, 'remove'];
  }
};

for (const string of strings) {
  const [label, opType] = getLabelAndOpType(string);
  const boxNumber = getHash(label);
  const lenses = boxContents[boxNumber] || [];

  if (opType === 'add') {
    const value = parseInt(string.split('=')[1]);
    const indexOfLabel = lenses.findIndex(([l]) => l === label);
    if (indexOfLabel === -1) {
      lenses.push([label, value]);
    } else {
      lenses[indexOfLabel][1] = value;
    }
  } else {
    const indexOfLabel = lenses.findIndex(([l]) => l === label);
    if (indexOfLabel !== -1) {
      lenses.splice(indexOfLabel, 1);
    }
  }

  boxContents[boxNumber] = lenses;
}

let sum = 0;

Object.entries(boxContents).forEach(([boxNumber, lenses]) => {
  for (let i = 0; i < lenses.length; i++) {
    const power = (Number(boxNumber) + 1) * (i + 1) * lenses[i][1];
    sum += power;
  }
});

console.log(sum);
