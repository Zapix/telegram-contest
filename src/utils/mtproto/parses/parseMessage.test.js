import parseMessage from './parseMessage';
import { PONG, NEW_SESSION_CREATED, BAD_MSG_NOTIFICATION } from '../constants';
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

  it('parse message container', () => {
    /* eslint-disable */
    const hexStr = 'dcf8f1730200000001309989462d075e010000001c0000000809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b01689989462d075e0200000014000000c573773400000000452d075e7e34abe84fe1ef56';
    /* eslint-enable */
    const buffer = hexToArrayBuffer(hexStr);

    expect(parseMessage(buffer)).toEqual([
      {
        type: NEW_SESSION_CREATED,
        firstMsgId: BigInt('0x5e072d4500000000'),
        uniqueId: BigInt('0x8f5524a763de8c07'),
        serverSalt: BigInt('0x6b02abc667623eb7'),
      },
      {
        type: PONG,
        msgId: BigInt('0x5e072d4500000000'),
        pingId: BigInt('0x56efe14fe8ab347e'),
      },
    ]);
  });

  it('bad message notification', () => {
    const hexStr = '11f8efa70000000079f60a5e0200000023000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(parseMessage(buffer)).toEqual({
      type: BAD_MSG_NOTIFICATION,
      badMsgId: BigInt('0x5e0af67900000000'),
      badSeqNo: 2,
      errorCode: 0x23,
    });
  });

  it('unexpected message', () => {
    const hexStr = '12110320';
    const buffer = hexToArrayBuffer(hexStr);

    expect(parseMessage(buffer)).toBeNull();
  });
});
