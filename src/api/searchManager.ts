import {
  searchCountries,
  mapCountryResponse,
  createRequestSignal,
} from './countries';

import { debounce } from '../utils/debounce';

export function createSearchManager(
  onResults: (results: ReturnType<typeof mapCountryResponse>[]) => void,
  onError: (error: unknown) => void,
  onLoading: (loading: boolean) => void,
) {
  let controller: AbortController | null = null;

  const runSearch = debounce(async (query: string) => {
    const currentController = new AbortController();
    controller = currentController;

    onLoading(true);

    try {
      const signal = createRequestSignal(currentController);
      const raw = await searchCountries(query, signal);
      const results = raw.map(mapCountryResponse);

      if (
        !currentController.signal.aborted &&
        controller === currentController
      ) {
        onResults(results);
      }
    } catch (error) {
      if (currentController.signal.aborted) {
        return;
      }

      if (controller !== currentController) {
        return;
      }

      const errorName =
        typeof error === 'object' && error !== null && 'name' in error
          ? String(error.name)
          : '';

      if (errorName === 'AbortError') {
        return;
      }

      onError(error);
    } finally {
      if (controller === currentController) {
        controller = null;
        onLoading(false);
      }
    }
  }, 300);

  function cancel() {
    controller?.abort();
    controller = null;

    runSearch.cancel();

    onLoading(false);
  }

  return {
    search(query: string) {
      cancel();

      // Сразу очищаем предыдущую ошибку.
      onError(null);

      if (!query.trim()) {
        onResults([]);
        return;
      }

      runSearch(query.trim());
    },

    cancel,
  };
}
