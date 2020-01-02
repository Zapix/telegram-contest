import * as R from 'ramda';

import parseMessageContainer from './parseMessageContainer';
import { hexToArrayBuffer } from '../utils';
import { MESSAGE_CONTAINER } from '../constants';

describe('parseMessageContainer', () => {
  it('parseMessageContainer', () => {
    /* eslint-disable */
    const hexStr = 'dcf8f1730200000001309989462d075e010000001c0000000809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b01689989462d075e0200000014000000c573773400000000452d075e7e34abe84fe1ef56';
    /* eslint-enable */
    const buffer = hexToArrayBuffer(hexStr);

    const messageContainer = parseMessageContainer(buffer, R.identity);
    expect(messageContainer.type).toEqual(MESSAGE_CONTAINER);
    expect(messageContainer.messages).toHaveLength(2);

    for (let i; i < messageContainer.messages.length; i += 1) {
      const x = messageContainer.messages[i];
      expect(x).toContain('msgId');
      expect(x).toContain('seqNo');
      expect(x).toContain('message');
    }
  });
});
