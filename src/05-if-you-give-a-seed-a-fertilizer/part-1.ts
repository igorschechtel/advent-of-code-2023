import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const getMaps = () => {
  const maps: Record<string, number[][]> = {
    'seed-to-soil': [],
    'soil-to-fertilizer': [],
    'fertilizer-to-water': [],
    'water-to-light': [],
    'light-to-temperature': [],
    'temperature-to-humidity': [],
    'humidity-to-location': [],
  };

  let currentMap: string | null = null;

  for (const line of lines) {
    // set current map
    if (line.includes('map')) {
      const [key] = line.split(' ');
      currentMap = key;
      continue;
    }

    // skip empty lines
    if (line.trim() === '') continue;
    if (currentMap === null) continue;

    // add map values
    const values = line.split(' ').map((v) => Number(v));
    maps[currentMap].push(values);
  }

  return maps;
};

const maps = getMaps();

const calculatePath = (seed: number) => {
  const mapKeys = Object.keys(maps);

  const path: number[] = [seed];

  for (const key of mapKeys) {
    const currentValue = path[path.length - 1];
    const map = maps[key];

    const mappedRange = map.find((line) => {
      const [dest, src, range] = line;

      if (currentValue >= src && currentValue < src + range) return true;
      return false;
    });

    if (!mappedRange) {
      path.push(currentValue);
      continue;
    }

    const [dest, src, range] = mappedRange;
    const offset = dest - src;

    const newValue = currentValue + offset;
    path.push(newValue);
  }

  return path;
};

const main = () => {
  const [, seedsString] = lines[0].split(': ');
  const seeds = seedsString.split(' ').map((v) => Number(v));

  let min = Number.MAX_SAFE_INTEGER;

  for (const seed of seeds) {
    const path = calculatePath(seed);
    const finalValue = path[path.length - 1];
    min = Math.min(min, finalValue);
  }

  console.log(min);
};

main();
