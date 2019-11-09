/* eslint-disable */
import * as R from 'ramda';

import { dispatch } from 'utils/store';

import { SET_UPDATED } from './constants';

export const setUpdated = R.partial(dispatch, [SET_UPDATED, true]);
