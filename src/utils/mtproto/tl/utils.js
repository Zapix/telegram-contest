import * as R from 'ramda';
import {
  MESSAGE_CONTAINER,
  PONG,
  NEW_SESSION_CREATED,
  BAD_MSG_NOTIFICATION,
  MSGS_ACK,
  VECTOR,
  RPC_RESULT,
  AUTH_SENT_CODE,
  BAD_SERVER_SALT,
  MSGS_STATE_REQ,
  MSGS_STATE_INFO,
  MSGS_ALL_INFO, MSG_DETAILED_INFO, MSG_NEW_DETAILED_INFO,
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

export const isBadServerSalt = R.pipe(
  getConstructor,
  R.equals(BAD_SERVER_SALT),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMsgsAck = R.pipe(
  getConstructor,
  R.equals(MSGS_ACK),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMsgsStateReq = R.pipe(
  getConstructor,
  R.equals(MSGS_STATE_REQ),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMsgsStateInfo = R.pipe(
  getConstructor,
  R.equals(MSGS_STATE_INFO),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMsgsAllInfo = R.pipe(
  getConstructor,
  R.equals(MSGS_ALL_INFO),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMsgDetailedInfo = R.pipe(
  getConstructor,
  R.equals(MSG_DETAILED_INFO),
);

export const isMsgNewDetailedInfo = R.pipe(
  getConstructor,
  R.equals(MSG_NEW_DETAILED_INFO),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isVector = R.pipe(
  getConstructor,
  R.equals(VECTOR),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isRpcResult = R.pipe(
  getConstructor,
  R.equals(RPC_RESULT),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isAuthSentCode = R.pipe(
  getConstructor,
  R.equals(AUTH_SENT_CODE),
);

export const isWithOffset = R.pipe(
  R.nthArg(1),
  R.equals(true),
);

export const withConstantOffset = (func, offset) => (x) => ({
  offset,
  value: func(x),
});
