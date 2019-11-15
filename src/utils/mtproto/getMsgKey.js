import * as R from 'ramda';
import sha1 from './sha1';
import { forgeBufferToArrayBuffer } from './utils';
/**
 * Generates message key from buffer.
 *
 * ATTENTION using MTproto v1 coz it looks simplier for now
 *
 * @param {ArrayBuffer} messageBuffer
 * @returns {Uint8Array} - sha1 of messageBuffer
 */
const getMsgKey = R.pipe(
  sha1,
  forgeBufferToArrayBuffer,
  x => new Uint8Array(x),
  R.slice(4, 20),
);

export default getMsgKey;
