import sum from './sum';

describe('sum function', () => {
  test('sum', () => {
    expect(sum(1, 3)).toBe(4);
  });
});
