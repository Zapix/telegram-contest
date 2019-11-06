import render from './render';
import createElement from './createElement';

describe('render()', () => {
  test('render text node', () => {
    const rootNodeElement = document.createElement('h1');
    render(rootNodeElement, 'simple text');
    expect(rootNodeElement.textContent).toEqual('simple text');
  });

  test('render flatten vNode', () => {
    const rootNodeElement = document.createElement('div');
    const vNode = createElement('h1', { class: 'title' }, 'Hello World');

    render(rootNodeElement, vNode);

    expect(rootNodeElement.children).toHaveLength(1);
    expect(rootNodeElement.children[0].tagName).toEqual('H1');
    expect(rootNodeElement.children[0].textContent).toEqual('Hello World');
    expect(rootNodeElement.children[0].className).toEqual('title');

    expect(vNode._node).not.toBeNull();
    expect(vNode._node).toEqual(rootNodeElement.children[0]);
  });

  test('render nested vNode', () => {
    const rootNodeElement = document.createElement('div');
    const vNode = createElement(
      'ul',
      null,
      [
        createElement('li', null, 'Item 1'),
        createElement('li', null, 'Item 2'),
      ],
    );

    render(rootNodeElement, vNode);

    expect(rootNodeElement.children).toHaveLength(1);
    expect(rootNodeElement.children[0].tagName).toEqual('UL');

    const ulNode = vNode._node;
    expect(rootNodeElement.children[0]).toEqual(vNode._node);
    expect(ulNode.children).toHaveLength(2);
    expect(ulNode.children[0].tagName).toEqual('LI');
  });
});
