import * as R from 'ramda';

import { hexToArrayBuffer, sliceBuffer } from '../../utils';
import loadRpcResult from './loadRpcResult';
import { TYPE_KEY, RPC_RESULT_TYPE } from '../../constants';

describe('loadRpcResult', () => {
  /* eslint-disable */
  const hexStr = '016d5cf300000000bc860b5ebdbc1522b57572991235646130343337306165386264323132373800';
  /* eslint-enable */
  const buffer = hexToArrayBuffer(hexStr);

  const customLoader = (x, withOffset) => {
    const value = new Uint8Array(x);
    if (withOffset) {
      return {
        value,
        offset: x.byteLength,
      };
    }
    return value;
  };

  const load = R.partialRight(loadRpcResult, [customLoader]);

  it.only('without offset', () => {
    expect(load(buffer)).toEqual({
      [TYPE_KEY]: RPC_RESULT_TYPE,
      msgId: BigInt('0x5e0b86bc00000000'),
      result: new Uint8Array(sliceBuffer(buffer, 12)),
    });
  });

  it.only('with offset', () => {
    expect(load(buffer, true)).toEqual({
      value: {
        [TYPE_KEY]: RPC_RESULT_TYPE,
        msgId: BigInt('0x5e0b86bc00000000'),
        result: new Uint8Array(sliceBuffer(buffer, 12)),
      },
      offset: 40,
    });
  });
});
