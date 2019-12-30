import parseMessageContainer from './parseMessageContainer';
import { hexToArrayBuffer } from '../utils';

it('parseMessageContainer', () => {
  /* eslint-disable */
  const hexStr = 'dcf8f1730200000001309989462d075e010000001c0000000809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b01689989462d075e0200000014000000c573773400000000452d075e7e34abe84fe1ef56';
  /* eslint-enable */
  const buffer = hexToArrayBuffer(hexStr);

  const messages = parseMessageContainer(buffer);
  expect(messages).toHaveLength(2);
});
