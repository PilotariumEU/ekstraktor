import { extractQuestionCodes, getLinkForCode } from '../aviation-data';

describe('extractQuestionCodes', () => {
  it('extracts unique question codes from text', () => {
    const text = `PL010-0579 - przestrzeń klasy C = separacja VFR | IFR
PL010-0452 - vfr fir warszawa klasa G = FL85
PL010-0058 - dolna granica TMA = <200AGL górna granica > FL460 (1400m STD)
PL010-0404 - VFR NOC = samodzielne 2 godziny lotu w noocy
PL010-0157
PL010-0590 - QNH
PL010-0590 - 15km PL010-0448 - FL75`;

    const result = extractQuestionCodes(text);
    expect(result).toEqual([
      'PL010-0579',
      'PL010-0452',
      'PL010-0058',
      'PL010-0404',
      'PL010-0157',
      'PL010-0590',
      'PL010-0448',
    ]);
  });

  it('returns empty array for text without codes', () => {
    const text = 'Some random text without codes.';
    const result = extractQuestionCodes(text);
    expect(result).toEqual([]);
  });

  it('handles duplicates correctly', () => {
    const text = 'PL010-0579 PL010-0579 PL020-1234';
    const result = extractQuestionCodes(text);
    expect(result).toEqual(['PL010-0579', 'PL020-1234']);
  });
});

describe('getLinkForCode', () => {
  it('generates correct link for valid code', () => {
    const link = getLinkForCode('PL010-0579');
    expect(link).toBe(
      'https://awiacja.edu.pl/groups/ppl-a/law/question/PL010-0579'
    );
  });

  it('returns # for unknown prefix', () => {
    const link = getLinkForCode('UNKNOWN-1234');
    expect(link).toBe('#');
  });
});
