/* eslint-disable */
import * as R from 'ramda';

import { dispatch } from 'utils/store';

import { SET_UPDATED, AUTH_REQUESTED, PING_REQUESTED, HTTP_WAIT } from './constants';

export const setUpdated = R.partial(dispatch, [SET_UPDATED, true]);

export const requestPing = R.partial(dispatch, [PING_REQUESTED, null]);
export const requestAuth = R.partial(dispatch, [AUTH_REQUESTED]);
export const httpWait = R.partial(dispatch, [HTTP_WAIT, null]);
