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
export const createHtmlElement = (x) => document.createElement(x);

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

const pickHandlers = R.pickBy(R.allPass([
  R.pipe(R.nthArg(0), R.is(Function)),
  R.pipe(R.nthArg(1), R.startsWith('on')),
]));

const pickAttributes = R.pickBy(R.pipe(R.nthArg(1), R.startsWith('on'), R.not));

/**
 * Sets attributes from `attrs` argument to `node` element
 *
 * SIDE EFFECT!
 *
 * @param {HTMLElement} node - node element
 * @param {Object} attrs - attributes that should be set
 */
export const setAttributes = R.curry((node, attrs) => {
  R.pipe(
    pickAttributes,
    R.toPairs,
    R.forEach(
      R.pipe(
        R.apply(setAttribute(node)),
      ),
    ),
  )(attrs);

  return node;
});

/**
 * Sets handlers from `attrs` argument to `node` element
 * handler is attributes that key starts with "on" and value is a function
 *
 * SIDE EFFECT!
 *
 * @param {HTMLElement} node - node element
 * @param {Object} attrs - attributes that should be set
 */
export const setHandlers = R.curry((node, attrs) => {
  R.pipe(
    pickHandlers,
    R.toPairs(),
    R.forEach(([eventName, handler]) => {
      node.addEventListener(R.slice(2, Infinity, eventName), handler);
    }),
  )(attrs);

  return node;
});


/**
 * Remove handlers that have been set in attrs
 *
 * SIDE EFFECT!
 *
 * @param {HTMLElement} node - node element
 * @param {Object} attrs - attributes that should be set
 */
export const clearHandlers = R.curry((node, attrs) => {
  R.pipe(
    pickHandlers,
    R.toPairs(),
    R.forEach(([eventName, handler]) => {
      node.removeEventListener(R.slice(2, Infinity, eventName), handler);
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

  const setHandlersForNode = R.pipe(
    R.prop('attrs'),
    R.flip(setHandlers),
  )(vNode);

  /* eslint-disable */
  vNode._node = R.pipe( // need reassign property to keep info about virtual dom
    R.prop('type'),
    createHtmlElement,
    setAttributesForNode,
    setHandlersForNode,
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
