/**
 * Takes message containers buffer and return list of message buffers for them
 * @param buffer
 * @returns {Array<ArrayBuffer>}
 */
export default function parseMessageContainer(buffer) {
  const countArr = new Uint32Array(buffer, 4, 1);
  const count = countArr[0];

  const messages = [];
  let bytesOffset = 8;
  for (let i = 0; i < count; i += 1) {
    bytesOffset += 8 + 4; // offset for msgId and seqNo;
    const bytesCount = (new Uint32Array(buffer.slice(bytesOffset), 0, 1))[0];
    bytesOffset += 4;
    const message = buffer.slice(bytesOffset, bytesOffset + bytesCount);
    messages.push(message);
    bytesOffset += bytesCount;
  }

  return messages;
}
