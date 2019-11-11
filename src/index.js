import { mount } from 'utils/vdom';
import { buildStateStream, combineReducers, dispatchInit } from 'utils/store';
import { reducer as todoReducer } from 'state/todo';
import {
  getInitialDHExchangeMessage,
  parseResponsePQ,
  buildPQInnerData,
  areNonceEqual,
} from 'utils/mtproto/createAuthorizationKey';

import './style.css';
import App from './components/App';

const div = document.createElement('h1');
div.setAttribute('id', 'app');
document.body.append(div);

const updateView = mount(div, App, null);

const state$ = buildStateStream(combineReducers({
  todo: todoReducer,
}));

state$.subscribe(updateView);
dispatchInit();

const initDHMessage = getInitialDHExchangeMessage();

fetch(
  'http://149.154.167.40/apiw',
  {
    method: 'POST',
    mode: 'cors',
    body: initDHMessage.buffer,
  }
)
  .then(response => response.arrayBuffer())
  .then(buffer => {
    console.log('Parse response PQ');

    const responsePQ = parseResponsePQ(buffer);
    if (!areNonceEqual(initDHMessage, responsePQ)) {
      throw Error("Nonce are not equal");
    }
    buildPQInnerData(responsePQ);
  });
