import './style.css';
import { createSearchManager } from './api/searchManager';
import { createCountryDetails } from './components/CountryDetails';
import type { Country } from './types/country';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App container not found');
}

app.innerHTML = `
  <main class="container">
    <header class="page-header">
      <div class="brand">
        <span class="brand-icon">◎</span>
        <span>WORLD ATLAS</span>
      </div>

      <div class="hero">
        <span class="eyebrow">EXPLORE THE WORLD</span>
        <h1>Discover every<br /><span>corner of the world.</span></h1>
        <p>
          Search for a country and explore its people,
          places and fascinating details.
        </p>
      </div>
    </header>

    <section class="search-section">
      <label class="search-box" for="search">
        <span class="search-icon">⌕</span>
        <input
          id="search"
          type="search"
          placeholder="Search a country..."
          autocomplete="off"
        />
        <span class="search-hint">SEARCH</span>
      </label>
    </section>

    <div class="results-heading">
      <h2>Explore countries</h2>
      <p id="status" aria-live="polite"></p>
    </div>

    <section id="results" class="results"></section>
  </main>
`;

const searchInput = document.querySelector<HTMLInputElement>('#search')!;
const resultsContainer = document.querySelector<HTMLDivElement>('#results')!;
const status = document.querySelector<HTMLParagraphElement>('#status')!;

let lastQuery = '';

function clearResults() {
  resultsContainer.replaceChildren();
}

function openCountryDetails(country: Country) {
  const dialog = createCountryDetails(country);

  app!.append(dialog);
  dialog.showModal();

  dialog.addEventListener('close', () => {
    dialog.remove();
  });
}

function createCountryCard(country: Country): HTMLElement {
  const card = document.createElement('article');
  card.className = 'country-card';
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `View details about ${country.name}`);

  const flagWrapper = document.createElement('div');
  flagWrapper.className = 'card-flag';

  const flag = document.createElement('img');
  flag.src = country.flag;
  flag.alt = `Flag of ${country.name}`;
  flag.loading = 'lazy';

  flag.addEventListener('error', () => {
    flagWrapper.textContent = '🌍';
    flag.remove();
  });

  flagWrapper.append(flag);

  const content = document.createElement('div');
  content.className = 'card-content';

  const region = document.createElement('span');
  region.className = 'card-region';
  region.textContent = country.region;

  const title = document.createElement('h3');
  title.textContent = country.name;

  const capital = document.createElement('p');
  capital.className = 'card-capital';
  capital.textContent = country.capital || 'Capital unknown';

  const footer = document.createElement('div');
  footer.className = 'card-footer';

  const populationLabel = document.createElement('span');
  populationLabel.textContent = 'POPULATION';

  const population = document.createElement('strong');
  population.textContent = country.population.toLocaleString();

  footer.append(populationLabel, population);
  content.append(region, title, capital, footer);
  card.append(flagWrapper, content);

  const showDetails = () => {
    openCountryDetails(country);
  };

  card.addEventListener('click', showDetails);

  card.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      showDetails();
    }
  });

  return card;
}

function renderCountries(countries: Country[]) {
  clearResults();

  if (countries.length === 0) {
    status.textContent = '';

    const emptyState = document.createElement('div');
    emptyState.className = 'state-card';

    const icon = document.createElement('div');
    icon.className = 'state-icon';
    icon.textContent = '⌕';

    const title = document.createElement('h3');
    title.textContent = 'No countries found';

    const description = document.createElement('p');
    description.textContent =
      'We could not find a match. Try another country name.';

    emptyState.append(icon, title, description);
    resultsContainer.append(emptyState);

    return;
  }

  status.textContent = `${countries.length} ${
    countries.length === 1 ? 'COUNTRY' : 'COUNTRIES'
  } FOUND`;

  const grid = document.createElement('div');
  grid.className = 'country-grid';

  countries.forEach((country, index) => {
    const card = createCountryCard(country);

    // Плавное последовательное появление карточек
    card.style.animationDelay = `${index * 50}ms`;

    grid.append(card);
  });

  resultsContainer.append(grid);
}

function renderError(error: unknown) {
  clearResults();

  const message =
    error instanceof Error
      ? error.message
      : 'Something went wrong. Please try again.';

  status.textContent = '';

  const errorState = document.createElement('div');
  errorState.className = 'state-card error-card';

  const icon = document.createElement('div');
  icon.className = 'state-icon';
  icon.textContent = '!';

  const title = document.createElement('h3');
  title.textContent = 'Something went wrong';

  const description = document.createElement('p');
  description.textContent = message;

  const retry = document.createElement('button');
  retry.type = 'button';
  retry.className = 'retry-button';
  retry.textContent = 'Try again';

  retry.addEventListener('click', () => {
    if (lastQuery) {
      manager.search(lastQuery);
    }
  });

  errorState.append(icon, title, description, retry);
  resultsContainer.append(errorState);
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

    if (error === null) {
      return;
    }

    renderError(error);
  },
  (loading) => {
    if (loading) {
      clearResults();

      status.textContent = 'SEARCHING...';
      status.className = 'loading-status';

      const loader = document.createElement('div');
      loader.className = 'loading-state';

      const spinner = document.createElement('div');
      spinner.className = 'spinner';

      const message = document.createElement('p');
      message.textContent = 'Exploring the world...';

      loader.append(spinner, message);
      resultsContainer.append(loader);
    } else {
      status.className = '';
    }
  },
);

searchInput.addEventListener('input', () => {
  lastQuery = searchInput.value.trim();

  clearResults();
  status.textContent = '';
  status.className = '';

  if (!lastQuery) {
    manager.cancel();
    return;
  }

  manager.search(lastQuery);
});
