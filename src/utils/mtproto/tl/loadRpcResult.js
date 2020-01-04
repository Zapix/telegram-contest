// 016d5cf300000000bc860b5ebdbc1522b57572991235646130343337306165386264323132373800
// f35c6d01 5e0b86bc00000000 2215bcbd 997275b5

import { getConstructor } from './utils';

/**
 * Parse rpc result by schema
 * @param {ArrayBuffer} buffer
 * @param {Function} parseMessage
 * @return {{
 *   msgId: BigInt,
 *   message: *
 * }}
 */
export default function loadRpcResult(buffer, parseMessage) {
  return {
    type: getConstructor(buffer),
    msgId: (new BigUint64Array(buffer.slice(4), 0, 1))[0],
    message: parseMessage(buffer.slice(12)),
  };
}
