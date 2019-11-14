import mergeClasses from './mergeClasses';

describe('mergeClasses', () => {
  test('success', () => {
    expect(
      mergeClasses(
        { class: 'init' },
        'test',
        ['array1', 'array2', 'subarray1 subarray2'],
        'string1 string2',
        null,
      ),
    ).toEqual(
      'init test array1 array2 subarray1 subarray2 string1 string2',
    );
  });
});
