import * as R from 'ramda';
/**
 * `aVNode` equals `bVNode` if they have same type and same attributes.
 * ATTENTION: function doesn't compare `_node` and `_children` attributes
 * @param {Object} aVnode
 * @param {Object} bVnode
 * @returns {boolean}
 */
const isVNodesEqual = R.allPass([
  R.eqProps('type'),
  R.eqProps('attrs'),
]);

export default isVNodesEqual;
