/* eslint-disable no-param-reassign */
import * as R from 'ramda';
import isVNodesSame from './isVNodesSame';
import render, {
  createHtmlElement,
  setAttributes,
  clearHandlers,
  setHandlers,
} from './render';

/**
 * Finds difference between old vNodes and newVNodes assign side effects for new nodes
 *
 * SIDE EFFECT!
 *
 * @param {HTMLElement} parent$ - parent HTMLElement object what will be use to render new nodes
 * @param {Object} oldVNodes - vNode that should be updated
 * @param {Object} newVNodes - new vNode
 */
function rerenderChildren(parent$, oldVNodes, newVNodes) {
  let oldNodeIdx = 0;

  function updateVNode($parent, oldVNode, newVNode) {
    if ($parent.children.length === 0 && R.is(String, oldVNode) && R.is(String, newVNode)) {
      $parent.textContent = newVNode;
    } else {
      rerenderChildren(oldVNode._node, oldVNode.children, newVNode.children);
      setAttributes(oldVNode._node, newVNode.attrs);
      clearHandlers(oldVNode._node, oldVNode.attrs);
      setHandlers(oldVNode._node, newVNode.attrs);
      newVNode._node = oldVNode._node;
    }
  }

  for (let i = 0; i < newVNodes.length; i += 1) {
    // Find same node
    let j = oldNodeIdx;
    while (j < oldVNodes.length && !isVNodesSame(oldVNodes[j], newVNodes[i])) j += 1;

    // if same node has been find
    if (j < oldVNodes.length) {
      for (let r = oldNodeIdx; r < j; r += 1) { // remove unused nodes
        oldVNodes[r]._node.remove();
      }

      updateVNode(parent$, oldVNodes[j], newVNodes[i]);

      if (!R.is(String, newVNodes[i])) {
        newVNodes[i]._node = oldVNodes[j]._node;
      }
      oldNodeIdx = j + 1;
    } else {
      // if node has not been found
      const bufElement = createHtmlElement('div');
      render(bufElement, newVNodes[i]);

      if (oldNodeIdx < oldVNodes.length) {
        oldVNodes[oldNodeIdx]._node.before(bufElement.children[0]);
      } else {
        parent$.append(bufElement.children[0]);
      }
    }
  }

  for (let j = oldNodeIdx; j < oldVNodes.length; j += 1) {
    if (R.is(Object, oldVNodes[j])) {
      oldVNodes[j]._node.remove();
    }
  }
}

/**
 *
 * SIDE EFFECT!
 *
 * Finds difference between old vNodes and newVNodes
 * @param {HTMLElement} parent$ - parent HTMLElement object what will be use to render new nodes
 * @param {Object} oldVNodes - vNode that should be updated
 * @param {Object} newVNodes - new vNode
 */
function rerender(parent$, oldVNode, newVNode) {
  rerenderChildren(parent$, [oldVNode], [newVNode]);
}

export default rerender;
