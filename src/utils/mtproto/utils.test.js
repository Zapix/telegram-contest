import {
  generateFirstInitPayload,
  isValidInitPayload,
  buildSecondInitPayload,
  isPrime,
  findPrimeFactors,
  primeGenerator,
  generateKeyDataFromNonce,
  hexToUint8Array,
  copyBytes,
  isMessageContainer,
} from './utils';

describe('isValidInitPayload()', () => {
  test('invalid first byte', () => {
    const buffer = generateFirstInitPayload();
    const firstByte = new Uint8Array(buffer, 0, 1);
    firstByte[0] = 0xef;

    expect(isValidInitPayload(buffer)).toBeFalsy();
  });

  test('invalid first int', () => {
    const buffer = generateFirstInitPayload();
    const firstInt = new Uint32Array(buffer, 0, 1);
    firstInt[0] = 0xdddddddd;

    expect(isValidInitPayload(buffer)).toBeFalsy();
  });

  test('invalid second int', () => {
    const buffer = generateFirstInitPayload();
    const secondInt = new Uint32Array(buffer, 4, 1);
    secondInt[0] = 0x00000000;

    expect(isValidInitPayload(buffer)).toBeFalsy();
  });

  test('valid init payload', () => {
    const buffer = generateFirstInitPayload();
    expect(isValidInitPayload(buffer)).toBeTruthy();
  });
});

describe('buildSecondInitPayload()', () => {
  const firstInitPayload = generateFirstInitPayload();
  const secondInitPyaload = buildSecondInitPayload(firstInitPayload);

  const firstView = new Uint8Array(firstInitPayload);
  const secondView = new Uint8Array(secondInitPyaload);

  for (let i = 0; i < firstView.length; i += 1) {
    expect(firstView[i]).toEqual(secondView[secondView.length - i - 1]);
  }
});

describe('primeGenerator', () => {
  test('true', () => {
    const gen = primeGenerator();
    for (let i = 0; i < 17; i += 1) {
      const { value } = gen.next();
      expect(isPrime(value)).toBeTruthy();
    }
  });
});

describe('findPrimeFactors', () => {
  test('simple test', () => {
    const [p, q] = findPrimeFactors(BigInt(85));
    expect(p === BigInt(5)).toBeTruthy();
    expect(q === BigInt(17)).toBeTruthy();
  });

  test('from telegram example', () => {
    const [p, q] = findPrimeFactors(BigInt('0x17ED48941A08F981'));
    expect(p === BigInt('0x494C553B')).toBeTruthy();
    expect(q === BigInt('0x53911073')).toBeTruthy();
  });

  test('from telegram response', () => {
    const [p, q] = findPrimeFactors(BigInt('0x31f05bcc5ce66ccd'));
    expect(p === BigInt('0x6f7b6a45')).toBeTruthy();
    expect(q === BigInt('0x72ad24e9')).toBeTruthy();
  });

  test('from telegram response 2', () => {
    const [p, q] = findPrimeFactors(BigInt('0x256edefca64f89db'));
    expect(p === BigInt('0x5556e63f')).toBeTruthy();
    expect(q === BigInt('0x704a8d65')).toBeTruthy();
  });
});

describe('generateKeyDataFromNonce()', () => {
  test('telegram example', () => {
    const serverNonce = hexToUint8Array('A5CF4D33F4A11EA877BA4AA573907330');
    const newNonce = hexToUint8Array(
      '311C85DB234AA2640AFC4A76A735CF5B1F0FD68BD17FA181E1229AD867CC024D',
    );

    const { key, iv } = generateKeyDataFromNonce(serverNonce, newNonce);

    expect(key.toHex().toUpperCase()).toEqual(
      'F011280887C7BB01DF0FC4E17830E0B91FBB8BE4B2267CB985AE25F33B527253',
    );
    expect(iv.toHex().toUpperCase()).toEqual(
      '3212D579EE35452ED23E0D0C92841AA7D31B2E9BDEF2151E80D15860311C85DB',
    );
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
