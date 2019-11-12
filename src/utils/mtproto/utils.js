import * as R from 'ramda';
import random from 'random-bigint';
import forge from 'node-forge';

import { DC_ID, PROTOCOL_ID, TEST_DC_INC } from './constants';

export const debug = (x) => {
  console.log(x);
  return x;
};

export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const getRandomByte =  R.partial(getRandomInt, [256]);

export const getNRandomBytes = R.times(getRandomByte);

const checkFirstByte = R.pipe(
  (buffer) => (new Uint8Array(buffer,0,1))[0],
  R.equals(0xef),
  R.not,
);

const checkFirstInt = R.pipe(
  (buffer) => (new Uint32Array(buffer, 0, 4))[0],
  R.anyPass([
    R.equals(0x44414548),
    R.equals(0x54534f50),
    R.equals(0x20544547),
    R.equals(0x4954504f),
    R.equals(0xdddddddd),
    R.equals(0xeeeeeeee),
  ]),
  R.not,
);

const checkSecondInt = R.pipe(
  (buffer) => (new Uint32Array(buffer, 4, 4))[0],
  R.equals(0x00000000),
  R.not
);

/**
 * Takes ArrayBuffer init payload and return is it valid or not
 * @param {ArrayBuffer} buffer
 * @returns {boolean}
 */
export const isValidInitPayload = R.allPass([
  checkFirstByte,
  checkFirstInt,
  checkSecondInt,
]);


/**
 * Generates init payload for websocket communication. Please check:
 * https://core.telegram.org/mtproto/mtproto-transports#transport-obfuscation
 * @returns {ArrayBuffer}
 */
export function generateFirstInitPayload() {
  const buffer = new ArrayBuffer(64);
  const prefix = new Uint8Array(buffer, 0, 56);
  const protocol = new Uint32Array(buffer, 56, 1);
  const dc = new Int16Array(buffer, 60, 1);
  const postfix = new Uint8Array(buffer, 62, 2);

  while (!isValidInitPayload(buffer)) {
    for (let i=0; i < prefix.length; i++) {
      prefix[i] = getRandomInt(256);
    }
    protocol[0] = PROTOCOL_ID;
    dc[0] = DC_ID + TEST_DC_INC;
    for (let i=0; i < postfix.length; i++) {
      postfix[i] = getRandomInt(256);
    }

  }

  return buffer;
}

/**
 * Builds second init payload by reversing first init payload
 * @param {ArrayBuffer} initPayloadBuffer
 * @returns {ArrayBuffer}
 */
export function buildSecondInitPayload(initPayloadBuffer) {
  const buffer = new ArrayBuffer(initPayloadBuffer.byteLength);

  const firstView = new Uint8Array(initPayloadBuffer);
  const secondView = new Uint8Array(buffer);

  for (let i=0; i < secondView.length; i += 1) {
    secondView[secondView.length-i-1] = firstView[i];
  }

  return buffer;
}

/**
 * Translate value to array of bytes in little-endian order
 * @param {Number} value
 * @returns {Number[]}
 */
export function toLittleEndian(value) {
  const result = [];

  let current = value;

  while (current > 0) {
    result.push(current % 256);
    current = Math.floor(current / 256);
  }
  return result
}

/**
 * Returns true if passed value is a prime value
 * @param {BigInt} p
 * @returns {boolean}
 */
export function isPrime(p) {
  for (let i = BigInt(2); i * i <= p; i++) {
    if (p % i === BigInt(0)) return false;
  }
  return true;
}

export function* primeGenerator() {
  yield BigInt(2);
  const primeResults = [BigInt(2)];

  let i = BigInt(2);
  while (true) {
    let prime = true;
    for (let j = 0; j < primeResults.length; j++) {
      if (i % primeResults[j] === BigInt(0)) {
        prime = false;
        break;
      }
    }
    if (prime) {
      primeResults.push(i);
      yield i;
    }
    i++;
  }
}

function abs_dec(a, b) {
  if (a > b) {
    return a - b;
  }
  return b - a
}

function gcd(a, b) {
  while (b) {
    const tmp = a;
    a = b;
    b = tmp % b;
  }

  return a;
}

function min(a, b) {
  if (a < b) {
    return a;
  }
  return b;
}

function pow(a, b, c) {
  const value = a ** b;
  if (!c) {
    return value;
  }
  return value % c;
}

/**
 * Decompose prime factors takes algorithm form
 * https://github.com/LonamiWebs/Telethon/blob/master/telethon/crypto/factorization.py
 * @param {BigInt} pq - factorized number
 * @returns {BigInt[]} - list of p q factors where p < q
 */
