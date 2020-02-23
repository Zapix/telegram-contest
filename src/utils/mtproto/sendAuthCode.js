import * as R from 'ramda';

import {
  API_ID,
  API_HASH,
  TYPE_KEY,
  METHOD_KEY,
} from './constants';
import { dumps } from './tl';
import encryptMessage from './encryptMessage';
import sendRequest from './sendRequest';
import { arrayBufferToHex } from './utils';

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
  };

  const buffer = dumps(message);
  console.log(arrayBufferToHex(buffer));

  return buffer;
}

export default function sendAuthCode(authKey, authKeyId, salt, sessionId, seqNo, phone) {
  const encrypt = R.partial(encryptMessage, [authKey, authKeyId, salt, sessionId, seqNo]);
  return R.pipe(
    buildAuthSendCodeMessage,
    encrypt,
    sendRequest,
  )(phone);
}
