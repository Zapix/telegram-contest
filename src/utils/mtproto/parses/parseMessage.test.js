import parseMessage from './parseMessage';
import { PONG } from '../constants';
import { hexToArrayBuffer } from '../utils';

describe('parseMessage', () => {
  it('pong', () => {
    const hexStr = 'c573773400000000452d075e7e34abe84fe1ef56';
    const buffer = hexToArrayBuffer(hexStr);

    expect(parseMessage(buffer)).toEqual({
      type: PONG,
      msgId: BigInt('0x5e072d4500000000'),
      pingId: BigInt('0x56efe14fe8ab347e'),
    });
  });

  it('unexpected message', () => {
    const hexStr = '12110320';
    const buffer = hexToArrayBuffer(hexStr);

    expect(parseMessage(buffer)).toBeNull();
  });
});
