import {
  getConstructor,
  isMessageContainer,
  isPong,
  isNewSessionCreated,
} from './utils';
import { copyBytes, hexToArrayBuffer, hexToUint8Array } from '../utils';

describe('getConstructor()', () => {
  it('test', () => {
    const buffer = hexToArrayBuffer('dcf8f173');
    expect(getConstructor(buffer)).toEqual(0x73f1f8dc);
  });
});

describe('isMessageContainer', () => {
  it('success', () => {
    /* eslint-disable */
    const hexStr = 'dcf8f1730200000001309989462d075e010000001c0000000809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b01689989462d075e0200000014000000c573773400000000452d075e7e34abe84fe1ef56';
    /* eslint-enable */
    const messageContainerBytes = hexToUint8Array(hexStr);
    const buffer = new ArrayBuffer(messageContainerBytes.length);
    const bufferBytes = new Uint8Array(buffer);
    copyBytes(messageContainerBytes, bufferBytes);

    expect(isMessageContainer(buffer)).toEqual(true);
  });

  it('failed', () => {
    const hexStr = 'c573773400000000452d075e7e34abe84fe1ef56';
    const messageContainerBytes = hexToUint8Array(hexStr);
    const buffer = new ArrayBuffer(messageContainerBytes.length);
    const bufferBytes = new Uint8Array(buffer);
    copyBytes(messageContainerBytes, bufferBytes);

    expect(isMessageContainer(buffer)).toEqual(false);
  });
});

describe('isPong', () => {
  it('success', () => {
    /* eslint-disable */
    const hexStr = 'c573773400000000452d075e7e34abe84fe1ef56';
    /* eslint-enable */
    const messageContainerBytes = hexToUint8Array(hexStr);
    const buffer = new ArrayBuffer(messageContainerBytes.length);
    const bufferBytes = new Uint8Array(buffer);
    copyBytes(messageContainerBytes, bufferBytes);

    expect(isPong(buffer)).toEqual(true);
  });

  it('failed', () => {
    /* eslint-disable */
    const hexStr = 'dcf8f1730200000001309989462d075e010000001c0000000809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b01689989462d075e0200000014000000c573773400000000452d075e7e34abe84fe1ef56';
    /* eslint-enable */
    const messageContainerBytes = hexToUint8Array(hexStr);
    const buffer = new ArrayBuffer(messageContainerBytes.length);
    const bufferBytes = new Uint8Array(buffer);
    copyBytes(messageContainerBytes, bufferBytes);

    expect(isPong(buffer)).toEqual(false);
  });
});

describe('isNewSessionCreated', () => {
  it('success', () => {
    /* eslint-disable */
    const hexStr = '0809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b';
    /* eslint-enable */
    const messageContainerBytes = hexToUint8Array(hexStr);
    const buffer = new ArrayBuffer(messageContainerBytes.length);
    const bufferBytes = new Uint8Array(buffer);
    copyBytes(messageContainerBytes, bufferBytes);

    expect(isNewSessionCreated(buffer)).toEqual(true);
  });

  it('failed', () => {
    /* eslint-disable */
    const hexStr = 'dcf8f1730200000001309989462d075e010000001c0000000809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b01689989462d075e0200000014000000c573773400000000452d075e7e34abe84fe1ef56';
    /* eslint-enable */
    const messageContainerBytes = hexToUint8Array(hexStr);
    const buffer = new ArrayBuffer(messageContainerBytes.length);
    const bufferBytes = new Uint8Array(buffer);
    copyBytes(messageContainerBytes, bufferBytes);

    expect(isNewSessionCreated(buffer)).toEqual(false);
  });
});
