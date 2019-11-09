import { mount } from 'utils/vdom';
import { buildStateStream, combineReducers, dispatchInit } from 'utils/store';

import { reducer as todoReducer } from 'state/todo';

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
