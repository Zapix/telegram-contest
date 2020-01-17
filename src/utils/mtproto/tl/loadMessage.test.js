import loadMessage from './loadMessage';
import {
  NEW_SESSION_CREATED,
  AUTH_SENT_CODE,
  MESSAGE_CONTAINER,
  TYPE_KEY,
  BAD_MSG_NOTIFICATION_TYPE,
  MSGS_ACK_TYPE,
  BAD_SERVER_SALT_TYPE,
  MSGS_STATE_REQ_TYPE,
  MSGS_STATE_INFO_TYPE,
  MSGS_ALL_INFO_TYPE,
  MSG_DETAILED_INFO_TYPE,
  MSG_NEW_DETAILED_INFO_TYPE,
  MSG_RESEND_REQ_TYPE,
  MSG_RESEND_ANS_REQ_TYPE,
  RPC_RESULT_TYPE,
  RPC_ERROR_TYPE,
  RPC_DROP_ANSWER_TYPE,
  RPC_ANSWER_DROPPED_RUNNING_TYPE,
  RPC_ANSWER_DROPPED_TYPE,
  GET_FUTURE_SALTS,
  FUTURE_SALT_TYPE,
  FUTURE_SALTS_TYPE,
  PING_TYPE,
  PONG_TYPE, PING_DELAY_DISCONNECT_TYPE,
} from '../constants';
import { hexToArrayBuffer } from '../utils';

