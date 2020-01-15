import * as R from 'ramda';
import {
  AUTH_SENT_CODE,
  BAD_MSG_NOTIFICATION,
  BAD_SERVER_SALT,
  MESSAGE_CONTAINER,
  MSG_DETAILED_INFO,
  MSG_NEW_DETAILED_INFO,
  MSG_RESEND_ANS_REQ,
  MSG_RESEND_REQ,
  MSGS_ACK,
  MSGS_ALL_INFO,
  MSGS_STATE_INFO,
  MSGS_STATE_REQ,
  NEW_SESSION_CREATED,
  PONG,
  RPC_DROP_ANSWER,
  RPC_ANSWER_UNKNOWN,
  RPC_ERROR,
  RPC_RESULT,
  RPC_ANSWER_DROPPED_RUNNING,
  RPC_ANSWER_DROPPED,
  VECTOR,
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

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMsgNewDetailedInfo = R.pipe(
  getConstructor,
  R.equals(MSG_NEW_DETAILED_INFO),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMsgResendReq = R.pipe(
  getConstructor,
  R.equals(MSG_RESEND_REQ),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isMsgResendAnsReq = R.pipe(
  getConstructor,
  R.equals(MSG_RESEND_ANS_REQ),
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
export const isRpcError = R.pipe(
  getConstructor,
  R.equals(RPC_ERROR),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isRpcDropAnswer = R.pipe(
  getConstructor,
  R.equals(RPC_DROP_ANSWER),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isRpcAnswerUnknown = R.pipe(
  getConstructor,
  R.equals(RPC_ANSWER_UNKNOWN),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isRpcAnswerDroppedRunning = R.pipe(
  getConstructor,
  R.equals(RPC_ANSWER_DROPPED_RUNNING),
);

/**
 * @param {ArrayBuffer} - message buffer
 * @returns {boolean}
 */
export const isRpcAnswerDropped = R.pipe(
  getConstructor,
  R.equals(RPC_ANSWER_DROPPED),
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
  value: func(x),
  offset,
});

/**
 * Computes offset of whole message
 * @param {Array<{ offset: Number }>} - list of loaded data
 * @returns {Number} - offset of whole message
 */
export const computeOffset = R.pipe(
  R.ap([R.prop('offset')]),
  R.sum,
);
