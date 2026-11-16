import { describe, it, expect, vi, afterEach } from 'vitest';
import { searchCountries, HttpError } from '../api/countries';

describe('searchCountries', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return countries on successful response', async () => {
    const data = [{ name: { common: 'Spain' } }];

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => data,
      }),
    );

    await expect(
      searchCountries('Spain', new AbortController().signal),
    ).resolves.toEqual(data);
  });

  it('should return empty array on 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    );

    await expect(
      searchCountries('Unknown', new AbortController().signal),
    ).resolves.toEqual([]);
  });

  it('should throw HttpError on server error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(
      searchCountries('Spain', new AbortController().signal),
    ).rejects.toBeInstanceOf(HttpError);
  });
});
