import createElement from './createElement';
import mount from './mount';

describe('mount()', () => {
  test('mount success with several rerenders', () => {
    const $root = document.createElement('div');
    const baseComponent = (value) => createElement('h1', { class: 'title' }, value);

    const updateView = mount($root, baseComponent, 'initial');

    expect($root.children[0].tagName).toEqual('H1');
    expect($root.children[0].textContent).toEqual('initial');

    updateView('second');

    expect($root.children[0].tagName).toEqual('H1');
    expect($root.children[0].textContent).toEqual('second');

    updateView('third');
    expect($root.children[0].tagName).toEqual('H1');
    expect($root.children[0].textContent).toEqual('third');
  });
});
