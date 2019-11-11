import {
  generateFirstInitPayload,
  isValidInitPayload,
  buildSecondInitPayload,
  isPrime,
  findPrimeFactors,
  primeGenerator,
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

  for(let i=0; i < firstView.length; i++) {
    expect(firstView[i]).toEqual(secondView[secondView.length-i-1]);
  }
});

describe('isPrime', () => {
  test('true', () => {
    const value = BigInt('0x494C553B');
  });
});

describe('primeGenerator', () => {
  test('true', () => {
    const gen = primeGenerator();
    for (let i =0; i < 17; i ++) {
      const { value } = gen.next();
      expect(isPrime(value)).toBeTruthy();
    }
  })
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
  })
});
