import * as R from 'ramda';

import { isActionOf, buildReducer } from 'utils/store';

import { SET_UPDATED } from './constants';

export default buildReducer(false, [
  [isActionOf(SET_UPDATED), R.T],
]);
