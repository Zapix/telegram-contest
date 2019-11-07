import * as R from 'ramda';

/**
 * `aVNode` equals `bVNode` if they have same type and same attributes.
 * ATTENTION: function doesn't compare `_node` and `_children` attributes
 * @param {Object} aVnode
 * @param {Object} bVnode
 * @returns {boolean}
 */
const isVNodesObjectsEqual = R.allPass([
  R.eqProps('type'),
  R.eqProps('attrs'),
]);

const areBothVNodesString = R.allPass([
  R.pipe(R.nthArg(0), R.is(String)),
  R.pipe(R.nthArg(0), R.is(String)),
]);

/**
 * Compares vNodes.
 * @param {Object|string} aVnode
 * @param {Object|string} bVnode
 * @returns {boolean}
 */
const isVNodesEqual = R.cond([
  [areBothVNodesString, R.equals],
  [R.T, isVNodesObjectsEqual],
]);

export default isVNodesEqual;
