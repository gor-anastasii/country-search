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

    <p id="status" aria-live="polite"></p>

    <section id="results" class="results"></section>

    <section id="details"></section>
  </main>
`;

const searchInput = document.querySelector<HTMLInputElement>('#search')!;

const resultsContainer = document.querySelector<HTMLDivElement>('#results')!;

const status = document.querySelector<HTMLParagraphElement>('#status')!;

const details = document.querySelector<HTMLDivElement>('#details')!;

let lastQuery = '';

const manager = createSearchManager(
  (countries) => {
    resultsContainer.replaceChildren();

    status.textContent = countries.length
      ? `Found: ${countries.length}`
      : 'Nothing found';

    countries.forEach((country) => {
      const card = document.createElement('article');

      card.className = 'country-card';

      const flag = document.createElement('img');
      flag.src = country.flag;
      flag.alt = `Flag of ${country.name}`;

      const title = document.createElement('h2');
      title.textContent = country.name;

      const capital = document.createElement('p');
      capital.textContent = `Capital: ${country.capital}`;

      const region = document.createElement('p');
      region.textContent = `Region: ${country.region}`;

      const population = document.createElement('p');
      population.textContent = `Population: ${country.population.toLocaleString()}`;

      card.append(flag, title, capital, region, population);

      card.addEventListener('click', () => {
        details.textContent = [
          country.officialName,
          `Area: ${country.area} km²`,
          `Borders: ${country.borders.join(', ') || 'None'}`,
          `Languages: ${country.languages.join(', ') || 'Unknown'}`,
          `Currencies: ${country.currencies.join(', ') || 'Unknown'}`,
        ].join(' | ');
      });

      resultsContainer.append(card);
    });
  },
  (error) => {
    status.textContent =
      error instanceof Error ? error.message : 'Something went wrong';

    const retry = document.createElement('button');
    retry.textContent = 'Retry';

    retry.addEventListener('click', () => {
      manager.search(lastQuery);
    });

    resultsContainer.replaceChildren(retry);
  },
  (loading) => {
    if (loading) {
      status.textContent = 'Loading...';
    }
  },
);

searchInput.addEventListener('input', () => {
  lastQuery = searchInput.value.trim();

  resultsContainer.replaceChildren();
  details.replaceChildren();

  if (!lastQuery) {
    status.textContent = '';
    return;
  }

  manager.search(lastQuery);
});
