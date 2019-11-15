import * as R from 'ramda';
import { PING } from './constants';
import { copyBytes, getNRandomBytes } from './utils';
import sendRequest from './sendRequest';
import { encryptMessage } from './encryptMessage';

export function buildPingMessage() {
  const buffer = new ArrayBuffer(12);

  const constructor = new Uint32Array(buffer);
  constructor[0] = PING;

  const randomArray = getNRandomBytes(8);
  const randomBytes = new Uint8Array(buffer, 4);
  copyBytes(randomArray, randomBytes);

  return {
    buffer,
    constructor,
    randomBytes,
  }
}

export default function ping(authKey, authKeyId, salt, sessionId) {
  console.log('Send ping');
  const encrypt = R.partial(encryptMessage, [authKey, authKeyId, salt, sessionId]);
  R.pipe(
    buildPingMessage,
    R.prop('buffer'),
    encrypt,
    sendRequest,
  )()
}
