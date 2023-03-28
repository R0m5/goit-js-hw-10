import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  evt.preventDefault();
  const trimValue = searchBox.value.trim();
  clearHtml();

  if (trimValue !== '') {
    fetchCountries(trimValue).then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length === 0) {
        Notiflix.Notify.info('Oops, there is no country with that name');
      } else if (data.length >= 2 && data.length <= 10) {
        createListMarkup(data);
      } else if (data.length === 1) {
        createCountryList(data);
      }
    });
  }
}

function clearHtml() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function createListMarkup(countries) {
  const markup = countries
    .map(
      ({ name, flags }) =>
        `<li><img src = "${flags.png}" alt ="${name.official}" width = "60" height = "50">${name.official}</li>`
    )
    .join(' ');
  countryList.innerHTML = markup;
}

function createCountryList(country) {
  const card = country
    .map(
      ({ name, capital, flags, population, languages }) =>
        `<div class = "country_item"><img class = "country_icon" src = "${
          flags.svg
        }" alt = "${name.official}" width = "100" height = "80"></div>
      <h1>${name.official}</h1>
      <p class = "info">${capital}</p>
      <p class = "info">Capital: ${capital}</p>
      <p class = "info">Population: ${population}</p>
      <p class = "info">Languages: ${Object.values(languages)}</p>`
    )
    .join(' ');
  countryList.innerHTML = '';
}
