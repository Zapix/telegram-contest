import loadVector from './loadVector';
import { loadBigInt } from './bigInt';

/**
 * Parse messages acknowledgment by schema
 * msgs_ack#62d6b459 msg_ids:Vector long = MsgsAck;
 * @param buffer
 * @returns {{ type: number, msgIds: Array<Number> }}
 */
export default function loadMsgsAck(buffer) {
  const constructor = (new Uint32Array(buffer, 0, 1))[0];
  const msgIds = loadVector(loadBigInt, buffer.slice(4));
  return {
    msgIds,
    type: constructor,
  };
}
