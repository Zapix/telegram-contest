/**
 * Takes message containers buffer and return list of message buffers for them
 * @param {ArrayBuffer} buffer
 * @param {Function} parseMessage
 * @returns {Array<ArrayBuffer>}
 */
import { getConstructor } from './utils';

export default function parseMessageContainer(buffer, parseMessage) {
  const countArr = new Uint32Array(buffer, 4, 1);
  const count = countArr[0];

  const messages = [];
  let bytesOffset = 8;
  for (let i = 0; i < count; i += 1) {
    const msgId = (new BigUint64Array(buffer.slice(bytesOffset), 0, 1))[0];
    bytesOffset += 8;
    const seqNo = (new Uint32Array(buffer.slice(bytesOffset), 0, 1))[0];
    bytesOffset += 4;

    const bytesCount = (new Uint32Array(buffer.slice(bytesOffset), 0, 1))[0];
    bytesOffset += 4;
    const messageBuffer = buffer.slice(bytesOffset, bytesOffset + bytesCount);
    messages.push({ msgId, seqNo, message: parseMessage(messageBuffer) });
    bytesOffset += bytesCount;
  }

  return {
    messages,
    type: getConstructor(buffer),
  };
}
