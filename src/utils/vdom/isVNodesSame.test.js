import createElement from './createElement';
import isVNodesSame from './isVNodesSame';


describe('isVNodesSame()', () => {
  test('vNodes are the same with ids', () => {
    const aVNode = createElement('div', { id: 'section' }, null);
    const bVNode = createElement('div', { id: 'section', class: 'active' }, null);
    expect(isVNodesSame(aVNode, bVNode)).toBeTruthy();
  });

  test('vNodes are the same without ids', () => {
    const aVNode = createElement('div', {}, null);
    const bVNode = createElement('div', { class: 'active' }, 'Main Section');

    expect(isVNodesSame(aVNode, bVNode)).toBeTruthy();
  });

  test('vNodes has got different types', () => {
    const aVNode = createElement('div', {}, null);
    const bVNode = createElement('p', {}, null);

    expect(isVNodesSame(aVNode, bVNode)).toBeFalsy();
  });

  test('vNodes has got different ids', () => {
    const aVNode = createElement('div', { id: 'section' }, null);
    const bVNode = createElement('div', { id: 'footer' }, null);

    expect(isVNodesSame(aVNode, bVNode)).toBeFalsy();
  });

  test('one vNode has got id another hasn`t', () => {
    const aVNode = createElement('div', { id: 'section' }, null);
    const bVNode = createElement('div', {}, null);

    expect(isVNodesSame(aVNode, bVNode)).toBeFalsy();
  });

  test('one vNode another string', () => {
    const aVNode = 'string';
    const bVNode = createElement('div', {}, null);
    expect(isVNodesSame(aVNode, bVNode)).toBeFalsy();
  });

  test('one string another string', () => {
    expect(isVNodesSame('test', 'world')).toBeTruthy();
  });
});
