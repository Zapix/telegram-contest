import * as R from 'ramda';

import { dumpInt } from '../int';
import { dumpBigInt } from '../bigInt';
import { dumpBool } from '../bool';
import { dumpString } from '../string';
import { VECTOR } from '../../constants';
import { mergeArrayBuffer } from '../../utils';

const getEmptyArrayBuffer = R.always(new ArrayBuffer(0));

/**
 * @param {Array<*>} value
 * @returns {ArrayBuffer}
 */
const buildVectorPrefixBuffer = R.pipe(
  R.of,
  R.ap([R.always(dumpInt(VECTOR)), R.pipe(R.prop('length'), dumpInt)]),
  R.apply(mergeArrayBuffer),
);

/**
 *
 * @param {Array<*>} value
 * @returns {ArrayBuffer}
 */
export default function dumpVector(value) {
  const getDumpFunc = R.cond([
    [R.is(Boolean), R.always(dumpBool)],
    [R.is(Number), R.always(dumpInt)],
    [R.is(BigInt), R.always(dumpBigInt)],
    [R.is(String), R.always(dumpString)],
    [R.is(Array), R.always(dumpVector)],
    [R.T, R.always(getEmptyArrayBuffer)],
  ]);

  const dumpNotEmptyArray = R.pipe(
    R.of,
    R.ap([R.pipe(R.nth(0), getDumpFunc), R.identity]),
    R.apply(R.map),
  );

  const dumpArray = R.cond([
    [R.isEmpty, getEmptyArrayBuffer],
    [R.T, dumpNotEmptyArray],
  ]);

  return R.pipe(
    R.of,
    R.ap([buildVectorPrefixBuffer, dumpArray]),
    R.flatten,
    R.reduce(mergeArrayBuffer, getEmptyArrayBuffer()),
  )(value);
}
