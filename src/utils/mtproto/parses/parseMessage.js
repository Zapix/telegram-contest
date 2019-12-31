import * as R from 'ramda';

import { numberToHex, dumpArrayBuffer } from '../utils';

import {
  isPong,
  isNewSessionCreated,
  isMessageContainer,
  isBadMsgNotification,
  isMsgsAck,
  getConstructor,
} from './utils';
import parsePong from './parsePong';
import parseNewSessionCreated from './parseNewSessionCreated';
import parseMessageContainer from './parseMessageContainer';
import parseBadMsgNotification from './parseBadMsgNotification';
import parseMsgsAck from './parseMsgsAck';

/**
 * Writes warning message into console and returns null
 * @param {ArrayBuffer} buffer;
 * @returns {null}
 */
const parseUnexpectedMessage = R.pipe(
  R.of,
  R.ap([
    R.pipe(getConstructor, numberToHex),
    dumpArrayBuffer,
  ]),
  (x) => {
    console.warn(`Unexpected message constructor: ${x[0]}`);
    console.warn(x[1]);
  },
  R.always(null),
);

/**
 * Takes array buffer of encoded message and returns message as parsed object or
 * list of parsed objects
 * @param {ArrayBuffer} buffer
 * @returns {Array<*> | *}
 */
const parsePlainMessage = R.cond([
  [isPong, parsePong],
  [isNewSessionCreated, parseNewSessionCreated],
  [isBadMsgNotification, parseBadMsgNotification],
  [isMsgsAck, parseMsgsAck],
  [R.T, parseUnexpectedMessage],
]);

/**
 * Allow to parse messageContainers
 * @param {ArrayBuffer} buffer
 * @returns {Array<*> | *}
 */
const parseMessage = R.cond([
  [isMessageContainer, R.pipe(parseMessageContainer, R.map(parsePlainMessage))],
  [R.T, parsePlainMessage],
]);

export default parseMessage;
