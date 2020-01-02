import * as R from 'ramda';

import { GET_NEAREST_DC } from './constants';
import encryptMessage from './encryptMessage';
import sendRequest from './sendRequest';

function buildGetNearestDcMessage() {
  const buffer = new ArrayBuffer(4);
  const constructorArr = new Uint8Array(buffer, 1);
  constructorArr[0] = GET_NEAREST_DC;

  return buffer;
}

export default function getNearestDC(authKey, authKeyId, salt, sessionId) {
  const encrypt = R.partial(encryptMessage, [authKey, authKeyId, salt, sessionId]);
  return R.pipe(
    buildGetNearestDcMessage,
    encrypt,
    sendRequest,
  )();
}
