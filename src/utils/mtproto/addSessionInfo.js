/**
 * Wraps message buffer with session info
 * @param {Uint8Array} salt
 * @param {BigInt} sessionId
 * @param {BigInt} messageId
 * @param {ArrayBuffer} messageBuffer
 */
import { copyBuffer, copyBytes, uint8ArrayToHex } from './utils';

export default function addSessionInfo(salt, sessionId, messageId, messageBuffer) {
  console.log('Add session info:');
  console.log('Salt: ', salt);
  console.log('Session id: ', sessionId);
  console.log('Message id: ', messageId);
  console.log('-----------------');
  const buffer = new ArrayBuffer(8 + 8 + 8 + 4 + 4 + messageBuffer.byteLength);

  const saltBytes = new Uint8Array(buffer, 0, 8);
  copyBytes(salt, saltBytes);

  const sessionIdBytes = new Uint8Array(buffer, 8, 8);
  copyBytes(sessionId, sessionIdBytes);

  const messageIdBytes = new BigUint64Array(buffer, 16, 1);
  messageIdBytes[0] = messageId;

  const seqNo = new Uint32Array(buffer, 24, 1);
  seqNo[0] = 1;

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
