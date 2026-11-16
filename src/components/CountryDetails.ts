import type { Country } from '../types/country';

function createInfoItem(label: string, value: string): HTMLElement {
  const item = document.createElement('div');
  item.className = 'detail-item';

  const title = document.createElement('span');
  title.className = 'detail-label';
  title.textContent = label;

  const content = document.createElement('span');
  content.className = 'detail-value';
  content.textContent = value;

  item.append(title, content);

  return item;
}

export function createCountryDetails(country: Country): HTMLDialogElement {
  const dialog = document.createElement('dialog');
  dialog.className = 'country-modal';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const closeButton = document.createElement('button');
  closeButton.className = 'modal-close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close details');
  closeButton.innerHTML = '&times;';

  closeButton.addEventListener('click', () => {
    dialog.close();
  });

  const header = document.createElement('div');
  header.className = 'modal-header';

  const flag = document.createElement('img');
  flag.className = 'modal-flag';
  flag.src = country.flag;
  flag.alt = `Flag of ${country.name}`;

  const headingGroup = document.createElement('div');
  headingGroup.className = 'modal-heading';

  const name = document.createElement('h2');
  name.textContent = country.name;

  const officialName = document.createElement('p');
  officialName.textContent = country.officialName;

  headingGroup.append(name, officialName);
  header.append(flag, headingGroup);

  const divider = document.createElement('div');
  divider.className = 'modal-divider';

  const sectionTitle = document.createElement('h3');
  sectionTitle.className = 'details-title';
  sectionTitle.textContent = 'Country overview';

  const grid = document.createElement('div');
  grid.className = 'details-grid';

  grid.append(
    createInfoItem('Capital', country.capital || 'Unknown'),
    createInfoItem('Region', country.region || 'Unknown'),
    createInfoItem('Population', country.population.toLocaleString()),
    createInfoItem('Area', `${country.area.toLocaleString()} km²`),
    createInfoItem('Languages', country.languages.join(', ') || 'Unknown'),
    createInfoItem('Currencies', country.currencies.join(', ') || 'Unknown'),
    createInfoItem('Border countries', country.borders.join(', ') || 'None'),
  );

  modalContent.append(closeButton, header, divider, sectionTitle, grid);

  dialog.append(modalContent);

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  return dialog;
}
