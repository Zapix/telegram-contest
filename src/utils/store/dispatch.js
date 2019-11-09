import * as R from 'ramda';

import { STORE_UPDATE_EVENT, INIT_ACTION } from './constants';
/**
 * Fires `CustomEvent` that has got  detail object as
 * @param {string} type - type of action that will be send
 * @param {*} payload - payload that will be sent
 */
function dispatch(type, payload) {
  const event = new CustomEvent(STORE_UPDATE_EVENT, { detail: { type, payload } });
  document.dispatchEvent(event);
}

export const dispatchInit = R.partial(dispatch, [INIT_ACTION, true]);

export default dispatch;
