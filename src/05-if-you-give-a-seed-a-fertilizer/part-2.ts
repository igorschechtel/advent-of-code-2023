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

const reverseMaps = (maps: Record<string, number[][]>) => {
  const reversedMaps: Record<string, number[][]> = {};

  for (const key in maps) {
    const map = maps[key];
    const reversedMap = map.map(([dest, src, range]) => [src, dest, range]);
    reversedMaps[key] = reversedMap;
  }

  return reversedMaps;
};

const getSeedRanges = () => {
  const [, seedsString] = lines[0].split(': ');
  const seedRanges: [number, number][] = [];
  seedsString.split(' ').forEach((seed, index) => {
    if (index % 2 === 0) {
      seedRanges.push([Number(seed), 0]);
    } else {
      seedRanges[seedRanges.length - 1][1] = Number(seed);
    }
  });

  return seedRanges;
};

const maps = getMaps();
const reversedMaps = reverseMaps(maps);

const main = () => {
  const seedRanges = getSeedRanges();

  const reversedMapKeys = [
    'humidity-to-location',
    'temperature-to-humidity',
    'light-to-temperature',
    'water-to-light',
    'fertilizer-to-water',
    'soil-to-fertilizer',
    'seed-to-soil',
  ];

  let i = 0;
  while (true) {
    let currentValue = i;
    let currentMapIndex = 0;

    while (currentMapIndex < reversedMapKeys.length) {
      const currentMapKey = reversedMapKeys[currentMapIndex];
      const currentMap = reversedMaps[currentMapKey];

      const mappedRange = currentMap.find((line) => {
        const [dest, src, range] = line;

        if (currentValue >= src && currentValue < src + range) return true;
        return false;
      });

      currentMapIndex++;

      if (!mappedRange) continue;

      const [dest, src, range] = mappedRange;
      const offset = dest - src;

      currentValue += offset;
    }

    const isOnRange = seedRanges.some(([start, length]) => {
      return currentValue >= start && currentValue < start + length;
    });

    if (isOnRange) {
      console.log('i', i);
      console.log('currentValue', currentValue);
      break;
    }

    if (i % 1_000_000 === 0) {
      console.log('i', i);
      console.log('currentValue', currentValue, '\n');
    }

    i++;
  }
};

main();
