import R from 'ramda';
import isVNode from './isVNode';

describe('isVNOde()', () => {
  test('valid string', () => {
    expect(isVNode('test string')).toBeTruthy();
  });

  test('valid simple js object', () => {
    expect(isVNode({
      __vnode: true,
      type: 'h1',
      attrs: {
        class: 'test',
      },
      children: [
        'hello world',
      ],
    })).toBeTruthy();
  });

  test('valid nested js object', () => {
    expect(isVNode({
      __vnode: true,
      type: 'ul',
      attrs: {},
      children: [
        {
          __vnode: true,
          type: 'li',
          attrs: {},
          children: [
            'item 1',
          ],
        },
        {
          __vnode: true,
          type: 'li',
          attrs: {},
          children: [
            'item 2',
          ],
        },
      ],
    })).toBeTruthy();
  });


  [
    '__vnode',
    'type',
    'attrs',
    'children',
  ].forEach((removedItem) => {
    const jsObject = R.pickBy(
      R.pipe(
        R.nthArg(1),
        R.equals(removedItem),
        R.not,
      ),
      {
        __vnode: true,
        type: 'h1',
        attrs: {
          class: 'test',
        },
        children: [
          'hello world',
        ],
      },
    );

    test(`invalid js object no ${removedItem} attribute`, () => {
      expect(isVNode(jsObject)).toBeFalsy();
    });
  });

  test('test invalid nested virtual node is valid by plain check', () => {
    const invalidVDomNode = {
      __vnode: true,
      type: 'ul',
      attrs: {},
      children: [
        {
          __vnode: false,
          type: 'li',
          attrs: {},
          children: [
            'item 1',
          ],
        },
        {
          __vnode: true,
          type: 'li',
          attrs: {},
          children: [
            'item 2',
          ],
        },
      ],

    };

    expect(isVNode(invalidVDomNode)).toBeTruthy();
  });

  test('test invalid nested virtual node is invalid by nested check', () => {
    const invalidVDomNode = {
      __vnode: true,
      type: 'ul',
      attrs: {},
      children: [
        {
          type: 'li',
          attrs: {},
          children: [
            'item 1',
          ],
        },
        {
          __vnode: true,
          type: 'li',
          attrs: {},
          children: [
            'item 2',
          ],
        },
      ],

    };

    expect(isVNode(invalidVDomNode, true)).toBeFalsy();
  });
});
