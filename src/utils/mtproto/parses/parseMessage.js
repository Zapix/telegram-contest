import * as R from 'ramda';
import {
  isPong,
  isNewSessionCreated,
} from './utils';

import parsePong from './parsePong';
import parseNewSessionCreated from './parseNewSessionCreated';

/**
 * Writes warning message into console and returns null
 * @param {ArrayBuffer} buffer;
 * @returns {null}
 */
const parseUnexpectedMessage = R.pipe(
  (x) => new Uint32Array(x, 0, 1),
  R.nth(0),
  (x) => x.toString(16),
  (x) => {
    console.warn(`Unexpected message ${x}`);
  },
  R.always(null),
);

/**
 * Takes array buffer of encoded message and returns message as parsed object or
 * list of parsed objects
 * @param {ArrayBuffer} buffer
 * @returns {Array<*> | *}
 */
const parseMessage = R.cond([
  [isPong, parsePong],
  [isNewSessionCreated, parseNewSessionCreated],
  [R.T, parseUnexpectedMessage],
]);

export default parseMessage;
