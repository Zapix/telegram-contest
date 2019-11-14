import * as R from 'ramda';

import { createElement } from 'utils/vdom';

import { CenterLayout } from 'components/layout';
import ToDoPage from './ToDoPage';

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
      CenterLayout(ToDoPage(R.prop('todo', state))),
    ],
  );
}
