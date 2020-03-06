/* eslint-disable */
import * as R from 'ramda';
import { dispatch } from '../../utils/store';

import { SET_PAGE } from './constants';

export const setPage = R.partial(dispatch, [SET_PAGE]);
