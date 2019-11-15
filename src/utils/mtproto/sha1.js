import * as R from 'ramda';
import forge from 'node-forge';
import { arrayBufferToForgeBuffer } from './utils';

/**
 * Returns
 * @param {ArrayBuffer|forge.util.ByteBuffer} data
 * @returns {*}
 */
export default function sha1(data) {
  const md = forge.md.sha1.create();

  if (R.is(forge.util.ByteBuffer, data)) {
    md.update(data.bytes());
  } else if (R.is(ArrayBuffer, data)) {
    const hashableBuffer = arrayBufferToForgeBuffer(data);
    md.update(hashableBuffer.bytes());
  }
  return md.digest();
}
