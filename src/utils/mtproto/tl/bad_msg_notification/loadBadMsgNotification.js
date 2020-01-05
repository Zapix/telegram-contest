import * as R from 'ramda';
import { sliceBuffer } from '../../utils';
import { loadBigInt } from '../bigInt';
import { loadInt } from '../int';
import { BAD_MSG_NOTIFICATION_TYPE, TYPE_KEY } from '../../constants';

const getMsgId = R.pipe(
  R.partialRight(sliceBuffer, [4, 12]),
  loadBigInt,
);

const getSeqNo = R.pipe(
  R.partialRight(sliceBuffer, [12, 16]),
  loadInt,
);

const getErrorCode = R.pipe(
  R.partialRight(sliceBuffer, [16, 20]),
  loadInt,
);


/**
 * Parse bad msg notification with schema:
 * bad_msg_notification#a7eff811 bad_msg_id:long bad_msg_seqno:int error_code:int
 * @param {ArrayBuffer} buffer
 * @returns {{}}
 */
export default R.pipe(
  R.of,
  R.ap([R.always(BAD_MSG_NOTIFICATION_TYPE), getMsgId, getSeqNo, getErrorCode]),
  R.zipObj([TYPE_KEY, 'badMsgId', 'badSeqNo', 'errorCode']),
);
