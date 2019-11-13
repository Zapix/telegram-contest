import * as R from 'ramda';
import forge from 'node-forge';

import {
  PQ_INNER_DATA,
  REQ_PQ,
  REQ_DH_PARAMS,
  SERVER_DH_PARAMS_FAIL,
  SERVER_DH_INNER_DATA,
  CLIENT_DH_INNER_DATA,
  SET_CLIENT_DH_PARAMS,
  DH_GEN_OK,
  DH_GEN_FAIL,
  DH_GEN_RETRY,
} from './constants';
import {
  bigIntToUint8Array,
  findPrimeFactors,
  getMessageId,
  getRandomInt,
  uint8ToBigInt,
  arrayBufferToForgeBuffer,
  forgeBufferToArrayBuffer,
  copyBytes,
  getNRandomBytes,
  generateKeyDataFromNonce,
  pow, hexToUint8Array,
} from './utils';
import { fromTlString, getStringFromArrayBuffer, toTlString } from './tlSerialization';
import { getPublicKey } from './pems';
import { decryptIge as decryptAesIge, encryptIge as encryptAesIge } from './aes';
import sha1 from './sha1';

/**
 * Generates message for p q authorization
 * @returns {Object}
 */
export function getInitialDHExchangeMessage() {
  const initMessage = new ArrayBuffer(40);

  const auth_key_id = new BigUint64Array(initMessage, 0, 1);
  auth_key_id[0] = BigInt(0);

  const message_id = new BigUint64Array(initMessage, 8,1);
  message_id[0] = getMessageId();

  const message_length = new Uint32Array(initMessage, 16, 1);
  message_length[0] = 20;

  const constructor = new Uint32Array(initMessage, 20, 1);
  constructor[0] = REQ_PQ;

  const nonce = new Uint8Array(initMessage, 24, 16);

  for (let i=0; i < nonce.length; i++) {
    nonce[i] = getRandomInt(256);
  }

  return {
    auth_key_id,
    message_id,
    message_length,
    constructor,
    nonce,
    buffer: initMessage
  };
}

/**
 * Parse response PQ from schema:
 * resPQ#05162463 nonce:int128 server_nonce:int128 pq:string server_public_key_fingerprints:Vector long = ResPQ;
 * @param {ArrayBuffer} resPQ - buffer with server pq response
 * @returns {Object} - resPQ with with response
 */
export function parseResponsePQ(resPQ) {
  const auth_key_id = new BigUint64Array(resPQ, 0, 1);
  const message_id = new BigUint64Array(resPQ, 8, 1);
  const message_length = new Uint32Array(resPQ, 16, 1);
  const constructor = new Uint32Array(resPQ, 20, 1);
  const nonce = new Uint8Array(resPQ, 24, 16);
  const server_nonce = new Uint8Array(resPQ, 40, 16);
  const pq = new Uint8Array(resPQ, 57, 8);
  const vector_long = new Uint8Array(resPQ, 68, 4);
  const count = new Uint32Array(resPQ, 72,1);
  const fingerprint = new Uint8Array(resPQ, 76, 8);
  const fingerprint_buffer = resPQ.slice(76,84);

  return {
    auth_key_id,
    message_id,
    message_length,
    constructor,
    nonce,
    server_nonce,
    pq,
    vector_long,
    count,
    fingerprint,
    fingerprint_buffer,
    buffer: resPQ,
  };
}

/**
 * Checks that nonce of init message and response are equal
 * @param {Object} initDHMessage
 * @param {Object} responsePQ
 */
export function areNonceEqual(aMessage, bMessage, nonce_field) {
  if (!nonce_field) {
    nonce_field = 'nonce'
  }

  const aNonce = R.prop(nonce_field, aMessage);
  const bNonce  = R.prop(nonce_field, bMessage);
  for(let i = 0; i < aNonce.length; i += 1) {
    if (aNonce[i] !== bNonce[i]) {
      return false;
    }
  }
  return true;
}

