import * as R from 'ramda';

import isVNode from './isVNode';

/**
 *  Adds element to its parent.
 *
 *  SIDE EFFECT!
 *
 *  @param {HTMLElement} parentNode - parents element
 *  @param {HTMLElement} newNode - node that will be appended
 */
const appendNode = R.curryN(2)((parrentNode, newNode) => parrentNode.append(newNode));

/**
 * Creates HTMLElement
 */
const createHtmlElement = (x) => document.createElement(x);

/**
 * Sets attribute for node
 *
 * SIDE EFFECT!
 *
 * @param {HTMLElement} node
 * @param {string} key
 * @param {string} value
 */
const setAttribute = R.curry((node, key, value) => node.setAttribute(key, value));


/**
 * Sets attributes from `attrs` argument to `node` element
 *
 * SIDE EFFECT!
 *
 * @param {HTMLElement} node - node element
 * @param {Object} attrs - attributes that should be set
 */
const setAttributes = R.curry((node, attrs) => {
  const isHandler = R.pipe(R.nthArg(1), R.startsWith('on'));

  R.pipe(
    R.pickBy(R.pipe(isHandler, R.not)),
    R.toPairs,
    R.forEach(
      R.pipe(
        R.apply(setAttribute(node)),
      ),
    ),
  )(attrs);

  R.pipe(
    R.pickBy(isHandler),
    R.toPairs(),
    R.forEach(([eventName, handler]) => {
      node.addEventListener(R.slice(2, Infinity, eventName), handler);
    }),
  )(attrs);

  return node;
});

/**
 * Creates node element for virtual node, and attached them  to virtual node object
 *
 * SIDE EFFECT!
 *
 * @param {Object} vNode - virtual node object that should be used
 * @returns {Object} updated virtual dom node
 */
function createNode(vNode) {
  const setAttributesForNode = R.pipe(
    R.prop('attrs'),
    R.flip(setAttributes),
  )(vNode);

  /* eslint-disable */
  vNode._node = R.pipe( // need reassign property to keep info about virtual dom
    R.prop('type'),
    createHtmlElement,
    setAttributesForNode,
  )(vNode);
  /* eslint-enable */

  return vNode;
}


/**
 * Renders vNode and attached them to parentNode.
 * if vNode is a string then appends it to parentNode
 * if vNode is a virtual dom object then apply it
 *
 * SIDE EFFECT!
 *
 * @param {HTMLElement} parentNode is a virtual dom node or HTMLElement
 * @param vNode
 */
function render(parentNode, vNode) {
  const appendToParent = appendNode(parentNode);

  /**
   * renders children for parentVNode
   *
   * SIDE EFFECT !
   *
   * @param {Object} parentVNode
   * @returns {Object}
   */
  function renderChildren(parentVNode) {
    const renderToParentVNode = R.pipe(
      R.prop('_node'),
      R.curry(render),
    )(parentVNode);

    R.pipe(
      R.prop('children'),
      R.forEach(renderToParentVNode),
    )(parentVNode);

    return parentVNode;
  }

  R.cond([
    [R.is(String), appendToParent],
    [
      isVNode,
      R.pipe(
        createNode,
        renderChildren,
        R.prop('_node'),
        appendToParent,
      ),
    ],
  ])(vNode);
}

export default render;
