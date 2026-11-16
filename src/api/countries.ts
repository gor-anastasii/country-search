import type { Country, CountryApiResponse } from '../types/country';

export function mapCountryResponse(raw: CountryApiResponse): Country {
  const officialName = raw.officialName ?? raw.name;

  const currencies = (raw.currencies ?? []).map((currency) =>
    currency.symbol ? `${currency.name} (${currency.symbol})` : currency.name,
  );

  const languages = (raw.languages ?? []).map((language) => language.name);

  return {
    name: raw.name,
    officialName,
    flag: raw.flags?.svg ?? raw.flags?.png ?? raw.flag ?? '',
    capital: raw.capital || 'Unknown',
    region: raw.region || 'Unknown',
    population: raw.population,
    languages,
    area: raw.area ?? 0,
    borders: raw.borders ?? [],
    currencies,
    description: `${officialName} is located in ${raw.region || 'an unknown region'}.`,
  };
}

export class HttpError extends Error {
  constructor(public status: number) {
    super(`HTTP Error: ${status}`);
    this.name = 'HttpError';
  }
}

export async function searchCountries(
  query: string,
  signal: AbortSignal,
): Promise<CountryApiResponse[]> {
  const response = await fetch(
    `https://countries.dev/name/${encodeURIComponent(query)}`,
    { signal },
  );

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  return response.json() as Promise<CountryApiResponse[]>;
}

export type RequestErrorType = 'abort' | 'timeout' | 'http' | 'network';

export function getRequestErrorType(error: unknown): RequestErrorType {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return 'abort';
    }

    if (error.name === 'TimeoutError') {
      return 'timeout';
    }

    if (error instanceof HttpError) {
      return 'http';
    }
  }

  return 'network';
}

export function createRequestSignal(
  controller: AbortController,
  timeout = 8000,
): AbortSignal {
  return AbortSignal.any([controller.signal, AbortSignal.timeout(timeout)]);
}
