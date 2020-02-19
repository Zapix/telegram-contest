import * as R from 'ramda';

import { GET_NEAREST_DC } from './constants';
import encryptMessage from './encryptMessage';
import sendRequest from './sendRequest';

function buildGetNearestDcMessage() {
  const buffer = new ArrayBuffer(4);
  const constructorArr = new Uint32Array(buffer);
  constructorArr[0] = GET_NEAREST_DC;

  return buffer;
}

export default function getNearestDc(authKey, authKeyId, salt, sessionId, seqNo) {
  const encrypt = R.partial(encryptMessage, [authKey, authKeyId, salt, sessionId, seqNo]);
  return R.pipe(
    buildGetNearestDcMessage,
    encrypt,
    sendRequest,
  )();
}
