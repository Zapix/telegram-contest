import dumpVector from './dumpVector';
import loadVector from './loadVector';

import { loadBool } from '../bool';
import { loadInt } from '../int';
import { loadBigInt } from '../bigInt';
import { loadString } from '../string';

describe('dumpVector', () => {
  it('of bool', () => {
    const buffer = dumpVector([true, false, true, true]);
    expect(loadVector(loadBool, buffer)).toEqual([true, false, true, true]);
  });

  it('of int', () => {
    const buffer = dumpVector([3, 1, 3, 3, 7, 42]);
    expect(loadVector(loadInt, buffer)).toEqual([3, 1, 3, 3, 7, 42]);
  });

  it('of bigint', () => {
    const buffer = dumpVector([BigInt('2019'), BigInt('2020')]);
    expect(loadVector(loadBigInt, buffer)).toEqual([BigInt('2019'), BigInt('2020')]);
  });

  it('of string', () => {
    const buffer = dumpVector(['Hello', 'MTProto', 'implementation']);
    expect(loadVector(loadString, buffer)).toEqual(['Hello', 'MTProto', 'implementation']);
  });
});
