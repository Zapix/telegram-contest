import * as R from 'ramda';
import { createElement } from 'utils/vdom';
import { countries } from 'countries-list';

import styles from './CountryList.module.scss';
import CountryListItem from './CountryListItem';

export default function CountryList({ onSelectItem: handleSelect }) {
  return createElement(
    'div',
    {
      id: 'countryList',
      class: styles.countryList,
    },
    R.pipe(
      R.toPairs(),
      R.map(
        R.pipe(
          R.append(handleSelect),
          R.apply(CountryListItem),
        ),
      ),
    )(countries),
  );
}
