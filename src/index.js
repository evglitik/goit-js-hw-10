import './css/styles.css';
import Notiflix from 'notiflix';
import fetchCountries from './js/fetchCountries';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
  const nameCountry = e.target.value;
  if (nameCountry.trim() === '') {
    clearCard();
    return;
  } else {
    fetchCountries(nameCountry.trim())
      .then(country => {
        if (country.length < 2) {
          generetCountryInfo(country);
        } else if (country.length < 10 && country.length > 1) {
          generetList(country);
        } else {
          clearCard();
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(() => {
        Notiflix.Notify.failure('Oops, there is no country with that name.');
        clearCard();
      });
  }
}

function generetList(countrys) {
  clearCard();

  countrys.map(c => {
    countryList.insertAdjacentHTML(
      'beforeend',
      `<li><img src="${c.flags.svg}" alt="Country flag" width="50", height="33"><span class="country-name">${c.name.official}</span></li>`
    );
  });
}

function generetCountryInfo(country) {
  clearCard();
  const c = country[0];

  countryInfo.insertAdjacentHTML(
    'beforeend',
    `<div class="country-info-cont"><div class="country-info-flex"><img src="${
      c.flags.svg
    }" alt="Country Flag" width="55", height="35">
      <span> ${c.name.official}</span></div>
      <p>Capital:<span> ${c.capital}</span></p>
      <p>Population:<span> ${c.population}</span></p>
      <p>Languages:<span> ${Object.values(c.languages).join(
        ', '
      )}</span></p></div>`
  );
}

function clearCard() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
