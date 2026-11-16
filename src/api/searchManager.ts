import { searchCountries, mapCountryResponse } from './countries';
import { debounce } from '../utils/debounce';

export function createSearchManager(
  onResults: (results: ReturnType<typeof mapCountryResponse>[]) => void,
  onError: (error: unknown) => void,
  onLoading: (loading: boolean) => void,
) {
  let controller: AbortController | null = null;

  const runSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      onResults([]);
      onLoading(false);
      return;
    }

    controller = new AbortController();
    const currentController = controller;

    onLoading(true);

    try {
      const signal = AbortSignal.any([
        currentController.signal,
        AbortSignal.timeout(8000),
      ]);

      const raw = await searchCountries(query, signal);
      const results = raw.map(mapCountryResponse);

      if (!currentController.signal.aborted) {
        onResults(results);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      if (error instanceof Error && error.name === 'TimeoutError') {
        onError(error);
        return;
      }

      onError(error);
    } finally {
      if (controller === currentController) {
        onLoading(false);
      }
    }
  }, 300);

  return {
    search(query: string) {
      controller?.abort();
      runSearch(query);
    },
  };
}
