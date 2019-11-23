import * as R from 'ramda';
import wrapPlainMessage from './wrapPlainMessage';
import encryptMessage from './encryptMessage';
import sendRequest from './sendRequest';
import { HTTP_WAIT } from './constants';

function httpWaitMessage() {
  const buffer = new ArrayBuffer(16);
  const constructor = new Uint32Array(buffer, 0, 1);
  constructor[0] = HTTP_WAIT;

  const maxDelay = new Uint32Array(buffer, 4, 1);
  maxDelay[0] = 0;

  const waitAfter = new Uint32Array(buffer, 8, 1);
  waitAfter[0] = 0;

  const maxWait = new Uint32Array(buffer, 12, 1);
  maxWait[0] = 25 * 1000;

  return { buffer };
}

export default function httpWait(authKey, authKeyId, salt, sessionId) {
  const encrypt = R.partial(
    encryptMessage,
    [authKey, authKeyId, salt, sessionId],
  );

  return R.pipe(
    httpWaitMessage,
    R.prop('buffer'),
    encrypt,
    sendRequest
  )();
}
