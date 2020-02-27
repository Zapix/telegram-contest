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
  MTProto,
} from 'utils/mtproto';
import schema from 'utils/mtproto/tl/schema/layer5';

import './style.scss';
import App from './components/App';
import { getMessageId } from './utils/mtproto/utils';
import { AUTH_REQUESTED, PING_REQUESTED } from './state/todo/constants';
import { AUTH_KEY_CREATED, STATUS_CHANGED_EVENT } from './utils/mtproto/MTProto';
import {
  API_HASH, API_ID, PING_TYPE, TYPE_KEY,
} from './utils/mtproto/constants';
import { methodFromSchema } from './utils/mtproto/tl';

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

const url = 'http://149.154.167.40/apiw';
const connection = new MTProto(url, schema);

const method = R.partial(methodFromSchema, [schema]);

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

    action$.pipe(
      filter(isActionOf(AUTH_REQUESTED)),
    ).subscribe((item) => {
      const { payload: phone } = item;
      const message = method(
        'auth.sendCode',
        {
          phone_number: phone,
          api_id: API_ID,
          sms_type: 0,
          lang_code: 'ru',
          api_hash: API_HASH,
        },
      );
      connection
        .request(message)
        .then((result) => {
          console.log('Message has been sent to phone');
          console.log(result);
        })
        .catch((reason) => {
          console.log('Error on phone sent');
          console.log(reason);
        });
    });
  } else {
    console.error('Failed to create auth key');
  }
});
connection.init();
