import { describe, it, expect } from 'vitest';
import { mapCountryResponse } from '../api/countries';

describe('mapCountryResponse', () => {
  it('should map API country data', () => {
    const raw = {
      name: 'Spain',
      officialName: 'Kingdom of Spain',
      flag: '🇪🇸',
      flags: {
        png: 'https://example.com/spain.png',
        svg: 'https://example.com/spain.svg',
      },
      capital: 'Madrid',
      region: 'Europe',
      population: 47_000_000,
      languages: [
        {
          name: 'Spanish',
          iso639_1: 'es',
        },
      ],
      area: 505_990,
      borders: ['FRA', 'PRT'],
      currencies: [
        {
          code: 'EUR',
          name: 'Euro',
          symbol: '€',
        },
      ],
    };

    expect(mapCountryResponse(raw)).toEqual({
      name: 'Spain',
      officialName: 'Kingdom of Spain',
      flag: 'https://example.com/spain.svg',
      capital: 'Madrid',
      region: 'Europe',
      population: 47_000_000,
      languages: ['Spanish'],
      area: 505_990,
      borders: ['FRA', 'PRT'],
      currencies: ['Euro (€)'],
      description: 'Kingdom of Spain is located in Europe.',
    });
  });
});
