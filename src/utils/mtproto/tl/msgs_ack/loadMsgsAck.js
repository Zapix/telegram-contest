import { loadVector } from '../vector';
import { loadBigInt } from '../bigInt';
import { MSGS_ACK_TYPE, TYPE_KEY } from '../../constants';

/**
 * Parse messages acknowledgment by schema
 * msgs_ack#62d6b459 msg_ids:Vector long = MsgsAck;
 * @param buffer
 * @returns {{ type: number, msgIds: Array<Number> }}
 */
export default function loadMsgsAck(buffer) {
  const msgIds = loadVector(loadBigInt, buffer.slice(4));

  return {
    [TYPE_KEY]: MSGS_ACK_TYPE,
    msgIds,
  };
}
