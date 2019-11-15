import * as R from 'ramda';

import {
  copyBytes,
  getMessageId,
  copyBuffer,
  arrayBufferToForgeBuffer,
  uint8ToArrayBuffer,
  forgeBufferToArrayBuffer,
  debug,
} from './utils';
import wrapMessage from './wrapMessage';
import addSessionInfo from './addSessionInfo';
import getMsgKey from './getMsgKey';
import generateKeyIv from './generateKeyIv';
import { encryptIge as encryptAesIge } from './aes';

function padBytes(buffer) {
  const length = buffer.byteLength + (16 - (buffer.byteLength % 16)) % 16;
  const paddedBuffer = new ArrayBuffer(length);
  copyBuffer(buffer, paddedBuffer);
  return paddedBuffer;
}

const uint8toForgeBuffer = R.pipe(
  uint8ToArrayBuffer,
  arrayBufferToForgeBuffer
);

const encrypt = R.pipe(
  R.unapply(R.of),
  R.ap([
    R.pipe(R.nth(0), arrayBufferToForgeBuffer),
    R.pipe(R.nth(1), uint8toForgeBuffer),
    R.pipe(R.nth(2), uint8toForgeBuffer),
  ]),
  R.apply(encryptAesIge),
  forgeBufferToArrayBuffer,
);

export function encryptMessage(authKey, autKeyId, salt, sessionId, messageBuffer) {
  const messageId = getMessageId();

  const messageWithHeaders = R.pipe(
    R.partial(wrapMessage, [autKeyId, messageId]),
    R.prop('buffer'),
    R.partial(addSessionInfo, [salt, sessionId, messageId]),
  )(messageBuffer);

  console.log('Message with headers');
  console.log(new Uint8Array(messageWithHeaders.buffer));
  const messageKey = getMsgKey(messageWithHeaders.buffer);
  console.log('Message key:', messageKey);

  const { key, iv } = generateKeyIv(authKey, messageKey);

  const paddedBuffer = padBytes(messageWithHeaders.buffer);
  console.log('Padded message:');
  console.log(new Uint8Array(paddedBuffer));
  const encryptedBuffer = encrypt(paddedBuffer, key, iv);

  // add headers to encrypted message
  const encryptedMessageBuffer = new ArrayBuffer(24 + encryptedBuffer.byteLength);
  const authKeyIdBytes = new Uint8Array(encryptedMessageBuffer, 0, 8);
  copyBytes(autKeyId, authKeyIdBytes);
  const messageKeyBytes = new Uint8Array(encryptedMessageBuffer, 8, 16);
  copyBytes(messageKey, messageKeyBytes);
  copyBuffer(encryptedBuffer, encryptedMessageBuffer, 24);

  return encryptedMessageBuffer;
}