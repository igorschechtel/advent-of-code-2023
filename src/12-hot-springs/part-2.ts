import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const generateCombinations = (inputArray: number[], k: number): number[][] => {
  // Check for invalid cases
  if (k > inputArray.length || k <= 0) return [];

  // A queue to hold the state of each combination in progress
  // Each element in the queue is a tuple: [currentCombination, nextStartIndex]
  const queue: [number[], number][] = [];

  // Initialize the queue with the first element of each combination
  for (let i = 0; i <= inputArray.length - k; i++) {
    queue.push([[inputArray[i]], i + 1]);
  }

  const allCombinations: number[][] = [];

  while (queue.length > 0) {
    const [currentCombination, nextStartIndex] = queue.shift()!;

    // If the current combination is complete, add it to allCombinations
    if (currentCombination.length === k) {
      allCombinations.push(currentCombination);
      continue;
    }

    // Otherwise, extend the current combination
    for (let i = nextStartIndex; i < inputArray.length; i++) {
      const newCombination = [...currentCombination, inputArray[i]];
      queue.push([newCombination, i + 1]);
    }
  }

  return allCombinations;
};

const isValidSymbols = (symbols: string, numbersStr: string): boolean => {
  const damaged = symbols
    .split('.')
    .filter(Boolean)
    .map((s) => s.length)
    .join(',');
  return damaged === numbersStr;
};

let totalArrangements = 0;

for (const line of lines) {
  const [s, n] = line.split(' ');
  const symbols = [s, s, s, s, s].join('?');
  const numbersStr = [n, n, n, n, n].join(',');

  const unknownIndexes: number[] = [];
  let symbolsDamagedSum = 0;

  for (let i = 0; i < symbols.length; i++) {
    if (symbols[i] === '?') unknownIndexes.push(i);
    if (symbols[i] === '#') symbolsDamagedSum++;
  }

  const numbers = numbersStr.split(',').map(Number);
  const numbersSum = numbers.reduce((a, b) => a + b, 0);

  const desiredUnknownsDamaged = numbersSum - symbolsDamagedSum;

  // get all possible combinations C(n, k) where n = unknownIndexes.length and k = desiredUnknownsDamaged
  console.log(`Unknown indexes: ${unknownIndexes}`);
  console.log(`Desired unknowns damaged: ${desiredUnknownsDamaged}`);
  const combinations = generateCombinations(unknownIndexes, desiredUnknownsDamaged);

  for (let i = 0; i < combinations.length; i++) {
    const combination = combinations[i];

    console.log(`Combination: ${combination} - ${combinations.length}`);
    let newSymbols = '';

    for (let i = 0; i < symbols.length; i++) {
      if (symbols[i] !== '?') newSymbols += symbols[i];
      else if (combination.includes(i)) newSymbols += '#';
      else newSymbols += '.';
    }

    console.log(`New symbols: ${newSymbols}`);
    if (isValidSymbols(newSymbols, numbersStr)) totalArrangements++;
  }
}

console.log(totalArrangements);
