/**
 * Parses array buffer with pong schema
 * @param {ArrayBuffer} buffer
 * @returns {{ msgId: BigInt, pingId: BigInt }}
 */
import { getConstructor } from './utils';

export default function loadPong(buffer) {
  const constructor = getConstructor(buffer);
  const msgIdArr = new BigUint64Array(buffer.slice(4), 0, 1);
  const pingIdArr = new BigUint64Array(buffer.slice(12), 0, 1);

  return {
    type: constructor,
    msgId: msgIdArr[0],
    pingId: pingIdArr[0],
  };
}
