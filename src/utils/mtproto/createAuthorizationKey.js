import * as R from 'ramda';
import forge from 'node-forge';

import { PQ_INNER_DATA, REQ_PQ, REQ_DH_PARAMS } from './constants';
import {
  bigIntToUint8Array,
  findPrimeFactors,
  getMessageId,
  getRandomInt,
  uint8ToBigInt,
  arrayBufferToForgeBuffer,
  forgeBufferToArrayBuffer,
  copyBytes,
  uint8ArrayToHex,
  getNRandomBytes,
  debug,
} from './utils';
import { getPublicKey } from './pems';

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

  const req_pq = new Uint32Array(initMessage, 20, 1);
  req_pq[0] = REQ_PQ;

  const nonce = new Uint8Array(initMessage, 24, 16);

  for (let i=0; i < nonce.length; i++) {
    nonce[i] = getRandomInt(256);
  }

  return {
    auth_key_id,
    message_id,
    message_length,
    req_pq,
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
  const res_pq = new Uint32Array(resPQ, 20, 1);
  const nonce = new Uint8Array(resPQ, 24, 16);
  const server_nonce = new Uint8Array(resPQ, 40, 16);
  const pq = new Uint8Array(resPQ, 57, 8);
  const vector_long = new Uint8Array(resPQ, 68, 4);
  const count = new Uint32Array(resPQ, 72,1);
  const fingerprint = new Uint8Array(resPQ, 76, 8);
  const fingerprint_buffer = resPQ.slice(76,84);

  console.log(`Finger prints count: ${count[0]}`);
  console.log('Response fingerprint:', uint8ArrayToHex(fingerprint));
  return {
    auth_key_id,
    message_id,
    message_length,
    res_pq,
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
export function areNonceEqual(initDHMessage, responsePQ) {
  for(let i = 0; i < initDHMessage.nonce.length; i += 1) {
    if (initDHMessage.nonce[i] !== responsePQ.nonce[i]) {
      return false;
    }
  }
  return true;
}

export function buildPQInnerData(responsePQ) {
  const innerPQ = new ArrayBuffer(96);

  const inner_pq_data = new Uint32Array(innerPQ, 0, 1);
  inner_pq_data[0] = PQ_INNER_DATA;

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
    inner_pq_data,
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
  const md = forge.md.sha1.create();
  const forgePQInnerBuffer = arrayBufferToForgeBuffer(pqInnerData.buffer);
  md.update(forgePQInnerBuffer.bytes());
  const hash = md.digest();
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
  console.log(encryptMessage);
  console.log(encryptMessage.length);

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

  const operation = new Uint32Array(messageBuffer, 20, 1);
  operation[0] = REQ_DH_PARAMS;

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
    operation,
    nonce,
    server_nonce,
    p,
    q,
    fingerprint,
    encrypted_data,
    buffer: messageBuffer,
  };
}