import isVNode from './isVNode';
import createElement from './createElement';


describe('createElement', () => {
  test('create vNode without child', () => {
    const vNode = createElement('br', { className: 'separator' }, null);

    expect(vNode).toHaveProperty('type', 'br');
    expect(vNode).toHaveProperty('attrs.className', 'separator');
    expect(vNode).toHaveProperty('children', []);
    expect(isVNode(vNode)).toBeTruthy();
  });

  test('create vNode with child', () => {
    const vNode = createElement('h1', { className: 'redclass' }, 'Hello World');
    expect(vNode).toHaveProperty('type', 'h1');
    expect(vNode).toHaveProperty('attrs.className', 'redclass');
    expect(vNode).toHaveProperty('children', ['Hello World']);
    expect(isVNode(vNode)).toBeTruthy();
  });

  test('create node with children', () => {
    const vNode = createElement(
      'ul',
      null,
      [
        createElement('li', null, 'Item 1'),
        createElement('li', { className: 'active' }, 'Item 2'),
      ],
    );

    expect(vNode).toHaveProperty('type', 'ul');
    expect(vNode).toHaveProperty('attrs', {});
    expect(vNode.children).toHaveLength(2);
    expect(isVNode(vNode, true)).toBeTruthy();
  });
});
