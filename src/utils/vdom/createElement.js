import * as R from 'ramda';

import isVNode from './isVNode';

/**
 * Wraps single element to array
 * @param x
 * @returns {*[]}
 */
const wrapToArray = (x) => [x];

/**
 * Creates new virtual dom node object.
 * @param {string} type - name of type that will be created
 * @param {Object} attributes - types that will be assigned for current node
 * @param {Object[]|Object} [children] - list of vNodes children
 */
const createElement = R.applySpec({
  __vnode: R.T,
  type: R.nthArg(0),
  attrs: R.pipe(
    R.nthArg(1),
    R.cond([
      [R.is(Object), R.identity],
      [R.T, R.always({})],
    ]),
  ),
  children: R.pipe(
    R.nthArg(2),
    R.cond([
      [R.is(Array), R.identity],
      [isVNode, wrapToArray],
      [R.T, R.always([])],
    ]),
  ),
});

export default createElement;