export function buildPQInnerData(responsePQ) {
  const innerPQ = new ArrayBuffer(96);

  const constructor = new Uint32Array(innerPQ, 0, 1);
  constructor[0] = PQ_INNER_DATA;

  const pq = new Uint8Array(innerPQ, 4, 12);

  pq[0] = responsePQ.pq.length;
  for (let i = 0; i < responsePQ.pq.length; i++) {
    pq[i + 1] = responsePQ.pq[i];
  }

  const pq_value = uint8ToBigInt(responsePQ.pq);
  const [p_value, q_value] = findPrimeFactors(pq_value);
  const p_array = bigIntToUint8Array(p_value);
  const p = new Uint8Array(innerPQ, 16, 8);
  p[0] = p_array.length;
  for (let i=0; i < p_array.length; i += 1) p[i+1] = p_array[i];

  const q_array = bigIntToUint8Array(q_value);
  const q = new Uint8Array(innerPQ, 24, 8);
  q[0] = q_array.length;
  for (let i=0; i < q_array.length; i += 1) q[i+1] = q_array[i];

  const nonce = new Uint8Array(innerPQ, 32, 16);
  for (let i=0; i < responsePQ.nonce.length; i += 1) nonce[i] = responsePQ.nonce[i];

  const server_nonce = new Uint8Array(innerPQ, 48, 16);
  for (let i=0; i < responsePQ.server_nonce.length; i += 1) {
    server_nonce[i] = responsePQ.server_nonce[i];
  }

  const new_nonce = new Uint8Array(innerPQ, 64, 32);
  for (let i=0; i < 32; i += 1) new_nonce[i] = getRandomInt(256);

  return {
    constructor,
    pq,
    p,
    q,
    nonce,
    server_nonce,
    new_nonce,
    buffer: innerPQ
  };
}

export function encryptPQInner(responsePQ, pqInnerData) {
  const forgePQInnerBuffer = arrayBufferToForgeBuffer(pqInnerData.buffer);
  const hash = sha1(forgePQInnerBuffer);
  const randomBytesCount = 255 - (hash.data.length + forgePQInnerBuffer.data.length);
  const randomBytes = R.pipe(
    R.curry(getNRandomBytes),
    x => R.apply(String.fromCharCode, x),
    x => forge.util.createBuffer(x),
  )(randomBytesCount);

  const encryptMessage = R.pipe(
    R.map(R.prop('data')),
    R.join('')
  )([hash, forgePQInnerBuffer, randomBytes]);

  // reverse fingerprint
  const fingerprint = responsePQ.fingerprint.map(x => x).reverse();
  const pubKey = getPublicKey(fingerprint);
  const encryptedData = pubKey.encrypt(encryptMessage, 'RAW');
  const encryptedDataBuffer = forge.util.createBuffer(encryptedData);
  const encryptedArrayBuffer = forgeBufferToArrayBuffer(encryptedDataBuffer);

  return {
    encryptedData,
    buffer: encryptedArrayBuffer,
  }
}


/**
 *
 * @param {Object} innerPQ - object with inner pq data
 * @param {Object} encryptedBuffer - object with encrypted inner pq data
 */
export function buildDHExchangeMessage(responsePQ, innerPQ, encryptedBuffer) {
  const messageBuffer = new ArrayBuffer(340);

  const auth_key_id = new BigUint64Array(messageBuffer, 0, 1);
  auth_key_id[0] = BigInt(0);

  const message_id = new BigUint64Array(messageBuffer, 8,1);
  message_id[0] = getMessageId();

  const message_length = new Uint32Array(messageBuffer, 16, 1);
  message_length[0] = 320;

  const constructor = new Uint32Array(messageBuffer, 20, 1);
  constructor[0] = REQ_DH_PARAMS;

  const nonce = new Uint8Array(messageBuffer, 24, 16);
  copyBytes(innerPQ.nonce, nonce);

  const server_nonce = new Uint8Array(messageBuffer, 40, 16);
  copyBytes(responsePQ.server_nonce, server_nonce);

  const p = new Uint8Array(messageBuffer, 56, 8);
  copyBytes(innerPQ.p, p);

  const q = new Uint8Array(messageBuffer, 64, 8);
  copyBytes(innerPQ.q, q);

  const fingerprint = new Uint8Array(messageBuffer, 72, 8);
  copyBytes(responsePQ.fingerprint, fingerprint);

  const big_len_id = new Uint8Array(messageBuffer, 80, 4);
  big_len_id[0] = 254;
  big_len_id[1] = 0;
  big_len_id[2] = 1;

  const bufferArray = new Uint8Array(encryptedBuffer.buffer);
  const encrypted_data = new Uint8Array(messageBuffer, 84, 256);
  copyBytes(bufferArray, encrypted_data);

  return {
    auth_key_id,
    message_id,
    message_length,
    operation: constructor,
    nonce,
    server_nonce,
    p,
    q,
    fingerprint,
    encrypted_data,
    buffer: messageBuffer,
  };
}

