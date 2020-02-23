import * as R from 'ramda';

import encryptMessage from './encryptMessage';
import sendRequest from './sendRequest';
import { dumps } from './tl';
import { METHOD_KEY, TYPE_KEY } from './constants';

function buildGetConfig() {
  const buffer = dumps({
    [TYPE_KEY]: 'Config',
    [METHOD_KEY]: 'help.getConfig',
  });

  console.log(buffer);

  return buffer;
}

export default function getConfig(authKey, authKeyId, salt, sessionId, seqNo) {
  const encrypt = R.partial(encryptMessage, [authKey, authKeyId, salt, sessionId, seqNo]);
  return R.pipe(
    buildGetConfig,
    encrypt,
    sendRequest,
  )();
}
