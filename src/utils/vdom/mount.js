import render from './render';
import rerender from './rerender';

/**
 * Takes `$root` HTMLElement, Component `baseComponent`, and `initialState`.
 * renders `baseComponent` with `initialState`, and returns function that will
 * rerenders with new state.
 * @param {HTMLElement} $root
 * @param {Function} baseComponent
 * @param {*} initialState
 * @returns {Function} - that will rerenders initial state
 */
function mount($root, baseComponent, initialState) {
  let oldVNode = baseComponent(initialState);
  render($root, oldVNode);

  return function updateView(newState) {
    const newVNode = baseComponent(newState);
    rerender($root, oldVNode, newVNode);
    oldVNode = newVNode;
  };
}

export default mount;
