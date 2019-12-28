import * as R from 'ramda';

import { forgeBufferToArrayBuffer, getMessageId, uint8toForgeBuffer, } from './utils';
import wrapMessage from './wrapMessage';
import addSessionInfo from './addSessionInfo';
import getMsgKey from './getMsgKey';
import generateKeyIv from './generateKeyIv';
import { encryptIge as encryptAesIge, } from './aes';
import padBytes from './padBytes';
import addExternalHeader from './addExternalHeader';

const encrypt = R.pipe(
  R.unapply(R.map(uint8toForgeBuffer)),
  R.apply(encryptAesIge),
  forgeBufferToArrayBuffer,
);

export default function encryptMessage(authKey, authKeyId, salt, sessionId, messageBuffer) {
  const messageId = getMessageId();

  const messageWithHeaders = R.pipe(
    // R.partial(wrapMessage, [authKeyId, messageId]),
    // R.prop('buffer'),
    R.partial(addSessionInfo, [salt, sessionId, messageId]),
  )(messageBuffer);

  const paddedBuffer = padBytes(messageWithHeaders.buffer);
  const padded = new Uint8Array(paddedBuffer);
  const messageKey = getMsgKey(R.slice(88, 88 + 32, authKey), padded);

  const { key, iv } = generateKeyIv(authKey, messageKey);
  const encryptedBuffer = encrypt(padded, key, iv);

  return addExternalHeader(authKeyId, messageKey, encryptedBuffer);
}