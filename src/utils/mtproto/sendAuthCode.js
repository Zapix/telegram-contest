import * as R from 'ramda';

import {
  API_ID,
  API_HASH,
} from './constants';
import { dumps, methodFromSchema } from './tl';
import schema from './tl/schema/layer5';
import encryptMessage from './encryptMessage';
import sendRequest from './sendRequest';
import { getMessageId } from './utils';

/**
 * Builds secnd code message
 * @param {string} phone
 */
export function buildAuthSendCodeMessage(phone) {
  const method = R.partial(methodFromSchema, [schema]);
  const message = method(
    'auth.sendCode',
    {
      phone_number: phone,
      api_id: API_ID,
      sms_type: 0,
      lang_code: 'ru',
      api_hash: API_HASH,
    },
  );
  return dumps(schema, message);
}

export default function sendAuthCode(authKey, authKeyId, salt, sessionId, seqNo, phone) {
  const messageId = getMessageId();
  const encrypt = R.partial(
    encryptMessage,
    [authKey, authKeyId, salt, sessionId, seqNo, messageId],
  );
  return R.pipe(
    buildAuthSendCodeMessage,
    encrypt,
    sendRequest,
  )(phone);
}
