import { createElement } from 'utils/vdom';
import { Input } from 'components/atoms';
import mergeClasses from 'utils/mergeClasses';

import styles from './CountrySelect.module.scss';
import CountryList from './CountryList';

function handleFocus() {
  const element = document.getElementById('selectCountryWrapper');
  element.classList.add(styles.selected);
}

function handleBlur() {
  const element = document.getElementById('selectCountryWrapper');
  element.classList.remove(styles.selected);
}

export default function CountrySelect(attrs) {
  return createElement(
    'div',
    {
      id: 'selectCountryWrapper',
      class: styles.wrapper,
    },
    [
      createElement(
        'div',
        {
          class: styles.countryListOuter,
          onclick: handleBlur,
        },
        null,
      ),
      createElement(
        'div',
        { class: styles.inputWrapper },
        [
          Input(
            'text',
            Object.assign(
              attrs,
              {
                id: 'selectCountry',
                onfocus: handleFocus,
                class: mergeClasses(attrs),
              },
            ),
          ),
          createElement(
            'span',
            {
              class: styles.check,
            },
            '',
          ),
        ],
      ),
      createElement(
        'div',
        { class: styles.countryListWrapper },
        [CountryList({ onSelectItem: handleBlur })],
      ),
    ],
  );
}
