/**
 * Parses array buffer with new session created schema
 * @param {ArrayBuffer} buffer
 * @returns {{ firstMsgId: BigInt, uniqueId: BigInt, serverSalt: BigInt }}
 */
import { getConstructor } from './utils';

export default function parseNewSessionCreated(buffer) {
  const constructor = getConstructor(buffer);
  const firstMsgIdArr = new BigUint64Array(buffer.slice(4), 0, 1);
  const uniqueIdArr = new BigUint64Array(buffer.slice(12), 0, 1);
  const serverSaltArr = new BigUint64Array(buffer.slice(20), 0, 1);

  return {
    type: constructor,
    firstMsgId: firstMsgIdArr[0],
    uniqueId: uniqueIdArr[0],
    serverSalt: serverSaltArr[0],
  };
}
