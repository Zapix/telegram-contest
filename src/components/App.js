import * as R from 'ramda';

import { createElement } from 'utils/vdom';

import Header from './Header';
import MainSection from './MainSection';
import ToDoPage from './ToDoPage';
import Footer from './Footer';

export default function App(state) {
  /* eslint-disable */
  // Need to check state changes for now
  console.log(state);
  /* eslint-enable */

  if (!state) {
    return createElement('h4', null, 'Loading...');
  }

  return createElement(
    'div',
    { id: 'base-app' },
    [
      Header(),
      MainSection(ToDoPage(R.prop('todo', state))),
      Footer(),
    ],
  );
}
