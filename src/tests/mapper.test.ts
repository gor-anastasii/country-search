import { describe, it, expect } from 'vitest';
import { mapCountryResponse } from '../api/countries';

describe('mapCountryResponse', () => {
  it('should map API country data', () => {
    const raw = {
      name: {
        common: 'Spain',
        official: 'Kingdom of Spain',
      },
      flags: {
        png: 'https://example.com/spain.png',
        svg: 'https://example.com/spain.svg',
      },
      capital: ['Madrid'],
      region: 'Europe',
      population: 47000000,
      languages: {
        spa: 'Spanish',
      },
      area: 505990,
      borders: ['FRA', 'PRT'],
      currencies: {
        EUR: {
          name: 'Euro',
          symbol: '€',
        },
      },
    };

    expect(mapCountryResponse(raw)).toEqual({
      name: 'Spain',
      officialName: 'Kingdom of Spain',
      flag: 'https://example.com/spain.svg',
      capital: 'Madrid',
      region: 'Europe',
      population: 47000000,
      languages: ['Spanish'],
      area: 505990,
      borders: ['FRA', 'PRT'],
      currencies: ['Euro (€)'],
      description: 'Kingdom of Spain is located in Europe.',
    });
  });
});
