/**
 * Wraps message buffer with session info
 * @param {Uint8Array} salt
 * @param {BigInt} sessionId
 * @param {BigInt} messageId
 * @param {ArrayBuffer} messageBuffer
 */
import { copyBuffer, copyBytes } from './utils';

export default function addSessionInfo(salt, sessionId, messageId, messageBuffer) {
  const buffer = new ArrayBuffer(8 + 8 + 8 + 4 + 4 + messageBuffer.byteLength);

  const saltBytes = new Uint8Array(buffer, 0, 8);
  copyBytes(salt, saltBytes);

  const sessionIdBytes = new BigUint64Array(buffer, 8, 1);
  sessionIdBytes[0] = sessionId;

  const messageIdBytes = new BigUint64Array(buffer, 16, 1);
  messageIdBytes[0] = messageId;

  const seqNo = new Uint32Array(buffer, 24, 1);
  seqNo[0] = 0;

  const messageLength = new Uint32Array(buffer, 28, 1);
  messageLength[0] = messageBuffer.byteLength;

  copyBuffer(messageBuffer, buffer, 32);

  return {
    buffer,
    salt,
    sessionId,
    messageId,
  };
}
