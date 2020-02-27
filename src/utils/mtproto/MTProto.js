import * as R from 'ramda';

import createAuthorizationKey from './createAuthorizationKey';
import seqNoGenerator from './seqNoGenerator';
import { dumps, loads } from './tl';
import encryptMessage from './encryptMessage';
import decryptMessage from './decryptMessage';
import { getMessageId, getNRandomBytes } from './utils';
import sendRequest from './sendRequest';
import { isMessageOf } from './tl/utils';
import {
  HTTP_WAIT_TYPE, MESSAGE_CONTAINER_TYPE, MSGS_ACK_TYPE, TYPE_KEY,
} from './constants';

export const INIT = 'INIT';
export const AUTH_KEY_CREATED = 'AUTH_KEY_CREATED';
export const AUTH_KEY_CREATE_FAILED = 'AUTH_KEY_CREATE_FAILED';

export const STATUS_CHANGED_EVENT = 'statusChanged';

/**
 * Class for working with mtproto protocols
 * Creates base connection on init. allows to send
 */
export default class MTProto extends EventTarget {
  /**
   * Creates authorizationKey for mtproto on object init
   * @param {string} serverUrl - url of data center that will be used
   * @param {{constructors: *, methods: *}} schema - should be used for sending/receiving
   * messages from protocol
   */

  constructor(serverUrl, schema) {
    super();
    this.status = INIT;
    this.serverUrl = serverUrl;
    this.schema = schema;

    this.authKey = null;
    this.authKeyId = null;
    this.serverSalt = null;
    this.genSeqNo = null;
    this.sessionId = null;

    this.rpcPromises = {}; // dict where key is message id and value is resolve and reject functions
    this.acknowledgements = []; // array of message ids that should be send for acknowledgement
  }

  /**
   * Inits connection
   */
  init() {
    createAuthorizationKey()
      .then(({ authKey, authKeyId, serverSalt }) => {
        this.authKey = authKey;
        this.authKeyId = authKeyId;
        this.serverSalt = serverSalt;
        this.genSeqNo = seqNoGenerator();
        this.sessionId = getNRandomBytes(8);

        this.status = AUTH_KEY_CREATED;
        this.fireStatusChange();
      })
      .catch((error) => {
        this.status = AUTH_KEY_CREATE_FAILED;
        this.fireStatusChange(error);
      });
  }

  fireStatusChange(error) {
    const event = new Event(STATUS_CHANGED_EVENT);
    event.status = this.status;
    event.error = error;
    this.dispatchEvent(event);
  }

  getSeqNo() {
    return this.genSeqNo.next().value;
  }

  /**
   * Sending message to telegram server. if message is http wait don't store message promise in
   * rpcPromises map, just return them. Checks have we got acknowledgements and if yest send request
   * with them
   * @param {*} message
   * @returns {Promise} - promise with handling request
   */
  request(message) {
    if (this.status !== 'AUTH_KEY_CREATED') {
      return Promise.reject(new Error('Auth key has not been created'));
    }

    const buffer = dumps(this.schema, message);

    if (buffer.byteLength === 0) {
      return Promise.reject(new Error('empty array buffer of message'));
    }

    if (this.acknowledgements.length > 0) {
      return this.sendRequestWithAcknowledgements(message);
    }
    return this.sendRequestOnly(message);
  }

  sendRequestOnly(message) {
    return new Promise((resolve, reject) => {
      const seqNo = this.getSeqNo();
      const messageId = getMessageId();

      const encrypt = R.partial(
        encryptMessage,
        [this.authKey, this.authKeyId, this.serverSalt, this.sessionId, seqNo, messageId],
      );

      const decrypt = R.partial(
        decryptMessage,
        [this.authKey, this.authKeyId, this.serverSalt, this.sessionId],
      );

      const sendEncryptedRequest = R.pipe(
        R.partial(dumps, [this.schema]),
        encrypt,
        sendRequest,
      );

      const promise = sendEncryptedRequest(message)
        .then((response) => response.arrayBuffer())
        .then(decrypt)
        .then(R.partial(loads, [this.schema]))
        .then(this.handleResponse.bind(this));

      if (isMessageOf(HTTP_WAIT_TYPE, message)) {
        promise.then(resolve).catch(reject);
      } else {
        this.rpcPromises[messageId] = { resolve, reject };
      }
    });
  }

  sendRequestWithAcknowledgements(message) {
    return new Promise((resolve, reject) => {
      const messageId = getMessageId();
      const seqNo = this.getSeqNo();

      const ackMessage = this.buildAcknowledgementMessage();
      const ackMsgId = getMessageId();
      const ackSeqNo = this.getSeqNo();

      const containerMessage = {
        [TYPE_KEY]: MESSAGE_CONTAINER_TYPE,
        messages: [
          {
            seqNo,
            msgId: messageId,
            body: message,
          },
          {
            seqNo: ackSeqNo,
            msgId: ackMsgId,
            body: ackMessage,
          },
        ],
      };
      const containerMessageId = getMessageId();
      const containerSeqNo = this.getSeqNo();

      const encrypt = R.partial(
        encryptMessage,
        [
          this.authKey,
          this.authKeyId,
          this.serverSalt,
          this.sessionId,
          containerSeqNo,
          containerMessageId,
        ],
      );

      const decrypt = R.partial(
        decryptMessage,
        [this.authKey, this.authKeyId, this.serverSalt, this.sessionId],
      );

      const sendEncryptedRequest = R.pipe(
        R.partial(dumps, [this.schema]),
        encrypt,
        sendRequest,
      );

      const promise = sendEncryptedRequest(containerMessage)
        .then((response) => response.arrayBuffer())
        .then(decrypt)
        .then(R.partial(loads, [this.schema]))
        .then(this.handleResponse.bind(this));

      if (isMessageOf(HTTP_WAIT_TYPE, message)) {
        promise.then(resolve).catch(reject);
      } else {
        this.rpcPromises[messageId] = { resolve, reject };
      }
    });
  }

  handleResponse(message) {
    console.log(this.serverSalt);
    console.log(message);
    return message;
  }

  buildAcknowledgementMessage() {
    const msg = {
      [TYPE_KEY]: MSGS_ACK_TYPE,
      msgIds: [...this.acknowledgements],
    };
    this.acknowledgements = [];
    return msg;
  }
}
