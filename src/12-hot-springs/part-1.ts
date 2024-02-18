import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const generateCombinations = (inputArray: number[], k: number): number[][] => {
  // Helper function to actually generate combinations
  const helper = (
    start: number,
    end: number,
    index: number,
    currentCombination: number[],
    allCombinations: number[][]
  ) => {
    // Base case: if the current combination is of the size k, add it to all combinations
    if (index === k) {
      allCombinations.push([...currentCombination]);
      return;
    }

    for (let i = start; i <= end && end - i + 1 >= k - index; i++) {
      currentCombination[index] = inputArray[i];
      helper(i + 1, end, index + 1, currentCombination, allCombinations);
    }
  };

  const allCombinations: number[][] = [];
  helper(0, inputArray.length - 1, 0, Array(k), allCombinations);
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
  const [symbols, numbersStr] = line.split(' ');

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
  const combinations = generateCombinations(unknownIndexes, desiredUnknownsDamaged);

  for (const combination of combinations) {
    let newSymbols = '';

    for (let i = 0; i < symbols.length; i++) {
      if (symbols[i] !== '?') newSymbols += symbols[i];
      else if (combination.includes(i)) newSymbols += '#';
      else newSymbols += '.';
    }

    if (isValidSymbols(newSymbols, numbersStr)) totalArrangements++;
  }
}

console.log(totalArrangements);
