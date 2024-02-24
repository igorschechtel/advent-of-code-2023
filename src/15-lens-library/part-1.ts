import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const strings = content.split(',');

let sum = 0;

for (const string of strings) {
  let currentValue = 0;
  for (let i = 0; i < string.length; i++) {
    currentValue += string.charCodeAt(i);
    currentValue *= 17;
    currentValue = currentValue % 256;
  }
  sum += currentValue;
}
console.log(sum);
