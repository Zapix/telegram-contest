/**
 * Parse bad msg notification with schema:
 * bad_msg_notification#a7eff811 bad_msg_id:long bad_msg_seqno:int error_code:int
 * @param {ArrayBuffer} buffer
 * @returns {{}}
 */
import { getConstructor } from './utils';

export default function loadBadMsgNotification(buffer) {
  return {
    type: getConstructor(buffer),
    badMsgId: (new BigUint64Array(buffer.slice(4), 0, 1))[0],
    badSeqNo: (new Uint32Array(buffer.slice(12), 0, 1))[0],
    errorCode: (new Uint32Array(buffer.slice(16), 0, 1))[0],
  };
}
