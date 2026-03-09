export const TOPIC_MAPPINGS: Record<string, string> = {
  PL010: 'Prawo lotnicze',
  PL020: 'Ogólna wiedza o statku powietrznym',
  PL030: 'Osiągi i planowanie lotu',
  PL040: 'Człowiek - możliwości i ograniczenia',
  PL050: 'Meteorologia',
  PL060: 'Nawigacja',
  PL070: 'Procedury operacyjne',
  PL080: 'Zasady lotu',
  PL090: 'Łączność',
};

export const SLUG_MAPPINGS: Record<string, string> = {
  PL010: 'law',
  PL020: 'airship',
  PL030: 'performance',
  PL040: 'human',
  PL050: 'meteo',
  PL060: 'navi',
  PL070: 'procedures',
  PL080: 'principles',
  PL090: 'communication',
};

export function getLinkForCode(code: string): string {
  const [prefix] = code.split('-');
  const slug = SLUG_MAPPINGS[prefix];
  if (!slug) return '#';
  return `https://awiacja.edu.pl/groups/ppl-a/${slug}/question/${code}`;
}

export function extractQuestionCodes(text: string): string[] {
  const regex = /PL\d{3}-\d{4}/g;
  const matches = text.match(regex);
  return matches ? Array.from(new Set(matches)) : [];
}