/**
 * Parses response with servers DH params exchange.
 * Raises error if response has got SERVER_DH_PARAMS_FAIL constructor
 * @param {ArrayBuffer} buffer - dh response as ArrayBuffer
 * @return {Object} - object with encrypted data
 */
export function parseDHParamsResponse(buffer) {
  const auth_key_id = new BigUint64Array(buffer, 0, 1);
  const message_id = new BigUint64Array(buffer, 8,1);
  const message_length = new Uint32Array(buffer, 16, 1);
  const operation = new Uint32Array(buffer, 20, 1);

  if (operation[0] === SERVER_DH_PARAMS_FAIL) {
    const message = 'Server dh params receive failed';
    console.error(message);
    const error = new Error(message);
    throw error;
  }
  console.log('Server dh param received');

  const nonce = new Uint8Array(buffer, 24, 16);
  const server_nonce = new Uint8Array(buffer, 40, 16);
  const encrypted_answer_tl = new Uint8Array(buffer, 56);
  const encrypted_answer = fromTlString(encrypted_answer_tl);

  return {
    auth_key_id,
    message_id,
    message_length,
    nonce,
    server_nonce,
    encrypted_answer_tl,
    encrypted_answer,
    buffer,
  };
}

/**
 * Parses dh params with data from encoded buffer
 * @param {ArrayBuffer} buffer
 * @returns {Object}
 */
function parseDHParams(buffer) {
  const constructor = new Uint32Array(buffer, 0, 1);
  if (constructor[0] !== SERVER_DH_INNER_DATA) {
    const message = 'Decryption error';
    console.error(message);
    throw new Error(message);
  }
  console.log(`Decrypted size: ${buffer.byteLength}`);

  const nonce = new Uint8Array(buffer, 4, 16);
  const server_nonce = new Uint8Array(buffer, 20, 16);
  const g = new Uint32Array(buffer, 36, 1);

  const {
    offset: dhPrimeOffset,
    incomingString: dh_prime,
  } = getStringFromArrayBuffer(buffer, 40);

  const {
    offset: gaOffset,
    incomingString: ga,
  } = getStringFromArrayBuffer(buffer, dhPrimeOffset);

  const serverTime = new Uint32Array(buffer, gaOffset, 1);

  return {
    constructor,
    nonce,
    server_nonce,
    g,
    dh_prime,
    ga,
    serverTime
  };
}

/**
 * Decryptes inner data of dh params and build object for them
 * @param encryptedDHParams
 * @param pqInnerData
 * @returns {{}}
 */
export function decryptDHParams(encryptedDHParams, pqInnerData) {
  console.log('Decrypt DH Params');
  const { key, iv } = generateKeyDataFromNonce(
    encryptedDHParams.server_nonce,
    pqInnerData.new_nonce
  );

  const encryptedAnswerBuffer = forge.util.createBuffer();
  for (let i=0; i < encryptedDHParams.encrypted_answer.length; i += 1) {
    encryptedAnswerBuffer.putByte(encryptedDHParams.encrypted_answer[i]);
  }

  const answerForgeBuffer = decryptAesIge(encryptedAnswerBuffer, key, iv);
  const answerBuffer = forgeBufferToArrayBuffer(answerForgeBuffer);
  const answerWithoutHash = answerBuffer.slice(20);

  return {
    key,
    iv,
    ...parseDHParams(answerWithoutHash)
  };
}

/**
 * Takes decrypted dhParams and builds gab, ga values
 * @param dhParams
 */
export function dhComputation(dhParams) {
  const b = uint8ToBigInt(getNRandomBytes(256));

  const ga = uint8ToBigInt(dhParams.ga);
  const g = BigInt(dhParams.g[0]);
  const dh_prime = uint8ToBigInt(dhParams.dh_prime);

  const gb = pow(g, b, dh_prime);
  const gab = pow(ga, b, dh_prime);

  return { b, g, ga, gb, gab };
}

