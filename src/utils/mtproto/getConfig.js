import * as R from 'ramda';

import encryptMessage from './encryptMessage';
import sendRequest from './sendRequest';
import { dumps, methodFromSchema } from './tl';
import schema from './tl/schema/layer5';

function buildGetConfig() {
  const method = R.partial(methodFromSchema, [schema]);
  const obj = method('help.getConfig', {});
  console.log(obj);
  const buffer = dumps(schema, obj);

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
