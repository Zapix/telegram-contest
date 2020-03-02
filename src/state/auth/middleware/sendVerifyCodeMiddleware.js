import * as R from 'ramda';
import {
  catchError,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

import { methodFromSchema } from 'utils/mtproto';
import { AUTH_KEY_CREATED, STATUS_CHANGED_EVENT } from 'utils/mtproto/MTProto';
import schema from 'utils/mtproto/tl/schema/layer5';

import { isActionOf } from 'utils/store';
import { VERIFY_CODE } from '../constants';

const sendSignIn = R.partial(methodFromSchema, [schema, 'auth.signIn']);

/**
 * Selector to get phone_number from state
 * @params {*} state - application state
 * @returns {{phone_number: string, phone_code_hash: string }}
 */
const getPhoneCodeHash = R.pipe(
  R.path(['auth', 'phoneCodeHash']),
  R.set(R.lensProp('phone_code_hash'), R.__, {}),
);

/**
 * Selector to get phone_number from state
 * @params {*} state - application state
 * @returns {{phone_number: string, phone_code_hash: string }}
 */
const getPhoneNumber = R.pipe(
  R.path(['auth', 'currentPhone']),
  R.set(R.lensProp('phone_number'), R.__, {}),
);

/**
 * Selector to get phone_number, phone_code_hash from state
 * @params {*} state - application state
 * @returns {{phone_number: string, phone_code_hash: string }}
 */
const getPhoneData = R.pipe(
  R.of,
  R.ap([getPhoneNumber, getPhoneCodeHash]),
  R.mergeAll,
);

const getPhoneCode = R.pipe(
  R.prop('payload'),
  R.set(R.lensProp('phone_code'), R.__, {}),
);

/**
 * @param action$ - stream of actions
 * @param state$ - stream of application state
 * @param {*} connection  - mtproto connection object
 */
export default function sendVerifyCodeMiddleware(action$, state$, connection) {
  connection.addEventListener(STATUS_CHANGED_EVENT, (e) => {
    if (e.status === AUTH_KEY_CREATED) {
      const phoneData$ = state$.pipe(map(getPhoneData));
      const verifyCode$ = action$
        .pipe(filter(isActionOf(VERIFY_CODE)))
        .pipe(map(getPhoneCode));

      const sendSignIn$ = phoneData$
        .pipe(withLatestFrom(verifyCode$))
        .pipe(map(R.mergeAll))
        .pipe(map(sendSignIn));

      sendSignIn$
        .pipe(mergeMap((x) => fromPromise(connection.request(x)).pipe(catchError(R.of))))
        .subscribe(
          (x) => console.log(x),
        );
    }
  });
}
