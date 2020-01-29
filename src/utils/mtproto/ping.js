import * as R from 'ramda';
import { PING_TYPE, TYPE_KEY } from './constants';
import { getMessageId } from './utils';
import sendRequest from './sendRequest';
import encryptMessage from './encryptMessage';
import { tlDumps } from './index';

export default function ping(authKey, authKeyId, salt, sessionId, seqNo) {
  const encrypt = R.partial(encryptMessage, [authKey, authKeyId, salt, sessionId, seqNo]);
  const pingId = getMessageId();
  console.log('Ping Id:', pingId);
  return R.pipe(
    tlDumps,
    encrypt,
    sendRequest,
  )({
    pingId,
    [TYPE_KEY]: PING_TYPE,
  });
}
