import * as R from 'ramda';
import {
  catchError,
  filter,
  mergeMap,
  map,
  withLatestFrom,
} from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

import { methodFromSchema } from 'utils/mtproto';
import { AUTH_KEY_CREATED, STATUS_CHANGED_EVENT } from 'utils/mtproto/MTProto';
import schema from 'utils/mtproto/tl/schema/layer5';

import { isActionOf } from 'utils/store';
import { API_HASH, API_ID, RPC_ERROR_TYPE } from 'utils/mtproto/constants';
import { AUTH_SEND_CODE } from '../constants';
import { sendAuthCodeError, sendAuthCodeSuccess } from '../actions';
import { isMessageOf } from '../../../utils/mtproto/tl/utils';
import { setPage } from '../../pages';

const sendAuthMethod = R.partial(methodFromSchema, [schema, 'auth.sendCode']);

const baseAuthData = {
  api_id: API_ID,
  sms_type: 0,
  lang_code: 'ru',
  api_hash: API_HASH,
};

const sendAuthCode = R.pipe(
  R.set(R.lensProp('phone_number'), R.__, baseAuthData),
  sendAuthMethod,
);

const mergeResponseWithPhone = R.pipe(
  R.reverse,
  R.apply(R.set(R.lensProp('phone'))),
);

const handleSuccess = R.pipe(
  mergeResponseWithPhone,
  R.of,
  R.ap([sendAuthCodeSuccess, R.partial(setPage, ['verify'])]),
);
const handleError = R.pipe(
  R.nth(0),
  R.prop('errorMessage'),
  sendAuthCodeError,
);

const handleResponseWithPhone = R.pipe(
  R.cond([
    [R.pipe(R.nth(0), isMessageOf(RPC_ERROR_TYPE)), handleError],
    [R.T, handleSuccess],
  ]),
);

const getPhone = R.prop('payload');

/**
 * @param action$ - stream of actions
 * @param state$ - stream of application state
 * @param {*} connection  - mtproto connection object
 */
export default function sendAuthMiddleware(action$, state$, connection) {
  connection.addEventListener(STATUS_CHANGED_EVENT, (e) => {
    if (e.status === AUTH_KEY_CREATED) {
      const sendAuthRequestStream = R.pipe(
        getPhone,
        sendAuthCode,
        (x) => connection.request(x),
        fromPromise,
      );

      const sendAuth$ = action$.pipe(filter(isActionOf(AUTH_SEND_CODE)));
      const authPhone$ = sendAuth$.pipe(map(getPhone));
      const sendAuthResponse$ = sendAuth$.pipe(
        mergeMap((x) => sendAuthRequestStream(x).pipe(catchError(R.of))),
      );

      sendAuthResponse$
        .pipe(withLatestFrom(authPhone$))
        .subscribe(handleResponseWithPhone);
    }
  });
}
