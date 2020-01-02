/**
 * Parse auth.SentCode with schema v2:
 * auth.sentCode#2215bcbd phone_registered:Bool phone_code_hash:string = auth.SentCode;
 * @param {ArrayBuffer} buffer
 * @returns {{
 *   type: Number,
 *   phoneRegistered: boolean,
 *   phoneCodeHash: string,
 * }}
 */
import { getConstructor } from './utils';
import { BOOL_TRUE } from '../constants';
import * as R from 'ramda';
import { getStringFromArrayBuffer, tlStringToString } from '../tlSerialization';

export default function parseAuthSentCode(buffer) {
  return {
    type: getConstructor(buffer),
    phoneRegistered: new Uint32Array(buffer.slice(4),0,1)[0] == BOOL_TRUE,
    phoneCodeHash: R.pipe(
      getStringFromArrayBuffer,
      R.prop('incomingString'),
      tlStringToString,
    )(buffer.slice(8)),
  };
}