import * as R from 'ramda';
import { fromPromise } from 'rxjs/internal-compatibility';
import {
  catchError,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';

import { AUTH_KEY_CREATED, STATUS_CHANGED_EVENT } from 'utils/mtproto/MTProto';
import { isActionOf } from 'utils/store';
import { methodFromSchema } from 'utils/mtproto';
import layer5 from 'utils/mtproto/tl/schema/layer5';
import { isMessageOf } from 'utils/mtproto/tl/utils';
import { RPC_ERROR_TYPE } from 'utils/mtproto/constants';
import { SIGN_UP } from 'state/auth/constants';
import { setAuthorizationData, signUpError } from '../actions';
import { setPage } from '../../pages';

const method = R.partial(methodFromSchema, [layer5]);
const methodSignUp = R.partial(method, ['auth.signUp']);

const getFirstNameFromAction = R.pipe(
  R.path(['payload', 'firstName']),
  R.set(R.lensProp('first_name'), R.__, {}),
);

const getLastNameFromAction = R.pipe(
  R.path(['payload', 'lastName']),
  R.set(R.lensProp('last_name'), R.__, {}),
);

const getSignUpNames = R.pipe(
  R.of,
  R.ap([getFirstNameFromAction, getLastNameFromAction]),
  R.mergeAll,
);

const getPhoneNumberFromState = R.pipe(
  R.path(['auth', 'currentPhone']),
  R.set(R.lensProp('phone_number'), R.__, {}),
);

const getPhoneCodeHashFromState = R.pipe(
  R.path(['auth', 'phoneCodeHash']),
  R.set(R.lensProp('phone_code_hash'), R.__, {}),
);

const getAuthDataFromState = R.pipe(
  R.of,
  R.ap([getPhoneNumberFromState, getPhoneCodeHashFromState]),
  R.mergeAll,
);

const handleResponseError = R.pipe(
  R.prop('errorMessage'),
  signUpError,
);

const handleResponseSuccess = R.pipe(
  R.of,
  R.ap([setAuthorizationData, R.partial(setPage, ['chat'])]),
);

const handleSignUpResponse = R.cond([
  [isMessageOf(RPC_ERROR_TYPE), handleResponseError],
  [R.T, handleResponseSuccess],
]);

export default function signUpMiddleware(action$, state$, connection) {
  connection.addEventListener(STATUS_CHANGED_EVENT, (e) => {
    if (e.status === AUTH_KEY_CREATED) {
      const signUpNames$ = action$
        .pipe(filter(isActionOf(SIGN_UP)))
        .pipe(map(getSignUpNames));

      const authData$ = state$
        .pipe(map(getAuthDataFromState));

      const signUp$ = signUpNames$
        .pipe(withLatestFrom(authData$))
        .pipe(map(R.mergeAll))
        .pipe(map(methodSignUp))
        .pipe(mergeMap((x) => fromPromise(connection.request(x)).pipe(catchError(R.of))));

      signUp$.subscribe(handleSignUpResponse);
    }
  });
}
