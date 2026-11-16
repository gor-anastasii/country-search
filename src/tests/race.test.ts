import { describe, it, expect, vi, afterEach } from 'vitest';
import { createSearchManager } from '../api/searchManager';

describe('search race condition', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should cancel outdated request and keep only latest results', async () => {
    vi.useFakeTimers();

    const requests: {
      signal: AbortSignal;
      resolve: (response: Response) => void;
      reject: (error: Error) => void;
    }[] = [];

    const fetchMock = vi.fn(
      (_url: string | URL | Request, options?: RequestInit) => {
        const signal = options?.signal as AbortSignal;

        return new Promise<Response>((resolve, reject) => {
          requests.push({ signal, resolve, reject });

          signal.addEventListener(
            'abort',
            () => {
              reject(new DOMException('Aborted', 'AbortError'));
            },
            { once: true },
          );

          if (signal.aborted) {
            reject(new DOMException('Aborted', 'AbortError'));
          }
        });
      },
    );

    vi.stubGlobal('fetch', fetchMock);

    const onResults = vi.fn();
    const onError = vi.fn();
    const onLoading = vi.fn();

    const manager = createSearchManager(onResults, onError, onLoading);

    manager.search('Spain');

    await vi.advanceTimersByTimeAsync(300);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(requests).toHaveLength(1);

    const firstRequest = requests[0];

    manager.search('Germany');

    expect(firstRequest.signal.aborted).toBe(true);

    await vi.advanceTimersByTimeAsync(300);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(requests).toHaveLength(2);

    requests[1].resolve({
      ok: true,
      status: 200,
      json: async () => [
        {
          name: 'Germany',
          officialName: 'Federal Republic of Germany',
          capital: 'Berlin',
          region: 'Europe',
          population: 84_000_000,
          area: 357_022,
          flag: '🇩🇪',
          flags: {
            svg: 'https://example.com/germany.svg',
          },
          borders: ['FRA', 'POL'],
          languages: [
            {
              name: 'German',
              iso639_1: 'de',
            },
          ],
          currencies: [
            {
              code: 'EUR',
              name: 'Euro',
              symbol: '€',
            },
          ],
        },
      ],
    } as Response);

    await vi.advanceTimersByTimeAsync(0);

    expect(onResults).toHaveBeenCalledTimes(1);

    expect(onResults).toHaveBeenCalledWith([
      expect.objectContaining({
        name: 'Germany',
        capital: 'Berlin',
        region: 'Europe',
        languages: ['German'],
        currencies: ['Euro (€)'],
      }),
    ]);

    expect(onError).not.toHaveBeenCalled();

    expect(onLoading).toHaveBeenLastCalledWith(false);
  });
});
