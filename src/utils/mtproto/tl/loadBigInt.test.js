import { hexToArrayBuffer } from '../utils';
import loadBigInt from './loadBigInt';

describe('loadBigInt', () => {
  it('test', () => {
    const hexStr = '0x0101000000000000';
    const buffer = hexToArrayBuffer(hexStr);
    expect(loadBigInt(buffer)).toEqual(BigInt(257));
  });
});
