import * as R from 'ramda'

import { bigIntToUint8Array } from './utils';

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
