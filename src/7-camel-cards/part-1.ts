import path from 'path';

const filePath = path.join(import.meta.dir, 'input.txt');
const file = Bun.file(filePath);
const content = await file.text();
const lines = content.split('\n');

const cards = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const isFirstHigher = (first: string, second: string): boolean => {
  const i1 = cards.indexOf(first);
  const i2 = cards.indexOf(second);
  if (i1 === -1 || i2 === -1) throw new Error('Invalid card');
  return cards.indexOf(first) < cards.indexOf(second);
};

const getCardStrength = (card: string): number => {
  let occurrencesMap: Record<string, number> = {};

  for (let i = 0; i < card.length; i++) {
    const char = card[i];
    if (occurrencesMap[char]) occurrencesMap[char]++;
    else occurrencesMap[char] = 1;
  }

  const occurrences = Object.values(occurrencesMap);
  if (occurrences.includes(5)) return 7;
  if (occurrences.includes(4)) return 6;
  if (occurrences.includes(3) && occurrences.includes(2)) return 5;
  if (occurrences.includes(3)) return 4;
  if (occurrences.filter((o) => o === 2).length === 2) return 3;
  if (occurrences.includes(2)) return 2;
  return 1;
};

const hands = lines.sort((line1, line2) => {
  const [hand1] = line1.split(' ');
  const [hand2] = line2.split(' ');

  const strength1 = getCardStrength(hand1);
  const strength2 = getCardStrength(hand2);

  if (strength1 !== strength2) return strength1 - strength2;

  for (let i = 0; i < 5; i++) {
    const card1 = hand1[i];
    const card2 = hand2[i];
    if (card1 === card2) continue;
    return isFirstHigher(card1, card2) ? 1 : -1;
  }

  return 0;
});

console.log(hands);

let totalWinnings = 0;

for (let i = 0; i < hands.length; i++) {
  const [, bid] = hands[i].split(' ');
  const rank = i + 1;
  const winnings = +bid * rank;
  totalWinnings += winnings;
}

console.log(totalWinnings.toString());
