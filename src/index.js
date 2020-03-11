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
import { reducer as authReducer, applyMiddleware as authApplyMiddleware } from 'state/auth';
import { reducer as pageReducer } from 'state/pages';
import {
  MTProto,
  methodFromSchema,
} from 'utils/mtproto';
import schema from 'utils/mtproto/tl/schema/layer108';

import './style.scss';
import App from './components/App';
import { getMessageId } from './utils/mtproto/utils';
import { PING_REQUESTED } from './state/todo/constants';
import { AUTH_KEY_CREATED, STATUS_CHANGED_EVENT } from './utils/mtproto/MTProto';
import {
  API_ID,
  PING_TYPE, TYPE_KEY,
} from './utils/mtproto/constants';

const div = document.createElement('h1');
div.setAttribute('id', 'app');
document.body.append(div);

const updateView = mount(div, App, null);

const state$ = buildStateStream(combineReducers({
  page: pageReducer,
  auth: authReducer,
  todo: todoReducer,
}));

const action$ = getActionStream();

state$.subscribe(updateView);
dispatchInit();

const url = 'http://149.154.167.40/apiw';
const method = R.partial(methodFromSchema, [schema]);
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
connection.addEventListener(STATUS_CHANGED_EVENT, (e) => {
  if (e.status === 'AUTH_KEY_CREATED') {
    const obj = method(
      'invokeWithLayer',
      {
        layer: 108,
        query: method(
          'initConnection',
          {
            api_id: API_ID,
            device_model: navigator.userAgent,
            system_version: navigator.platform,
            app_version: '0.0.1',
            system_lang_code: navigator.language,
            lang_pack: '',
            lang_code: 'ru-ru',
            query: method('help.getConfig'),
          },
        ),
      },
    );
    connection.request(obj);
  }
});
connection.init();
