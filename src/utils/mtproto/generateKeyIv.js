import * as R from 'ramda';

import { copyBytes, forgeBufferToArrayBuffer, debug } from './utils';
import sha1 from './sha1';

const bufferToUint8 = x => new Uint8Array(x);

const hashFunc = R.pipe(
  sha1,
  forgeBufferToArrayBuffer,
);

/**
 * @param {Uint8Array} arr
 */
function buildBuffer(arr) {
  const buffer = new ArrayBuffer(arr.length);
  const bufferBytes = new Uint8Array(buffer);
  copyBytes(arr, bufferBytes);
  return buffer;
}

const getSha1 = R.pipe(
  R.unapply(R.flatten),
  debug,
  buildBuffer,
  hashFunc,
  bufferToUint8,
);

/**
 * Generating key, iv values for aes encoding
 * For algorithm please check
 * https://core.telegram.org/mtproto/description_v1#defining-aes-key-and-initialization-vector
 * @param {Uint8Array} authKey
 * @param {Uint8Array} msgKey
 * @return {{key: Uint8Array, iv: Uint8Array}}
 */
export default function generateKeyIv(authKey, msgKey) {
  const sha1a = getSha1(msgKey, R.slice(0, 32, authKey));
  const sha1b = getSha1(R.slice(32, 48, authKey), msgKey, R.slice(48, 64, authKey));
  const sha1c = getSha1(R.slice(64, 96, authKey), msgKey);
  const sha1d = getSha1(msgKey, R.slice(96, 128, authKey));

  return {
    key: R.flatten([
      R.slice(0, 8, sha1a),
      R.slice(8, 20, sha1b),
      R.slice(4, 16, sha1c),
    ]),
    iv: R.flatten([
      R.slice(8, 20, sha1a),
      R.slice(0, 8, sha1b),
      R.slice(16, 20, sha1c),
      R.slice(0, 8, sha1d),
    ]),
  };
}