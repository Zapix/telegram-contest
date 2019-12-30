import * as R from 'ramda';

import {
  API_ID,
  API_HASH,
  AUTH_SEND_CODE,
  CODE_SETTINGS,
} from './constants';
import { stringToTlString } from './tlSerialization';
import { copyBytes } from './utils';
import encryptMessage from './encryptMessage';
import sendRequest from './sendRequest';

/**
 * Builds secnd code message
 * @param {string} phone
 */
export function buildAuthSendCodeMessage(phone) {
  const phoneTl = stringToTlString(phone);
  const apiHashTl = stringToTlString(API_HASH);

  const buffer = new ArrayBuffer(4 + phoneTl.length + 4 + apiHashTl.length + 4 + 4);

  const constructor = new Uint32Array(buffer, 0, 1);
  constructor[0] = AUTH_SEND_CODE;

  const phoneTlBytes = new Uint8Array(buffer, 4, phoneTl.length);
  copyBytes(phoneTl, phoneTlBytes);

  const apiId = new Uint32Array(buffer, 4 + phoneTl.length, 1);
  apiId[0] = API_ID;

  const apiHashTlBytes = new Uint8Array(buffer, 4 + phoneTl.length + 4, apiHashTl.length);
  copyBytes(apiHashTl, apiHashTlBytes);

  const codeSettings = new Uint32Array(
    buffer,
    4 + phoneTl.length + 4 + apiHashTlBytes.length,
    2,
  );
  codeSettings[0] = CODE_SETTINGS;

  return {
    buffer,
    constructor,
    phoneTl,
    apiId,
    apiHashTl,
    codeSettings,
  };
}

export default function sendAuthCode(authKey, authKeyId, salt, sessionId, phone) {
  const encrypt = R.partial(encryptMessage, [authKey, authKeyId, salt, sessionId]);
  return R.pipe(
    buildAuthSendCodeMessage,
    encrypt,
    sendRequest,
  )(phone);
}
