import './style.css';
import { createSearchManager } from './api/searchManager';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App container not found');
}

app.innerHTML = `
  <main class="container">
    <header>
      <h1>Country Search</h1>
      <p>Discover countries around the world</p>
    </header>

    <section class="search">
      <input
        id="search"
        type="search"
        placeholder="Search for a country..."
        autocomplete="off"
      />
    </section>

    <p id="status" class="status" aria-live="polite"></p>

    <section id="results" class="results"></section>

    <section id="details" class="details"></section>
  </main>
`;

const searchInput = document.querySelector<HTMLInputElement>('#search')!;
const resultsContainer = document.querySelector<HTMLDivElement>('#results')!;
const status = document.querySelector<HTMLParagraphElement>('#status')!;
const details = document.querySelector<HTMLDivElement>('#details')!;

let lastQuery = '';

function clearResults() {
  resultsContainer.replaceChildren();
  details.replaceChildren();
}

function renderCountries(
  countries: Parameters<Parameters<typeof createSearchManager>[0]>[0],
) {
  resultsContainer.replaceChildren();
  details.replaceChildren();

  if (countries.length === 0) {
    status.textContent = 'Nothing found';
    status.className = 'status empty-state';

    const message = document.createElement('p');
    message.textContent = 'Try another country name.';

    resultsContainer.append(message);
    return;
  }

  status.textContent = `Found: ${countries.length}`;
  status.className = 'status success-state';

  countries.forEach((country) => {
    const card = document.createElement('article');
    card.className = 'country-card';
    card.tabIndex = 0;

    const flag = document.createElement('img');
    flag.src = country.flag;
    flag.alt = `Flag of ${country.name}`;
    flag.loading = 'lazy';

    const title = document.createElement('h2');
    title.textContent = country.name;

    const capital = document.createElement('p');
    capital.textContent = `Capital: ${country.capital}`;

    const region = document.createElement('p');
    region.textContent = `Region: ${country.region}`;

    const population = document.createElement('p');
    population.textContent = `Population: ${country.population.toLocaleString()}`;

    card.append(flag, title, capital, region, population);

    const showDetails = () => {
      details.replaceChildren();

      const heading = document.createElement('h3');
      heading.textContent = country.officialName;

      const area = document.createElement('p');
      area.textContent = `Area: ${country.area.toLocaleString()} km²`;

      const borders = document.createElement('p');
      borders.textContent = `Borders: ${country.borders.join(', ') || 'None'}`;

      const languages = document.createElement('p');
      languages.textContent = `Languages: ${country.languages.join(', ') || 'Unknown'}`;

      const currencies = document.createElement('p');
      currencies.textContent = `Currencies: ${country.currencies.join(', ') || 'Unknown'}`;

      details.append(heading, area, borders, languages, currencies);
    };

    card.addEventListener('click', showDetails);

    card.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showDetails();
      }
    });

    resultsContainer.append(card);
  });
}

function renderError(error: unknown) {
  resultsContainer.replaceChildren();
  details.replaceChildren();

  const errorMessage =
    error instanceof Error
      ? error.message
      : 'Something went wrong. Please try again.';

  status.textContent = `Search failed: ${errorMessage}`;
  status.className = 'status error-state';

  const retry = document.createElement('button');
  retry.type = 'button';
  retry.className = 'retry-button';
  retry.textContent = 'Retry';

  retry.addEventListener('click', () => {
    if (lastQuery) {
      manager.search(lastQuery);
    }
  });

  resultsContainer.append(retry);
}

const manager = createSearchManager(
  (countries) => {
    renderCountries(countries);
  },
  (error) => {
    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      error.name === 'AbortError'
    ) {
      return;
    }

    renderError(error);
  },
  (loading) => {
    if (loading) {
      clearResults();
      status.textContent = 'Loading...';
      status.className = 'status loading-state';
    }
  },
);

searchInput.addEventListener('input', () => {
  lastQuery = searchInput.value.trim();

  clearResults();

  if (!lastQuery) {
    manager.cancel();

    status.textContent = '';
    status.className = 'status';
    return;
  }

  status.textContent = '';
  status.className = 'status';

  manager.search(lastQuery);
});
