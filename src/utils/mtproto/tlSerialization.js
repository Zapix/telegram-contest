import * as R from 'ramda'

import { bigIntToUint8Array, uint8ToBigInt } from './utils';

const debug = x => {
  console.log(x);
  return x;
};

export const isShortString = R.pipe(
  R.prop('length'),
  R.gt(254)
);

export const isLongString = R.pipe(
  isShortString,
  R.not,
);

const padEndBytes = R.pipe(
  R.of,
  R.ap([
    R.identity,
    R.pipe(
      R.prop('length'),
      R.modulo(R.__, 4),
      R.subtract(4),
      R.modulo(R.__, 4),
      R.times(R.always(0)),
    ),
  ]),
  R.flatten
);

const toShortTlString = R.pipe(
  R.of,
  R.ap([
    R.pipe(R.prop('length'), R.of), // first byte is an length,
    R.identity, // current string
  ]),
  R.flatten,
  padEndBytes,
);


const toLongTlString = R.pipe(
  R.of,
  R.ap([
    R.pipe(
      R.prop('length'),
      R.curryN(2)(bigIntToUint8Array)(R.__, true),
      R.concat([254]),
      R.flatten,
      padEndBytes,
    ),
    R.identity,
  ]),
  R.flatten,
  padEndBytes,
);


/**
 * Takes array of bytes and return them as telegram string. Telegram string info:
 *
 * @param {Number[]} arr
 * @returns {Number[]} - update r with length info
 */
export const toTlString = R.cond([
  [isShortString, toShortTlString],
  [R.T, toLongTlString],
]);


const fromTlShortString  = R.pipe(
  R.of,
  R.ap([
    R.always(1),
    R.pipe(R.nth(0), R.inc),
    R.identity,
  ]),
  R.apply(R.slice)
);

/**
 * Parse bytes array to int with little endian notation
 * @type {Function|*}
 */
const uint8ToInt = R.pipe(
  R.flip(R.curryN(2)(uint8ToBigInt))(true),
  Number,
  debug,
);

const fromTlLongString = R.pipe(
  R.of,
  R.ap([
    R.always(4),
    R.pipe(R.slice(1, 4), uint8ToInt, R.add(4)),
    R.identity,
  ]),
  R.apply(R.slice)
);

/**
 * Takes array of bytes that represents
 * @param {Number[]} tlString - serialized telegram string
 */
export const fromTlString = R.cond([
  [R.pipe(R.nth(0), R.gt(254)), fromTlShortString],
  [R.T, fromTlLongString],
]);