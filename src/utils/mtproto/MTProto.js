import createAuthorizationKey from './createAuthorizationKey';
import seqNoGenerator from './seqNoGenerator';

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
}
