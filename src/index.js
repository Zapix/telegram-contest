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
import { reducer as authReducer, applyMiddleware as authApplyMiddleware } from 'state/auth';
import {
  MTProto,
} from 'utils/mtproto';
import schema from 'utils/mtproto/tl/schema/layer5';

import './style.scss';
import App from './components/App';
import { getMessageId } from './utils/mtproto/utils';
import { PING_REQUESTED } from './state/todo/constants';
import { AUTH_KEY_CREATED, STATUS_CHANGED_EVENT } from './utils/mtproto/MTProto';
import {
  PING_TYPE, TYPE_KEY,
} from './utils/mtproto/constants';

const div = document.createElement('h1');
div.setAttribute('id', 'app');
document.body.append(div);

const updateView = mount(div, App, null);

const state$ = buildStateStream(combineReducers({
  auth: authReducer,
  todo: todoReducer,
}));

const action$ = getActionStream();

state$.subscribe(updateView);
dispatchInit();

const url = 'http://149.154.167.40/apiw';
const connection = new MTProto(url, schema);

authApplyMiddleware(action$, state$, connection);

connection.addEventListener(STATUS_CHANGED_EVENT, (e) => {
  console.log(e);
  if (e.status === AUTH_KEY_CREATED) {
    action$.pipe(
      filter(isActionOf(PING_REQUESTED)),
    ).subscribe((item) => {
      console.log('Send ping request to telegram server ', item);
      connection.request({
        [TYPE_KEY]: PING_TYPE,
        pingId: getMessageId(),
      }).then((result) => {
        console.log(result);
      });
    });
  } else {
    console.error('Failed to create auth key');
  }
});
connection.init();
