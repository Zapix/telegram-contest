import * as R from 'ramda';

import {
  arrayBufferToForgeBuffer,
  copyBuffer,
  copyBytes,
  debug,
  forgeBufferToArrayBuffer,
  getMessageId,
  uint8ToArrayBuffer,
} from './utils';
import wrapMessage from './wrapMessage';
import addSessionInfo from './addSessionInfo';
import getMsgKey from './getMsgKey';
import generateKeyIv from './generateKeyIv';
import { encryptIge as encryptAesIge, } from './aes';
import padBytes from './padBytes';

const uint8toForgeBuffer = R.pipe(
  uint8ToArrayBuffer,
  arrayBufferToForgeBuffer
);

const encrypt = R.pipe(
  R.unapply(R.map(uint8toForgeBuffer)),
  R.apply(encryptAesIge),
  forgeBufferToArrayBuffer,
);

export default function encryptMessage(authKey, authKeyId, salt, sessionId, messageBuffer) {
  const messageId = getMessageId();

  const messageWithHeaders = R.pipe(
    R.partial(wrapMessage, [authKeyId, messageId]),
    R.prop('buffer'),
    R.partial(addSessionInfo, [salt, sessionId, messageId]),
  )(messageBuffer);

  const paddedBuffer = padBytes(messageWithHeaders.buffer);
  const padded = new Uint8Array(paddedBuffer);
  const messageKey = getMsgKey(R.slice(88, 88 + 32, authKey), padded);

  const { key, iv } = generateKeyIv(authKey, messageKey);
  const encryptedBuffer = encrypt(padded, key, iv);
  console.log(encryptedBuffer);

  // add headers to encrypted message
  const encryptedMessageBuffer = new ArrayBuffer(24 + encryptedBuffer.byteLength);
  const authKeyIdBytes = new Uint8Array(encryptedMessageBuffer, 0, 8);
  copyBytes(authKeyId, authKeyIdBytes);
  const messageKeyBytes = new Uint8Array(encryptedMessageBuffer, 8, 16);
  copyBytes(messageKey, messageKeyBytes);
  copyBuffer(encryptedBuffer, encryptedMessageBuffer, 24);

  return encryptedMessageBuffer;
}