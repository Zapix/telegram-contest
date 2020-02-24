import * as R from 'ramda';
import { PING_TYPE, TYPE_KEY } from './constants';
import { getMessageId } from './utils';
import sendRequest from './sendRequest';
import encryptMessage from './encryptMessage';
import { tlDumps } from './index';
import schema from './tl/schema/layer5';

export default function ping(authKey, authKeyId, salt, sessionId, seqNo) {
  const encrypt = R.partial(encryptMessage, [authKey, authKeyId, salt, sessionId, seqNo]);
  const pingId = getMessageId();
  console.log('Ping Id:', pingId);
  return R.pipe(
    R.partial(tlDumps, [schema]),
    encrypt,
    sendRequest,
  )({
    pingId,
    [TYPE_KEY]: PING_TYPE,
  });
}
