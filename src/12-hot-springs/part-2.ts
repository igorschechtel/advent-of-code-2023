import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

type Cache = {
  [key: string]: number;
};

const cache: Cache = {};

const count = (cfg: string, nums: number[]): number => {
  if (cfg === '') {
    return nums.length === 0 ? 1 : 0;
  }

  if (nums.length === 0) {
    return cfg.includes('#') ? 0 : 1;
  }

  const key = `${cfg}-${nums.join(',')}`;

  if (cache[key] !== undefined) {
    return cache[key];
  }

  let result = 0;

  if (cfg[0] === '.' || cfg[0] === '?') {
    result += count(cfg.substring(1), nums);
  }

  if (cfg[0] === '#' || cfg[0] === '?') {
    if (
      nums[0] <= cfg.length &&
      !cfg.substring(0, nums[0]).includes('.') &&
      (nums[0] === cfg.length || cfg[nums[0]] !== '#')
    ) {
      result += count(cfg.substring(nums[0] + 1), nums.slice(1));
    }
  }

  cache[key] = result;
  return result;
};

let total = 0;
for (const line of lines) {
  const [cfg, numsStr] = line.split(' ');
  const nums: number[] = numsStr.split(',').map(Number);

  let cfgExtended = Array(5).fill(cfg).join('?');
  let numsExtended: number[] = [];
  for (let i = 0; i < 5; i++) {
    numsExtended = numsExtended.concat(nums);
  }

  total += count(cfgExtended, numsExtended);
}

console.log(total);
