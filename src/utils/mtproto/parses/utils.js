import * as R from 'ramda';
import {
  MESSAGE_CONTAINER,
  PONG,
  NEW_SESSION_CREATED,
  BAD_MSG_NOTIFICATION,
} from '../constants';

/**
 * Gets constructor value from buffer
 * @param {ArrayBuffer} - message buffer
 * @returns {Number} - constructor number
 */
export const getConstructor = R.pipe(
  (x) => new Uint32Array(x, 0, 1),
  R.nth(0),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMessageContainer = R.pipe(
  getConstructor,
  R.equals(MESSAGE_CONTAINER),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isPong = R.pipe(
  getConstructor,
  R.equals(PONG),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isNewSessionCreated = R.pipe(
  getConstructor,
  R.equals(NEW_SESSION_CREATED),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isBadMsgNotification = R.pipe(
  getConstructor,
  R.equals(BAD_MSG_NOTIFICATION),
);
