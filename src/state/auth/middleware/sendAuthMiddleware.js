import * as R from 'ramda';
import { catchError, filter, mergeMap } from 'rxjs/operators';
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

const handleSuccess = R.pipe(
  R.of,
  R.ap([sendAuthCodeSuccess, R.partial(setPage, ['verify'])]),
);
const handleError = R.pipe(
  R.prop('errorMessage'),
  sendAuthCodeError,
);
const handleResponse = R.cond([
  [isMessageOf(RPC_ERROR_TYPE), handleError],
  [R.T, handleSuccess],
]);

/**
 * @param action$ - stream of actions
 * @param state$ - stream of application state
 * @param {*} connection  - mtproto connection object
 */
export default function sendAuthMiddleware(action$, state$, connection) {
  connection.addEventListener(STATUS_CHANGED_EVENT, (e) => {
    if (e.status === AUTH_KEY_CREATED) {
      const sendAuthRequestStream = R.pipe(
        R.prop('payload'),
        sendAuthCode,
        (x) => connection.request(x),
        fromPromise,
      );

      action$
        .pipe(filter(isActionOf(AUTH_SEND_CODE)))
        .pipe(mergeMap((x) => sendAuthRequestStream(x).pipe(catchError(R.of))))
        .subscribe(handleResponse);
    }
  });
}
