import createElement from './createElement';
import isVNodesEqual from './isVNodesEqual';


describe('isVNodesEqual()', () => {
  test('equals vnodes', () => {
    const aVNode = createElement(
      'h2',
      { class: 'title' },
      'New Application',
    );
    const bVNode = createElement(
      'h2',
      { class: 'title' },
      'New Application',
    );

    expect(isVNodesEqual(aVNode, bVNode)).toBeTruthy();
  });

  test('different attributes', () => {
    const aVNode = createElement(
      'h2',
      { class: 'title' },
      'New Application',
    );
    const bVNode = createElement(
      'h2',
      { id: 'main', class: 'title' },
      'New Application',
    );

    expect(isVNodesEqual(aVNode, bVNode)).toBeFalsy();
  });

  test('different types', () => {
    const aVNode = createElement(
      'h1',
      { class: 'title' },
      'New Application',
    );
    const bVNode = createElement(
      'h2',
      { class: 'title' },
      'New Application',
    );

    expect(isVNodesEqual(aVNode, bVNode)).toBeFalsy();
  });

  test('string and vNode object', () => {
    const aVNode = createElement(
      'h1',
      { class: 'title' },
      'New Application'
    );

    expect(isVNodesEqual(aVNode, 'string')).toBeFalsy();
  });

  test('same strings', () => {
    expect(isVNodesEqual('string', 'string')).toBeTruthy();
  });

  test('different strings', () => {
    expect(isVNodesEqual('string', 'another')).toBeFalsy();
  })
});