/**
 * Builds inner message for client DH data
 * @param {Object} encryptedDHParams - encrypted values of server dh
 * @param {Object} dhValues - computed dhValues
 * @returns {Object}
 */
export function buildDHInnerMessage(encryptedDHParams, dhValues) {
  const gbArray = toTlString(bigIntToUint8Array(dhValues.gb));

  const bytesLength = 4 + 16 + 16 + 8 + gbArray.length;
  const buffer = new ArrayBuffer(bytesLength);

  const constructor = new Uint32Array(buffer, 0, 1);
  constructor[0] = CLIENT_DH_INNER_DATA;

  const nonce = new Uint8Array(buffer, 4, 16);
  copyBytes(encryptedDHParams.nonce, nonce);

  const server_nonce = new Uint8Array(buffer, 20, 16);
  copyBytes(encryptedDHParams.server_nonce, server_nonce);

  const retry_id = new Uint8Array(buffer, 36, 8);
  retry_id[0] = 0;

  const gb = new Uint8Array(buffer, 44);
  copyBytes(gbArray, gb);

  return {
    constructor,
    nonce,
    server_nonce,
    retry_id,
    gb,
    buffer
  };
}

/**
 * Encrypts messsage with key and iv values
 * @param {Object} dhInnerMessage
 * @param {forge.util.ByteBuffer} key
 * @param {forge.util.ByteBuffer} iv
 * @returns enc
 */
export function encryptInnerMessage(dhInnerMessage, key, iv) {
  const innerHash = sha1(dhInnerMessage.buffer);
  const innerHashBytes = hexToUint8Array(innerHash.toHex());
  const dataWithHashLength = innerHashBytes.length + dhInnerMessage.buffer.byteLength;
  const randomDataLength = (16 - (dataWithHashLength % 16)) % 16;

  const dataWithHashBuffer = new ArrayBuffer(dataWithHashLength + randomDataLength);
  const hashBytes = new Uint8Array(dataWithHashBuffer, 0, innerHashBytes.length);
  copyBytes(innerHashBytes, hashBytes);

  const dhInnerMessageBytes = new Uint8Array(dhInnerMessage.buffer);
  const messageBytes = new Uint8Array(
    dataWithHashBuffer,
    innerHashBytes.length,
    dhInnerMessageBytes.length
  );
  copyBytes(dhInnerMessageBytes, messageBytes);

  const randomBytes = getNRandomBytes(randomDataLength);
  const randomMessageBytes = new Uint8Array(dataWithHashBuffer, dataWithHashLength);
  copyBytes(randomBytes, randomMessageBytes);

  const dataWithHashForgeBuffer = arrayBufferToForgeBuffer(dataWithHashBuffer);
  const encryptedMessageForgeBuffer = encryptAesIge(dataWithHashForgeBuffer, key, iv);
  const encryptedMessageBuffer = forgeBufferToArrayBuffer(encryptedMessageForgeBuffer);

  return {
    encryptedMessage: new Uint8Array(encryptedMessageBuffer),
    buffer: encryptedMessageBuffer,
  };
}

export function buildSetClientDhParamsMessage(encodedMessage, dhParams) {
  const buffer = new ArrayBuffer(396);

  const auth_key_id = new BigUint64Array(buffer, 0, 1);
  auth_key_id[0] = BigInt(0);

  const message_id = new BigUint64Array(buffer, 8,1);
  message_id[0] = getMessageId();

  const message_length = new Uint32Array(buffer, 16, 1);
  message_length[0] = 376;

  const constructor = new Uint32Array(buffer, 20, 1);
  constructor[0] = SET_CLIENT_DH_PARAMS;

  const nonce = new Uint8Array(buffer, 24, 16);
  copyBytes(dhParams.nonce, nonce);

  const server_nonce = new Uint8Array(buffer, 40, 16);
  copyBytes(dhParams.server_nonce, server_nonce);

  const encryptedTlString = toTlString(encodedMessage.encryptedMessage);
  const encryptedMessageData = new Uint8Array(buffer, 56);
  copyBytes(encryptedTlString, encryptedMessageData);

  return {
    buffer,
    auth_key_id,
    message_id,
    message_length,
    constructor,
    nonce,
    server_nonce,
    encryptedMessage: encodedMessage.encryptedMessage,
    encryptedMessageTlString: encryptedTlString,
  }
}

