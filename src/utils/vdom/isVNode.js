import R from 'ramda';

/**
 * Checks that passed js object has `__vnode` attribute
 * @type {Object} object
 * @returns {boolean}
 */
const hasVNodePrefix = R.propEq('__vnode', true);

/**
 * Checks that passed js object has `type` attribute and it is string
 * @type {Object} object
 * @returns {boolean}
 */
const hasType = R.propSatisfies(
  R.is(String),
  'type',
);

/**
 * Checks that passed js object has `attrs` attribute and it is object
 * @type {Object} object
 * @returns {boolean}
 */
const hasAttributes = R.propSatisfies(
  R.is(Object),
  'attrs',
);

/**
 * Checks that passed js object has `attrs` attribute and it is object
 * @type {Object} object
 * @returns {boolean}
 */
const hasChildren = R.propSatisfies(
  R.is(Array),
  'children',
);

/**
 * Flatten checks is valid vNode passed or not
 * @param {Object} vNode
 * @returns {boolean}
 */
const isValidVNodeJsObject = R.allPass([
  hasVNodePrefix,
  hasType,
  hasAttributes,
  hasChildren,
]);

/**
 * checks that virtual node is string or js vnode object
 * @param {Object|string} vNode
 * @returns {boolean}
 */
const isSimpleVNode = R.cond([
  [R.is(String), R.T],
  [R.is(Object), isValidVNodeJsObject],
  [R.T, R.F],
]);

/**
 * Check that current node is valid VDom node and each of children is valid VDom node
 * @param {Object} vNode
 * @returns {boolean}
 */
function isDeepVNode(vNode) {
  return isSimpleVNode(vNode) && R.all(isDeepVNode, R.propOr([], 'children', vNode));
}

/**
 * Checks that deep(second) argument is on
 */
const isDeepCheckRequired = R.pipe(R.nthArg(1), R.equals(true));

/**
 * Checks is vnode is a valid virtual dom node.
 * Description of valid virtual dom node could be found in README.md
 * @param {object|string} object - object that should be checks
 * @param {boolean} [deep] - recursively check virtual dom
 */
const isVNode = R.cond([
  [isDeepCheckRequired, isDeepVNode],
  [R.T, isSimpleVNode],
]);

export default isVNode;
