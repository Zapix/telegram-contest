import * as R from 'ramda';

import {
  TYPE_KEY,
  METHOD_KEY,
} from './constants';
import { dumps } from './tl';
import schema from './tl/schema/layer5.json';
import encryptMessage from './encryptMessage';
import sendRequest from './sendRequest';

/**
 * Builds secnd code message
 */
export function buildGetLangPack() {
  const message = {
    [TYPE_KEY]: 'LangPackDifference',
    [METHOD_KEY]: 'langpack.getLangPack',
    lang_pack: 'dirtylilbitch',
    lang_code: 'en-en',
  };

  const buffer = dumps(schema, message);
  console.log(buffer);

  return buffer;
}

export default function getLanguage(authKey, authKeyId, salt, sessionId, seqNo) {
  const encrypt = R.partial(encryptMessage, [authKey, authKeyId, salt, sessionId, seqNo]);
  return R.pipe(
    buildGetLangPack,
    encrypt,
    sendRequest,
  )();
}
