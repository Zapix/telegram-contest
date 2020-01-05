import * as R from 'ramda';

import { numberToHex, dumpArrayBuffer } from '../utils';

import {
  isPong,
  isNewSessionCreated,
  isMessageContainer,
  isBadMsgNotification,
  isMsgsAck,
  getConstructor,
  isAuthSentCode,
  isRpcResult,
} from './utils';
import loadPong from './loadPong';
import loadNewSessionCreated from './loadNewSessionCreated';
import loadMessageContainer from './loadMessageContainer';
import loadBadMsgNotification from './loadBadMsgNotification';
import loadMsgsAck from './loadMsgsAck';
import loadAuthSentCode from './loadAuthSentCode';
import loadRpcResult from './loadRpcResult';

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
function parsePlainMessage(buffer) {
  return R.cond([
    [isPong, loadPong],
    [isNewSessionCreated, loadNewSessionCreated],
    [isBadMsgNotification, loadBadMsgNotification],
    [isMsgsAck, loadMsgsAck],
    [isAuthSentCode, loadAuthSentCode],
    [isRpcResult, R.partialRight(loadRpcResult, [parsePlainMessage])],
    [R.T, parseUnexpectedMessage],
  ])(buffer);
}

/**
 * Allow to parse messageContainers
 * @param {ArrayBuffer} buffer
 * @returns {Array<*> | *}
 */
const loadMessage = R.cond([
  [isMessageContainer, R.partialRight(loadMessageContainer, [parsePlainMessage])],
  [R.T, parsePlainMessage],
]);

export default loadMessage;