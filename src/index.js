import forge from 'node-forge';

import { mount } from 'utils/vdom';
import { buildStateStream, combineReducers, dispatchInit } from 'utils/store';
import { reducer as todoReducer } from 'state/todo';
import {
  getInitialDHExchangeMessage,
  parseResponsePQ,
  buildPQInnerData,
  areNonceEqual,
  encryptPQInner,
  buildDHExchangeMessage,
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

Promise.race([
  fetch(
    'http://149.154.167.40/apiw',
    {
      method: 'POST',
      mode: 'cors',
      body: initDHMessage.buffer,
    },
  )
    .then(response => response.arrayBuffer())
    .then(buffer => {
      console.log('Parse response PQ');

      const responsePQ = parseResponsePQ(buffer);
      if (!areNonceEqual(initDHMessage, responsePQ)) {
        throw Error("Nonce are not equal");
      }

      const pqInnerData = buildPQInnerData(responsePQ);
      const encryptedData = encryptPQInner(responsePQ, pqInnerData);

      const exchangeMessage = buildDHExchangeMessage(responsePQ, pqInnerData, encryptedData);

      const exchangeData = new Uint8Array(exchangeMessage.buffer);
      let hex = '';
      for (let i=0; i < exchangeData.length; i++) {
        hex += `${exchangeData[i].toString(16).padStart(2, 0)} `;
      }
      console.log(hex);

      return fetch(
        'http://149.154.167.40/apiw',
        {
          method: 'POST',
          mode: 'cors',
          body: exchangeMessage.buffer,
        },
      );
    }),
  new Promise((resolve, reject) => setTimeout(reject, 120 * 100))
    .then(() => {
      console.log('request is too long');
    })
]);