export function parseDHVerifyResopnse(buffer) {
  const auth_key_id = new BigUint64Array(buffer, 0, 1);
  const message_id = new BigUint64Array(buffer, 8, 1);
  const message_length = new Uint32Array(buffer, 16, 1);
  const constructor = new Uint32Array(buffer, 20, 1);
  const nonce = new Uint8Array(buffer, 24, 16);
  const server_nonce = new Uint8Array(buffer, 40, 16);
  const new_nonce = new Uint8Array(buffer, 56, 16);

  return {
    auth_key_id,
    message_id,
    message_length,
    constructor,
    nonce,
    server_nonce,
    new_nonce
  };
}

export function checkDHVerifyResponse({ constructor }) {
  if (constructor[0] === DH_GEN_FAIL) {
    const errorMessage = 'DH generation failed';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (constructor[0] === DH_GEN_RETRY) {
    const errorMessage = 'DH generation need to be retried';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (constructor[0] !== DH_GEN_OK) {
    const errorMessage = 'Unexpected DH generation error';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  console.log('DH generation successfully finished');
}

function buildAuthKeyHash(authKey) {
  const authKeyBuffer = new ArrayBuffer(authKey.length);
  const authKeyBufferBytes = new Uint8Array(authKeyBuffer);
  copyBytes(authKey, authKeyBufferBytes);
  const authKeySha1 = sha1(authKeyBuffer);

  return R.pipe(
    sha1,
    x => x.toHex(),
    hexToUint8Array,
    R.reverse,
    R.take(8)
  )(authKeyBuffer);
}

export default function createAuthorizationKey() {
  const initDHMessage = getInitialDHExchangeMessage();

  return Promise.race([
    fetch(
      'http://149.154.167.40/apiw',
      {
        method: 'POST',
        mode: 'cors',
        body: initDHMessage.buffer,
      },
    )
      .then(response => response.arrayBuffer())
      .then(buffer => {
        console.log('Parse response PQ');

        const responsePQ = parseResponsePQ(buffer);
        if (!areNonceEqual(initDHMessage, responsePQ)) {
          throw Error("Nonce are not equal");
        }

        const pqInnerData = buildPQInnerData(responsePQ);
        const encryptedData = encryptPQInner(responsePQ, pqInnerData);

        const exchangeMessage = buildDHExchangeMessage(responsePQ, pqInnerData, encryptedData);

        return Promise.all([
          fetch(
            'http://149.154.167.40/apiw',
            {
              method: 'POST',
              mode: 'cors',
              body: exchangeMessage.buffer,
            },
          ).then((response) => response.arrayBuffer()),
          new Promise((resolve) => resolve(pqInnerData)),
        ]);
      })
      .then(([buffer, pqInnerData]) => {
        const encryptedDHParams = parseDHParamsResponse(buffer);
        if (
          !areNonceEqual(encryptedDHParams, pqInnerData) ||
          !areNonceEqual(encryptedDHParams, pqInnerData, 'server_nonce')
        ) {
          throw Error("Nonce are not equal");
        }
        const dhParams = decryptDHParams(encryptedDHParams, pqInnerData);
        const dhValues = dhComputation(dhParams);
        const dhInnerMessage = buildDHInnerMessage(dhParams, dhValues);
        const encryptedMessage = encryptInnerMessage(dhInnerMessage, dhParams.key, dhParams.iv);
        const setClientDHParamsMessage = buildSetClientDhParamsMessage(encryptedMessage, dhParams);
        return Promise.all([
          fetch(
            'http://149.154.167.40/apiw',
            {
              method: 'POST',
              mode: 'cors',
              body: setClientDHParamsMessage.buffer,
            }
          ).then((response) => response.arrayBuffer()),
          Promise.resolve(dhValues),
        ]);
      })
      .then(([responseBuffer, dhValues]) => {
        const verifyResponse = parseDHVerifyResopnse(responseBuffer);
        checkDHVerifyResponse(verifyResponse);
        const authKey = bigIntToUint8Array(dhValues.gab);
        const authKeyHash = buildAuthKeyHash(authKey);

        return { authKey, authKeyHash };
      }),
    new Promise((resolve, reject) => setTimeout(reject, 120 * 100))
      .then(() => {
        console.log('request is too long');
      })
  ]);

}