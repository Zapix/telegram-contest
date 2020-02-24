import * as R from 'ramda';
import encryptMessage from './encryptMessage';
import sendRequest from './sendRequest';
import { HTTP_WAIT_TYPE, TYPE_KEY } from './constants';
import { tlDumps } from './index';
import schema from './tl/schema/layer5';

export default function httpWait(authKey, authKeyId, salt, sessionId, seqNo) {
  const encrypt = R.partial(
    encryptMessage,
    [authKey, authKeyId, salt, sessionId, seqNo],
  );

  return R.pipe(
    R.partial(tlDumps, [schema]),
    encrypt,
    sendRequest,
  )({
    [TYPE_KEY]: HTTP_WAIT_TYPE, maxDelay: 0, waitAfter: 0, maxWait: 25000,
  });
}
