import parseMessage from './parseMessage';
import { hexToArrayBuffer } from '../utils';

describe('parseMessage', () => {
  it('parse unexpected message', () => {
    const hexStr = '12110320';
    const buffer = hexToArrayBuffer(hexStr);

    expect(parseMessage(buffer)).toBeNull();
  });
});
