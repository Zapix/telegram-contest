import * as R from 'ramda';

import {
  API_ID,
  API_HASH,
  TYPE_KEY,
  METHOD_KEY, CONSTRUCTOR_KEY,
} from './constants';
import { dumps } from './tl';
import encryptMessage from './encryptMessage';
import sendRequest from './sendRequest';

/**
 * Builds secnd code message
 * @param {string} phone
 */
export function buildAuthSendCodeMessage(phone) {
  const message = {
    [TYPE_KEY]: 'auth.SentCode',
    [METHOD_KEY]: 'auth.sendCode',
    phone_number: phone,
    api_id: API_ID,
    api_hash: API_HASH,
    settings: {
      [TYPE_KEY]: 'CodeSettings',
      [CONSTRUCTOR_KEY]: 'codeSettings',
    },
  };

  return dumps(message);
}

export default function sendAuthCode(authKey, authKeyId, salt, sessionId, seqNo, phone) {
  const encrypt = R.partial(encryptMessage, [authKey, authKeyId, salt, sessionId, seqNo]);
  return R.pipe(
    buildAuthSendCodeMessage,
    encrypt,
    sendRequest,
  )(phone);
}
