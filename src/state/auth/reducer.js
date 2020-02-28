import * as R from 'ramda';
import { isActionOf, buildReducer } from 'utils/store';

import { AUTH_SEND_CODE, AUTH_SEND_CODE_ERROR, AUTH_SEND_CODE_SUCCESS } from './constants';

const handleAuthSendCode = R.always({ sendingAuthCode: true });
const handleAuthSendCodeError = R.pipe(
  R.nth(1),
  R.of,
  R.ap([R.always('sendAuthCodeError'), R.prop('payload')]),
  R.of,
  R.fromPairs,
);
const handleAuthSendCodeSuccess = R.always({});

export default buildReducer({}, [
  [isActionOf(AUTH_SEND_CODE), handleAuthSendCode],
  [isActionOf(AUTH_SEND_CODE_ERROR), handleAuthSendCodeError],
  [isActionOf(AUTH_SEND_CODE_SUCCESS), handleAuthSendCodeSuccess],
]);
