import { REQ_PQ, PQ_INNER_DATA } from './constants';
import { getRandomInt, uint8ToBigInt, findPrimeFactors } from './utils';

/**
 * Generates message for p q authorization
 * @returns {Object}
 */
export function getInitialDHExchangeMessage() {
  const initMessage = new ArrayBuffer(40);

  const auth_key_id = new BigUint64Array(initMessage, 0, 1);
  auth_key_id[0] = BigInt(0);

  const message_id = new BigUint64Array(initMessage, 8,1);
  message_id[0] = BigInt(+Date.now()) * BigInt(Math.pow(2, 32));

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
  for (let i = 0; i < responsePQ.pq.length; i++) {
    pq[i] = responsePQ.pq[i];
  }

  const pq_value = uint8ToBigInt(responsePQ.pq);
  const [p, q] = findPrimeFactors(pq_value);
  console.log(p, p.toString(16));
  console.log(q, q.toString(16));
}