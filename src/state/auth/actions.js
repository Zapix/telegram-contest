import * as R from 'ramda';

import { dispatch } from 'utils/store';

import { AUTH_SEND_CODE, AUTH_SEND_CODE_ERROR, AUTH_SEND_CODE_SUCCESS } from './constants';

export const sendAuthCode = R.partial(dispatch, [AUTH_SEND_CODE]);
export const sendAuthCodeError = R.partial(dispatch, [AUTH_SEND_CODE_ERROR]);
export const sendAuthCodeSuccess = R.partial(dispatch, [AUTH_SEND_CODE_SUCCESS]);
