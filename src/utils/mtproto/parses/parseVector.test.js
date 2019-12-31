import * as R from 'ramda';

import parseVector from './parseVector';
import { hexToArrayBuffer } from '../utils';

describe('parseVector', () => {
  it('success', () => {
    // 15 C4 B5 1C 03 00 00 00 02 00 00 00 03 00 00 00 04 00 00 00
    const hexStr = '15c4b51c03000000020000000300000004000000';
    const buffer = hexToArrayBuffer(hexStr);

    const vector = R.pipe(
      parseVector,
      R.map(R.pipe(
        (x) => new Uint32Array(x),
        R.nth(0),
      )),
    )(buffer);

    expect(vector).toHaveLength(3);
    expect(vector).toEqual([2, 3, 4]);
  });
});
