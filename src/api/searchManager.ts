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
    if (!query.trim()) {
      onResults([]);
      onLoading(false);
      return;
    }

    const currentController = new AbortController();
    controller = currentController;

    onLoading(true);

    try {
      const signal = createRequestSignal(currentController);

      const raw = await searchCountries(query, signal);
      const results = raw.map(mapCountryResponse);

      // Не показываем результат отменённого запроса.
      if (
        !currentController.signal.aborted &&
        controller === currentController
      ) {
        onResults(results);
      }
    } catch (error) {
      // Запрос отменён новым вводом или очисткой поля.
      if (currentController.signal.aborted) {
        return;
      }

      // Дополнительная защита от устаревшего запроса.
      if (controller !== currentController) {
        return;
      }

      const errorName =
        typeof error === 'object' && error !== null && 'name' in error
          ? String(error.name)
          : '';

      // Таймаут — настоящая ошибка.
      if (errorName === 'TimeoutError') {
        onError(error);
        return;
      }

      // Любая другая ошибка также показывается пользователю.
      onError(error);
    } finally {
      if (controller === currentController) {
        controller = null;
        onLoading(false);
      }
    }
  }, 300);

  return {
    search(query: string) {
      // Немедленно отменяем активный запрос.
      controller?.abort();
      controller = null;

      if (!query.trim()) {
        runSearch.cancel();
        onResults([]);
        onLoading(false);
        return;
      }

      onLoading(false);
      runSearch(query);
    },
  };
}
