import * as R from 'ramda';
import { isActionOf, buildReducer } from 'utils/store';

import {
  AUTH_SEND_CODE,
  AUTH_SEND_CODE_ERROR,
  AUTH_SEND_CODE_SUCCESS,
  CLEAR_AUTH_STATE, SET_AUTHORIZATION_DATA, SIGN_UP, SIGN_UP_ERROR,
  VERIFY_CODE,
  VERIFY_CODE_ERROR,
} from './constants';

const getCurrentPhonePair = R.pipe(
  R.of,
  R.ap([R.always('currentPhone'), R.path(['payload', 'phone'])]),
);
const getPhoneCodeHashPair = R.pipe(
  R.of,
  R.ap([R.always('phoneCodeHash'), R.path(['payload', 'phone_code_hash'])]),
);

const getPhoneRegisteredPair = R.pipe(
  R.of,
  R.ap([R.always('phoneRegistered'), R.path(['payload', 'phone_registered'])]),

);

const handleAuthSendCode = R.always({ sendingAuthCode: true });
const handleAuthSendCodeError = R.pipe(
  R.nth(1),
  R.of,
  R.ap([R.always('sendAuthCodeError'), R.prop('payload')]),
  R.of,
  R.fromPairs,
);
const handleAuthSendCodeSuccess = R.pipe(
  R.nth(1),
  R.of,
  R.ap([getCurrentPhonePair, getPhoneCodeHashPair, getPhoneRegisteredPair]),
  R.fromPairs,
);

const handleVerifyCode = R.pipe(
  R.of,
  R.ap([
    R.nth(0),
    R.pipe(R.nth(1), R.prop('payload'), R.set(R.lensProp('verifyCode'), R.__, {})),
  ]),
  R.mergeAll,
  R.omit(['verifyError']),
);

const handleVerifyError = R.pipe(
  R.of,
  R.ap([
    R.nth(0),
    R.pipe(R.nth(1), R.prop('payload'), R.set(R.lensProp('verifyError'), R.__, {})),
  ]),
  R.mergeAll,
);

const handleClearAuthState = R.always({});

const handleSignUp = R.pipe(
  R.of,
  R.ap([
    R.pipe(R.nth(0), R.omit(['signUpError'])),
    R.pipe(R.nth(1), R.prop('payload'), R.pickAll(['firstName', 'lastName'])),
  ]),
  R.mergeAll,
);

const handleSignUpError = R.pipe(
  R.of,
  R.ap([
    R.nth(0),
    R.pipe(R.nth(1), R.prop('payload'), R.set(R.lensProp('signUpError'), R.__, {})),
  ]),
  R.mergeAll,
);

const handleSetAuthorizationData = R.pipe(
  R.of,
  R.ap([
    R.nth(0),
    R.pipe(R.nth(1), R.prop('payload')),
  ]),
  R.mergeAll,
);

export default buildReducer({}, [
  [isActionOf(AUTH_SEND_CODE), handleAuthSendCode],
  [isActionOf(AUTH_SEND_CODE_ERROR), handleAuthSendCodeError],
  [isActionOf(AUTH_SEND_CODE_SUCCESS), handleAuthSendCodeSuccess],
  [isActionOf(VERIFY_CODE), handleVerifyCode],
  [isActionOf(VERIFY_CODE_ERROR), handleVerifyError],
  [isActionOf(CLEAR_AUTH_STATE), handleClearAuthState],
  [isActionOf(SIGN_UP), handleSignUp],
  [isActionOf(SIGN_UP_ERROR), handleSignUpError],
  [isActionOf(SET_AUTHORIZATION_DATA), handleSetAuthorizationData],
]);
