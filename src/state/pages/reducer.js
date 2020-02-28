import * as R from 'ramda';

import { isActionOf, buildReducer } from 'utils/store';
import { SET_PAGE } from './constants';

const handleSetPage = R.pipe(
  R.nth(1),
  R.prop('payload'),
);

export default buildReducer('login', [
  [isActionOf(SET_PAGE), handleSetPage],
]);