export function findPrimeFactors(pq) {
  if (pq % BigInt(2) === BigInt(0)) {
    return [2, pq / BigInt(2)]
  }

  let y = BigInt(1) + (random(64) % (pq - BigInt(1)));
  let c = BigInt(1) + (random(64) % (pq - BigInt(1)));
  let m = BigInt(1) + (random(64) % (pq - BigInt(1)));

  let g = BigInt(1);
  let r = BigInt(1);
  let q = BigInt(1);

  let x = BigInt(0);
  let ys = BigInt(0);

  while (g === BigInt(1)) {
    x = y;
    for (let i = BigInt(0); i < r; i += BigInt(1)) {
      y = (((y ** BigInt(2)) % pq) + c) % pq;
    }

    let k = BigInt(0);
    while (k < r && g === BigInt(1)) {
      ys = y;
      for(let i = BigInt(0); i  < min(m, r-k); i += BigInt(1)) {
        y = (((y ** BigInt(2)) % pq) + c) % pq;
        q = (q * abs_dec(x, y)) % pq
      }
      g = gcd(q, pq);
      k += m;
    }

    r = r * BigInt(2);
  }

  if (g === pq) {
    while (true) {
      ys = (((ys ** BigInt(2)) % pq) + c) % pq;
      g = gcd(abs_dec(x, ys), pq);
      if (g > 1) {
        break;
      }
    }
  }

  const p = g;
  q = pq / p;
  console.log(`PQ: ${pq.toString(16)}`);
  console.log(`P: ${p.toString(16)}`);
  console.log(`Q: ${q.toString(16)}`);
  console.log(`P * Q: ${(p * q).toString(16)}`);
  return (p < q) ? [p, q] : [q, p];
}

/**
 * Return hex variant of uint8array
 * @param {Uint8Array} arr
 */
export function uint8ArrayToHex(arr) {
  let hex = '';
  for (let i = 0; i < arr.length; i++) {
    hex += arr[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Parse sequence of bytes to BigInt. Sequence has got big endian format
 * @param {Uint8Array} arr
 * @returns {BigInt}
 */
export function uint8ToBigInt(arr) {
  let hex = '0x';
  for (let i = 0; i < arr.length; i++) {
    hex += arr[i].toString(16).padStart(2, '0');
  }
  console.log(hex);
  return BigInt(hex);
}

/**
 * Trans number or bigint to Uint8Array with big endian format if little endian doesn't set
 * @param bigint
 * @param littleEndian
 * @returns {number[]}
 */
export function bigIntToUint8Array(bigint, littleEndian) {
  const result  = [];
  let value = BigInt(bigint);

  while (value > BigInt(0)) {
    result.push(Number(value % BigInt(256)));
    value = value / BigInt(256);
  }
  if (result.length === 0) {
    result.push(0);
  }
  return littleEndian ? result : result.reverse();
}

/**
 * Converts ByteBuffer to ArrayBuffer
 * @param {ByteBuffer} forgeBuffer
 * @returns {ArrayBuffer}
 */
export function forgeBufferToArrayBuffer(forgeBuffer) {
  const bytes = forgeBuffer.getBytes();
  const buffer = new ArrayBuffer(bytes.length);
  const uintArray = new Uint8Array(buffer);
  for (let i=0; i < uintArray.length; i++) uintArray[i] = bytes.charCodeAt(i);

  return buffer;
};

/**
 * Converts ArrayBuffer to node-forge ByteBuffer;
 * @param arrayBuffer
 * @returns {ByteBuffer}
 */
export function arrayBufferToForgeBuffer(arrayBuffer) {
  const forgeBuffer = forge.util.createBuffer();
  const uintArray = new Uint8Array(arrayBuffer);
  for (let i=0; i < uintArray.length; i += 1) forgeBuffer.putByte(uintArray[i]);
  return forgeBuffer;
}

/**
 * Generates message id
 * @returns {bigint}
 */
export function getMessageId() {
  return BigInt(+Date.now()) * BigInt(Math.pow(2, 32));
}

/**
 * Copy bytes from Uint8Array `from` to Uint*Array `to`;
 * @param {Uint8Array} fromArr
 * @param {Uint8Array} toArr
 */
export function copyBytes(fromArr, toArr) {
  for(let i = 0; i < fromArr.length; i += 1) {
    toArr[i] = fromArr[i];
  }
}

