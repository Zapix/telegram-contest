import parseMessage from './parseMessage';
import { PONG, NEW_SESSION_CREATED } from '../constants';
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

  it('new session created', () => {
    const hexStr = '0809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b';
    const buffer = hexToArrayBuffer(hexStr);

    expect(parseMessage(buffer)).toEqual({
      type: NEW_SESSION_CREATED,
      firstMsgId: BigInt('0x5e072d4500000000'),
      uniqueId: BigInt('0x8f5524a763de8c07'),
      serverSalt: BigInt('0x6b02abc667623eb7'),
    });
  });

  it('unexpected message', () => {
    const hexStr = '12110320';
    const buffer = hexToArrayBuffer(hexStr);

    expect(parseMessage(buffer)).toBeNull();
  });
});
