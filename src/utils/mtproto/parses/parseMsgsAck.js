import * as R from 'ramda';

import parseVector from './parseVector';

/**
 * Parse messages acknowledgment by schema
 * msgs_ack#62d6b459 msg_ids:Vector long = MsgsAck;
 * @param buffer
 * @returns {{ type: number, msgIds: Array<Number> }}
 */
export default function parseMsgsAck(buffer) {
  const constructor = (new Uint32Array(buffer, 0, 1))[0];
  const msgIds = R.pipe(
    parseVector,
    R.map(R.pipe(
      (x) => (new BigUint64Array(x)),
      R.nth(0),
    )),
  )(buffer.slice(4));

  return {
    msgIds,
    type: constructor,
  };
}
