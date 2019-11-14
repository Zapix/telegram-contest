import { createElement } from 'utils/vdom';
import { LoginPage } from 'components/pages';

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
      LoginPage(state),
    ],
  );
}
