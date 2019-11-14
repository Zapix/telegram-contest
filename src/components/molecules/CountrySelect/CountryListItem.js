import * as R from 'ramda';
import { createElement } from 'utils/vdom';

import styles from './CountryListeItem.module.scss';

function handleSelectItem(e, country, handleSelect) {
  e.preventDefault();
  const selectCountry = document.getElementById('selectCountry');
  selectCountry.value = country.name;
  const phoneNumber = document.getElementById('phoneNumber');
  phoneNumber.value = `+${country.phone}`;

  if (R.is(Function, handleSelect)) {
    handleSelect(country);
  }
}

/**
 * Takes country object and displays info about them
 */
export default function CountryListItem(countryCode, country, handleSelect) {
  return createElement(
    'div',
    {
      id: countryCode,
      class: styles.item,
      onclick: R.partialRight(handleSelectItem, [country, handleSelect]),
    },
    [
      createElement(
        'div',
        { class: styles.flag },
        country.emoji,
      ),
      createElement(
        'div',
        { class: styles.countryName },
        country.name,
      ),
      createElement(
        'div',
        { class: styles.phone },
        `+${country.phone}`,
      ),
    ],
  );
}
