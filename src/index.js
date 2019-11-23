import * as R from 'ramda';
import { mount } from 'utils/vdom';
import { buildStateStream, combineReducers, dispatchInit } from 'utils/store';
import { reducer as todoReducer } from 'state/todo';
import { createAuthorizationKey, ping, httpWait, sendAuthCode } from 'utils/mtproto';

import './style.scss';
import App from './components/App';
import { getNRandomBytes, getRandomInt, uint8ArrayToHex } from './utils/mtproto/utils';

const div = document.createElement('h1');
div.setAttribute('id', 'app');
document.body.append(div);

const updateView = mount(div, App, null);

const state$ = buildStateStream(combineReducers({
  todo: todoReducer,
}));

state$.subscribe(updateView);
dispatchInit();

createAuthorizationKey().then(({ authKey, authKeyId, serverSalt }) => {
  const sessionId = getNRandomBytes(8);
  ping(authKey, authKeyId, serverSalt, sessionId);
  sendAuthCode(authKey, authKeyId, serverSalt, sessionId, '79625213997');
});
