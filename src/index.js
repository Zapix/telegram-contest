import * as R from 'ramda';
import { filter } from 'rxjs/operators';

import { mount } from 'utils/vdom';
import {
  buildStateStream,
  combineReducers,
  dispatchInit,
  getActionStream,
  isActionOf,
} from 'utils/store';
import { reducer as todoReducer } from 'state/todo';
import {
  createAuthorizationKey,
  ping,
  httpWait,
  sendAuthCode,
  seqNoGenerator,
  tlLoads,
} from 'utils/mtproto';
import decryptMessage from 'utils/mtproto/decryptMessage';

import './style.scss';
import App from './components/App';
import { getNRandomBytes, uint8ArrayToHex } from './utils/mtproto/utils';
import { AUTH_REQUESTED, PING_REQUESTED, HTTP_WAIT } from './state/todo/constants';

const div = document.createElement('h1');
div.setAttribute('id', 'app');
document.body.append(div);

const updateView = mount(div, App, null);

const state$ = buildStateStream(combineReducers({
  todo: todoReducer,
}));

const action$ = getActionStream();

state$.subscribe(updateView);
dispatchInit();

createAuthorizationKey().then(({ authKey, authKeyId, serverSalt }) => {
  const sessionId = getNRandomBytes(8);
  const decrypt = R.partial(decryptMessage, [authKey, authKeyId, serverSalt, sessionId]);
  const genSeqNo = seqNoGenerator();
  const getSeqNo = () => genSeqNo.next().value;

  action$.pipe(
    filter(isActionOf(PING_REQUESTED)),
  ).subscribe((item) => {
    console.log('Send ping request to telegram server ', item);
    ping(authKey, authKeyId, serverSalt, sessionId, getSeqNo())
      .then((response) => response.arrayBuffer())
      .then(decrypt)
      .then((message) => {
        console.log('Message byteLength', message.byteLength);
        console.log(uint8ArrayToHex(new Uint8Array(message)));
        console.log(tlLoads(message));
      });
  });

  action$.pipe(
    filter(isActionOf(HTTP_WAIT)),
  ).subscribe((item) => {
    console.log('Send Http Wait request ', item);

    httpWait(authKey, authKeyId, serverSalt, sessionId, getSeqNo())
      .then((response) => response.arrayBuffer())
      .then(decrypt)
      .then((message) => {
        console.log('Http Wait Result: ', uint8ArrayToHex(new Uint8Array(message)));
        console.log(tlLoads(message));
      });
  });

  action$.pipe(
    filter(isActionOf(AUTH_REQUESTED)),
  ).subscribe((item) => {
    console.log('Auth requested', item);
    const { payload } = item;

    sendAuthCode(authKey, authKeyId, serverSalt, sessionId, getSeqNo(), payload)
      .then((response) => response.arrayBuffer())
      .then(decrypt)
      .then((message) => {
        console.log(uint8ArrayToHex(new Uint8Array(message)));
        console.log(tlLoads(message));
      });
  });
});
