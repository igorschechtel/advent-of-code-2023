import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const print = (rows: number[][]) => {
  console.log(rows.map((r) => r.map((r) => String(r).padStart(7, ' ')).join(' ')).join('\n'));
};

const extrapolatedValues: number[] = [];

for (const line of lines) {
  const row1 = line.split(' ').map(Number);
  const len = row1.length;
  const rows = [row1];

  // fill rows
  for (let i = 1; i < len; i++) {
    const aboveRow = rows[i - 1];
    const aboveRowLen = aboveRow.length;
    const currentRow: number[] = [];
    for (let j = 0; j < aboveRowLen - 1; j++) {
      currentRow.push(aboveRow[j + 1] - aboveRow[j]);
    }
    rows.push(currentRow);
    if (currentRow.every((v) => v === 0)) break;
  }

  let currentRowIndex = rows.length - 1;
  rows[currentRowIndex].push(0);
  currentRowIndex--;

  while (currentRowIndex >= 0) {
    const currentRow = rows[currentRowIndex];
    const belowRow = rows[currentRowIndex + 1];
    const index = currentRow.length - 1;

    const sum = currentRow[index] + belowRow[index];
    currentRow.push(sum);

    currentRowIndex--;
  }

  const extrapolatedValue = rows[0][rows[0].length - 1];
  extrapolatedValues.push(extrapolatedValue);
}

let sum = 0;
for (const value of extrapolatedValues) {
  sum += value;
}
console.log(sum);
