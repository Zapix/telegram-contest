import render from './render';
import rerender from './rerender';
import createElement from './createElement';

describe('rerender', () => {
  test('rerender string values', () => {
    const parent$ = document.createElement('h1');

    parent$.append('hello');

    rerender(parent$, 'hello', 'world');
    expect(parent$.textContent).toEqual('world');
  });

  test('rerender flatten element', () => {
    const parent$ = document.createElement('div');
    const oldVNode = createElement('img', { class: 'title', src: '123.jpg' }, null);
    render(parent$, oldVNode);

    const newVNode = createElement('br', { class: 'separator' }, null);
    rerender(parent$, oldVNode, newVNode);

    expect(parent$.children).toHaveLength(1);
    expect(parent$.children[0].tagName).toEqual('BR');
    expect(parent$.children[0]).toEqual(newVNode._node);
  });

  test('rerender flatten element replace attributes', () => {
    const parent$ = document.createElement('div');
    const oldVNode = createElement('img', { class: 'thumbnail', src: '123.jpg' }, null);

    render(parent$, oldVNode);

    const newVNode = createElement('img', { class: 'fullsize', src: '123-full.jpg' }, null);

    rerender(parent$, oldVNode, newVNode);

    expect(parent$.children[0].tagName).toEqual('IMG');
    expect(parent$.children[0]).toEqual(newVNode._node);
    expect(newVNode._node.getAttribute('src')).toEqual('123-full.jpg');
    expect(newVNode._node.className).toEqual('fullsize');
  });

  test('nested elements add another children', () => {
    const parent$ = document.createElement('div');
    const oldVNode = createElement(
      'ul',
      null,
      [
        createElement('li', { id: '#item1' }, 'Item1'),
        createElement('li', { id: '#item2' }, 'Item2'),
      ],
    );
    render(parent$, oldVNode);

    const newVNode = createElement(
      'ul',
      null,
      [
        createElement('li', { id: '#item1' }, 'Item1'),
        createElement('li', { id: '#item2' }, 'Item2'),
        createElement('li', { id: '#item3' }, 'Item3'),
        createElement('li', { id: '#item4' }, 'Item4'),
      ],
    );
    rerender(parent$, oldVNode, newVNode);

    expect(newVNode._node.children).toHaveLength(4);
  });

  test('nested elements add childs to empty element', () => {
    const parent$ = document.createElement('div');
    const oldVNode = createElement(
      'ul',
      null,
      [
      ],
    );
    render(parent$, oldVNode);

    const newVNode = createElement(
      'ul',
      null,
      [
        createElement('li', { id: '#item1' }, 'Item1'),
        createElement('li', { id: '#item2' }, 'Item2'),
        createElement('li', { id: '#item3' }, 'Item3'),
        createElement('li', { id: '#item4' }, 'Item4'),
      ],
    );
    rerender(parent$, oldVNode, newVNode);

    expect(newVNode._node.children).toHaveLength(4);
  });

  test('nested elements replace with one element', () => {
    const parent$ = document.createElement('div');
    const oldVNode = createElement(
      'ul',
      null,
      [
        createElement('li', { id: '#item1' }, 'Item1'),
        createElement('li', { id: '#item2' }, 'Item2'),
      ],
    );
    render(parent$, oldVNode);

    const newVNode = createElement(
      'ul',
      null,
      [
        createElement('li', { id: '#item4' }, 'Item4'),
      ],
    );
    rerender(parent$, oldVNode, newVNode);

    expect(newVNode._node.children).toHaveLength(1);
    expect(newVNode._node.children[0]).toEqual(newVNode.children[0]._node);
  });

  test('complex update of items', () => {
    const parent$ = document.createElement('div');
    const oldVNode = createElement(
      'ul',
      null,
      [
        createElement('li', { id: '#item2' }, 'Item2'),
        createElement('li', { id: '#item3' }, 'Item3'),
        createElement('li', { id: '#item4' }, 'Item4'),
        createElement('li', { id: '#item5' }, 'Item5'),
        createElement('li', { id: '#item6' }, 'Item6'),
        createElement('li', { id: '#item7' }, 'Item7'),
      ],
    );
    render(parent$, oldVNode);

    const newVNode = createElement(
      'ul',
      null,
      [
        createElement('li', { id: '#item0' }, 'Item0'),
        createElement('li', { id: '#item1' }, 'Item1'),
        createElement('li', { id: '#item4' }, 'Updated Item'),
        createElement('li', { id: '#item7' }, 'Item7'),
        createElement('li', { id: '#item8' }, 'Item8'),
        createElement('li', { id: '#item9' }, 'Item9'),
      ],
    );

    rerender(parent$, oldVNode, newVNode);

    expect(newVNode._node.children).toHaveLength(6);
    expect(newVNode._node.children[0].textContent).toEqual('Item0');
    expect(newVNode._node.children[1].textContent).toEqual('Item1');
    expect(newVNode._node.children[2].textContent).toEqual('Updated Item');
    expect(newVNode._node.children[3].textContent).toEqual('Item7');
    expect(newVNode._node.children[4].textContent).toEqual('Item8');
    expect(newVNode._node.children[5].textContent).toEqual('Item9');
  });
});
