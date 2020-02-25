import * as R from 'ramda';

import { dumps, methodFromSchema } from './tl';
import schema from './tl/schema/layer5.json';
import encryptMessage from './encryptMessage';
import sendRequest from './sendRequest';

/**
 * Builds secnd code message
 */
export function buildGetLangPack() {
  const method = R.partial(methodFromSchema, [schema]);
  const message = method(
    'langpack.getLangPack',
    {
      lang_pack: 'dirtylilbitch',
      lang_code: 'en-en',
    },
  );

  return dumps(schema, message);
}

export default function getLanguage(authKey, authKeyId, salt, sessionId, seqNo) {
  const encrypt = R.partial(encryptMessage, [authKey, authKeyId, salt, sessionId, seqNo]);
  return R.pipe(
    buildGetLangPack,
    encrypt,
    sendRequest,
  )();
}
