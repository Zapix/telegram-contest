/**
 * @param {ArrayBuffer} buffer
 * @returns {boolean}
 */
import { BOOL_TRUE } from '../constants';

export default function loadBool(buffer) {
  return (new Uint32Array(buffer, 0, 1))[0] === BOOL_TRUE;
}