describe('loadMessage', () => {
  it('pong', () => {
    const hexStr = 'c573773400000000452d075e7e34abe84fe1ef56';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: PONG_TYPE,
      msgId: BigInt('0x5e072d4500000000'),
      pingId: BigInt('0x56efe14fe8ab347e'),
    });
  });

  it('ping', () => {
    const hexStr = 'ec77be7a000000000e800b5e';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: PING_TYPE,
      pingId: BigInt('0x5e0b800e00000000'),
    });
  });

  it('ping_delay_disconnect', () => {
    const hexStr = '8c7b42f3000000000e800b5e4b000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: PING_DELAY_DISCONNECT_TYPE,
      pingId: BigInt('0x5e0b800e00000000'),
      disconnectDelay: 75,
    });
  });

  it('new session created', () => {
    const hexStr = '0809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
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

    expect(loadMessage(buffer)).toEqual({
      type: MESSAGE_CONTAINER,
      messages: [
        {
          msgId: BigInt('0x5e072d4689993001'),
          seqNo: 1,
          message: {
            type: NEW_SESSION_CREATED,
            firstMsgId: BigInt('0x5e072d4500000000'),
            uniqueId: BigInt('0x8f5524a763de8c07'),
            serverSalt: BigInt('0x6b02abc667623eb7'),
          },
        },
        {
          msgId: BigInt('0x5e072d4689996801'),
          seqNo: 2,
          message: {
            [TYPE_KEY]: PONG_TYPE,
            msgId: BigInt('0x5e072d4500000000'),
            pingId: BigInt('0x56efe14fe8ab347e'),
          },
        },
      ],
    });
  });

  it('bad message notification', () => {
    const hexStr = '11f8efa70000000079f60a5e0200000023000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: BAD_MSG_NOTIFICATION_TYPE,
      badMsgId: BigInt('0x5e0af67900000000'),
      badSeqNo: 2,
      errorCode: 0x23,
    });
  });

  it('bad server salt ', () => {
    // ed ab 44 7b
    const hexStr = '7b44abed0000000079f60a5e0200000023000000000000000a700b5e';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: BAD_SERVER_SALT_TYPE,
      badMsgId: BigInt('0x5e0af67900000000'),
      badSeqNo: 2,
      errorCode: 0x23,
      newServerSalt: BigInt('0x5e0b700a00000000'),
    });
  });

  it('messages acknowledgment', () => {
    const hexStr = '59b4d66215c4b51c02000000000000000a700b5e000000000e800b5e';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: MSGS_ACK_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
    });
  });

  it('auth code sent', () => {
    const hexStr = 'bdbc1522b57572991235646130343337306165386264323132373800';
    const buffer = hexToArrayBuffer(hexStr);
    expect(loadMessage(buffer)).toEqual({
      type: AUTH_SENT_CODE,
      phoneRegistered: true,
      phoneCodeHash: 'da04370ae8bd21278',
    });
  });

  it('rpc result', () => {
    /* eslint-disable */
    const hexStr = '016d5cf300000000bc860b5ebdbc1522b57572991235646130343337306165386264323132373800';
    /* eslint-enable */
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toMatchObject({
      [TYPE_KEY]: RPC_RESULT_TYPE,
      msgId: BigInt('0x5e0b86bc00000000'),
      // result: {
      //   type: AUTH_SENT_CODE,
      //   phoneRegistered: true,
      //   phoneCodeHash: 'da04370ae8bd21278',
      // },
    });
  });

  it('rpc error', () => {
    const hex = '19ca4421120000000c48656c6c6f20576f726c6421000000';
    const buffer = hexToArrayBuffer(hex);

    expect(loadMessage(buffer)).toEqual({
      errorCode: 18,
      [TYPE_KEY]: RPC_ERROR_TYPE,
      errorMessage: 'Hello World!',
    });
  });

  it('rpc drop answer', () => {
    const hexStr = '40a7e458000000000e800b5e';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: RPC_DROP_ANSWER_TYPE,
      reqMsgId: BigInt('0x5e0b800e00000000'),
    });
  });

  it('rpc answer unknown', () => {
    const hexStr = '6ed32a5e';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({ [TYPE_KEY]: RPC_DROP_ANSWER_TYPE });
  });

  it('rpc answer dropped running', () => {
    const hexStr = '86e578cd';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({ [TYPE_KEY]: RPC_ANSWER_DROPPED_RUNNING_TYPE });
  });

  it('rpc answer dropped', () => {
    const hexStr = 'b7d83aa4000000000e800b5e1c000000ff000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: RPC_ANSWER_DROPPED_TYPE,
      msgId: BigInt('0x5e0b800e00000000'),
      seqNo: 28,
      bytes: 255,
    });
  });

  it('load msgs_state_req', () => {
    const hexStr = '52fb69da15c4b51c02000000000000000a700b5e000000000e800b5e';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: MSGS_STATE_REQ_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
    });
  });

  it('load msgs_state_info', () => {
    const hexStr = '7db5de0400000000452d075e040101040c000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: MSGS_STATE_INFO_TYPE,
      reqMsgId: BigInt('0x5e072d4500000000'),
      info: [1, 1, 4, 12],
    });
  });

  it('load msgs_all_info', () => {
    const hexStr = '31d1c08c15c4b51c02000000000000000a700b5e000000000e800b5e020c0d00';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: MSGS_ALL_INFO_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
      info: [12, 13],
    });
  });

  it('load msg_detailed_info', () => {
    const hexStr = 'c63e6d27000000000a700b5e000000000e800b5e7b00000000000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: MSG_DETAILED_INFO_TYPE,
      msgId: BigInt('0x5e0b700a00000000'),
      answerMsgId: BigInt('0x5e0b800e00000000'),
      bytes: 123,
      status: 0,
    });
  });

  it('load msg_new_detailed_info', () => {
    const hexStr = 'dfb69d80000000000e800b5e0c00000000000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: MSG_NEW_DETAILED_INFO_TYPE,
      answerMsgId: BigInt('0x5e0b800e00000000'),
      bytes: 12,
      status: 0,
    });
  });

  it('load msg_resend_req', () => {
    const hexStr = '081a867d15c4b51c02000000000000000a700b5e000000000e800b5e';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: MSG_RESEND_REQ_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
    });
  });

  it('load msg_resend_ans_req', () => {
    const hexStr = 'ebba108615c4b51c02000000000000000a700b5e000000000e800b5e';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: MSG_RESEND_ANS_REQ_TYPE,
      msgIds: [
        BigInt('0x5e0b700a00000000'),
        BigInt('0x5e0b800e00000000'),
      ],
    });
  });

  it('load get_future_salts', () => {
    const hexStr = '04bd21b912000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: GET_FUTURE_SALTS,
      num: 18,
    });
  });

  it('future_salt', () => {
    const hexStr = 'dcd9490900010000000001000101000000000000';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: FUTURE_SALT_TYPE,
      validSince: 256,
      validUntil: 65536,
      salt: BigInt(257),
    });
  });

  it('future_salts', () => {
    /* eslint-disable */
    const hexStr = '950850ae000000000e800b5eff00000015c4b51c02000000dcd9490900010000000001000101000000000000dcd9490901000100000000011111000000000000';
    /* eslint-enable */

    const buffer = hexToArrayBuffer(hexStr);
    expect(loadMessage(buffer)).toEqual({
      [TYPE_KEY]: FUTURE_SALTS_TYPE,
      reqMsgId: BigInt('0x5e0b800e00000000'),
      now: 255,
      salts: [
        {
          [TYPE_KEY]: FUTURE_SALT_TYPE,
          validSince: 256,
          validUntil: 65536,
          salt: BigInt(257),
        },
        {
          [TYPE_KEY]: FUTURE_SALT_TYPE,
          validSince: 65537,
          validUntil: 16777216,
          salt: BigInt(4369),
        },
      ],
    });
  });

  it('unexpected message', () => {
    const hexStr = '12110320';
    const buffer = hexToArrayBuffer(hexStr);

    expect(loadMessage(buffer)).toBeNull();
  });
});
