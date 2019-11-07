import * as R from 'ramda';

/**
 * Returns id attribute of vNode if they have or undefined
 * @param {Object} vNode - vNode object
 * @returns {string|undefined}
 */
const getVNodeId = R.pathOr(undefined, ['attrs', 'id']);

/**
 * `aVnode` is `bVnode` if they has got same type and
 * same id. If vNode hasn't got id return integer -1
 * @param {Object} aVnode
 * @param {Object} bVnode
 * @returns {boolean}
 */
const isVNodesSame = R.allPass([
  R.eqProps('type'),
  R.unapply(
    R.pipe(
      R.ap([getVNodeId]),
      R.apply(R.equals),
    ),
  ),
]);

export default isVNodesSame;
